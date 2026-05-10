"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, X, Loader2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import debounce from "lodash/debounce";
import { Suspense } from "react";

function SearchContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(saved);
  }, []);

  const updateSearch = useCallback(
    debounce((term) => {
      const params = new URLSearchParams(searchParams);
      if (term) params.set("q", term);
      else params.delete("q");
      router.push(`${pathname}?${params.toString()}`);

      // Update recent searches
      if (term && term.length > 2) {
        const saved = JSON.parse(localStorage.getItem("recentSearches") || "[]");
        const updated = [term, ...saved.filter(s => s !== term)].slice(0, 5);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
        setRecentSearches(updated);
      }
    }, 300),
    [pathname, searchParams, router]
  );

  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    updateSearch(value);
  };

  const removeRecent = (term) => {
    const updated = recentSearches.filter(s => s !== term);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const activeTab = pathname.includes("/cities") ? "cities" : "activities";

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-20">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 bg-gray-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Link 
            href="/search/activities"
            className={cn(
              "px-6 py-2 text-xs font-black uppercase italic transition-all",
              activeTab === "activities" ? "bg-black text-white" : "text-black hover:bg-gray-200"
            )}
          >
            🎯 Activities
          </Link>
          <Link 
            href="/search/cities"
            className={cn(
              "px-6 py-2 text-xs font-black uppercase italic transition-all",
              activeTab === "cities" ? "bg-black text-white" : "text-black hover:bg-gray-200"
            )}
          >
            🏙️ Cities
          </Link>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="relative mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
            <Input 
              placeholder={activeTab === "cities" ? "Search cities, countries..." : "Paragliding, Street food..."}
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="h-14 pl-12 border-4 border-black rounded-none bg-white text-lg font-black italic tracking-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] transition-all"
            />
            
            {/* Recent Searches Dropdown */}
            <AnimatePresence>
              {isFocused && recentSearches.length > 0 && !query && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border-4 border-black z-50 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-4"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">RECENT_SEARCHES</span>
                  <div className="space-y-1">
                    {recentSearches.map((term) => (
                      <div key={term} className="flex items-center justify-between group/item p-2 hover:bg-blue-50 transition-colors cursor-pointer">
                        <div onClick={() => { setQuery(term); updateSearch(term); }} className="flex-1 font-bold text-sm uppercase italic">
                          {term}
                        </div>
                        <button onClick={() => removeRecent(term)} className="p-1 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-2 h-14">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-full border-4 border-black rounded-none font-black uppercase italic text-xs px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
                  <LayoutGrid className="h-4 w-4 mr-2" /> Group By <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <DropdownMenuItem onClick={() => updateParams("group", "region")} className="rounded-none font-black uppercase italic text-[10px] cursor-pointer">Region</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateParams("group", "cost")} className="rounded-none font-black uppercase italic text-[10px] cursor-pointer">Cost Index</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateParams("group", null)} className="rounded-none font-black uppercase italic text-[10px] cursor-pointer">None</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-full border-4 border-black rounded-none font-black uppercase italic text-xs px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
                  <SlidersHorizontal className="h-4 w-4 mr-2" /> Filter <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <DropdownMenuItem onClick={() => updateParams("filter", "budget")} className="rounded-none font-black uppercase italic text-[10px] cursor-pointer">Budget Friendly</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateParams("filter", "popular")} className="rounded-none font-black uppercase italic text-[10px] cursor-pointer">Popular Only</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateParams("filter", null)} className="rounded-none font-black uppercase italic text-[10px] cursor-pointer">Clear Filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-full border-4 border-black rounded-none font-black uppercase italic text-xs px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
                  <ArrowUpDown className="h-4 w-4 mr-2" /> Sort By <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <DropdownMenuItem onClick={() => updateParams("sort", "popularity")} className="rounded-none font-black uppercase italic text-[10px] cursor-pointer">Popularity</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateParams("sort", "name")} className="rounded-none font-black uppercase italic text-[10px] cursor-pointer">Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateParams("sort", null)} className="rounded-none font-black uppercase italic text-[10px] cursor-pointer">Default</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Popular Tags - Always visible for quick access */}
        <div className="mt-6 flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-black uppercase text-gray-400 mr-2">Popular:</span>
          {["Paragliding", "Beach", "Temples", "Street Food", "Adventure", "Nightlife", "Museums"].map(tag => (
            <button 
              key={tag}
              onClick={() => { 
                setQuery(tag); 
                updateSearch(tag); 
                // Force sync URL immediately
                const params = new URLSearchParams(searchParams);
                params.set("q", tag);
                router.push(`${pathname}?${params.toString()}`);
              }}
              className={cn(
                "px-3 py-1 border-2 border-black text-[10px] font-black uppercase italic transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-y-[2px]",
                query === tag ? "bg-black text-white shadow-none" : "hover:bg-black hover:text-white"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}

export default function SearchLayout({ children }) {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-20 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <span className="font-black uppercase italic tracking-tighter">Initializing Search...</span>
      </div>
    }>
      <SearchContent>{children}</SearchContent>
    </Suspense>
  );
}
