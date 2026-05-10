"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  RotateCcw, 
  Share2, 
  Search, 
  Filter, 
  SortAsc, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronDown,
  LayoutGrid,
  ListFilter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import confetti from "canvas-confetti";

import CategorySection from "./components/CategorySection";
import AddItemForm from "./components/AddItemForm";
import SmartSuggestions from "./components/SmartSuggestions";

const PACKING_CATEGORIES = [
  "DOCUMENTS",
  "CLOTHING",
  "ELECTRONICS",
  "TOILETRIES",
  "MEDICINE",
  "SNACKS",
  "ACCESSORIES",
  "OTHER"
];

export default function PackingPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id;

  const [items, setItems] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, packed: 0, percent: 0 });
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  
  // Search & Filters
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState("CATEGORY");
  const [sortBy, setSortBy] = useState("CATEGORY");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilters, setCategoryFilters] = useState(PACKING_CATEGORIES);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/packing`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setStats(data.stats);
      }
    } catch (error) {
      toast.error("Failed to load checklist");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  const fetchTrips = useCallback(async () => {
    try {
      const res = await fetch("/api/trips");
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      }
    } catch (error) {
      console.error("Failed to fetch trips");
    }
  }, []);

  useEffect(() => {
    fetchItems();
    fetchTrips();
  }, [fetchItems, fetchTrips]);

  useEffect(() => {
    if (stats.percent === 100 && stats.total > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#22c55e", "#000000", "#ffffff"]
      });
      toast.success("🎉 All packed! Have an amazing trip!");
    }
  }, [stats.percent, stats.total]);

  const handleUpdateItem = async (itemId, data) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/packing/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        setItems(prev => prev.map(i => i.id === itemId ? updated : i));
        
        // Recalculate stats locally for better UX
        setItems(currentItems => {
          const newItems = currentItems.map(i => i.id === itemId ? updated : i);
          const total = newItems.length;
          const packed = newItems.filter(i => i.isPacked).length;
          setStats({
            total,
            packed,
            percent: total > 0 ? Math.round((packed / total) * 100) : 0
          });
          return newItems;
        });
      }
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/packing/${itemId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setItems(prev => {
          const newItems = prev.filter(i => i.id !== itemId);
          const total = newItems.length;
          const packed = newItems.filter(i => i.isPacked).length;
          setStats({
            total,
            packed,
            percent: total > 0 ? Math.round((packed / total) * 100) : 0
          });
          return newItems;
        });
        toast.success("Item removed");
      }
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const handleReset = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/packing/reset`, {
        method: "PATCH"
      });
      if (res.ok) {
        setItems(prev => prev.map(i => ({ ...i, isPacked: false })));
        setStats(prev => ({ ...prev, packed: 0, percent: 0 }));
        toast.success("Checklist reset");
      }
    } catch (error) {
      toast.error("Failed to reset checklist");
    } finally {
      setIsResetDialogOpen(false);
    }
  };

  const handleShare = async () => {
    try {
      const currentTrip = trips.find(t => t.id === tripId);
      if (!currentTrip) return;
      const shareUrl = `${window.location.origin}/share/checklist/${currentTrip.checklistShareToken}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Public share link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleAddItem = (newItem) => {
    setItems(prev => {
      const newItems = [...prev, newItem];
      const total = newItems.length;
      const packed = newItems.filter(i => i.isPacked).length;
      setStats({
        total,
        packed,
        percent: total > 0 ? Math.round((packed / total) * 100) : 0
      });
      return newItems;
    });
    setIsAddingItem(false);
  };

  // Filtered & Sorted Data
  const processedItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || 
        (statusFilter === "PACKED" && item.isPacked) || 
        (statusFilter === "UNPACKED" && !item.isPacked);
      const matchesCategory = categoryFilters.includes(item.category);
      return matchesSearch && matchesStatus && matchesCategory;
    });

    if (sortBy === "NAME_AZ") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "PACKED_FIRST") {
      filtered.sort((a, b) => (b.isPacked === a.isPacked ? 0 : b.isPacked ? 1 : -1));
    } else if (sortBy === "UNPACKED_FIRST") {
      filtered.sort((a, b) => (a.isPacked === b.isPacked ? 0 : a.isPacked ? 1 : -1));
    }

    return filtered;
  }, [items, search, statusFilter, categoryFilters, sortBy]);

  const groupedItems = useMemo(() => {
    if (groupBy === "STATUS") {
      return {
        "UNPACKED": processedItems.filter(i => !i.isPacked),
        "PACKED": processedItems.filter(i => i.isPacked),
      };
    }
    
    return PACKING_CATEGORIES.reduce((acc, cat) => {
      const catItems = processedItems.filter(i => i.category === cat);
      if (catItems.length > 0 || groupBy === "CATEGORY") {
        acc[cat] = catItems;
      }
      return acc;
    }, {});
  }, [processedItems, groupBy]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-black" />
        <p className="mt-4 font-black uppercase tracking-widest text-xs">Preparing your kit...</p>
      </div>
    );
  }

  const currentTrip = trips.find(t => t.id === tripId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-32">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
              Packing <span className="text-blue-600">Checklist</span>
            </h1>
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.2em]">// GEAR_READY_CHECK //</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={tripId} onValueChange={(id) => router.push(`/trips/${id}/packing`)}>
              <SelectTrigger className="w-[280px] border-2 border-black rounded-none font-mono text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white">
                <SelectValue placeholder="Select Trip" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-2 border-black">
                {trips.map(t => (
                  <SelectItem key={t.id} value={t.id} className="font-mono text-xs uppercase">
                    Trip: {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..." 
              className="pl-10 border-none rounded-none font-mono text-xs focus-visible:ring-0"
            />
          </div>

          <div className="h-8 w-[2px] bg-gray-200" />

          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-auto h-9 border-none bg-transparent font-black uppercase text-[10px] tracking-widest focus:ring-0 gap-2">
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Group By</span>
            </SelectTrigger>
            <SelectContent className="rounded-none border-2 border-black">
              <SelectItem value="CATEGORY" className="text-[10px] font-black uppercase">Category</SelectItem>
              <SelectItem value="STATUS" className="text-[10px] font-black uppercase">Status</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-auto h-9 border-none bg-transparent font-black uppercase text-[10px] tracking-widest focus:ring-0 gap-2">
              <SortAsc className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sort By</span>
            </SelectTrigger>
            <SelectContent className="rounded-none border-2 border-black">
              <SelectItem value="CATEGORY" className="text-[10px] font-black uppercase">Default</SelectItem>
              <SelectItem value="NAME_AZ" className="text-[10px] font-black uppercase">Name A-Z</SelectItem>
              <SelectItem value="PACKED_FIRST" className="text-[10px] font-black uppercase">Packed First</SelectItem>
              <SelectItem value="UNPACKED_FIRST" className="text-[10px] font-black uppercase">Unpacked First</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="h-9 font-black uppercase text-[10px] tracking-widest gap-2">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="border-l-4 border-black rounded-none">
              <SheetHeader>
                <SheetTitle className="font-black uppercase italic tracking-tighter text-2xl">Refine List</SheetTitle>
              </SheetHeader>
              <div className="py-8 space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {["ALL", "PACKED", "UNPACKED"].map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`text-left px-4 py-3 border-2 border-black font-black uppercase text-[10px] tracking-widest transition-all ${statusFilter === status ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]" : "bg-white hover:bg-gray-50"}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categories</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {PACKING_CATEGORIES.map(cat => (
                      <div key={cat} className="flex items-center space-x-2 border-2 border-black p-2 bg-white">
                        <Checkbox 
                          id={cat} 
                          checked={categoryFilters.includes(cat)}
                          onCheckedChange={(checked) => {
                            setCategoryFilters(prev => checked ? [...prev, cat] : prev.filter(c => c !== cat));
                          }}
                          className="rounded-none border-2 border-black"
                        />
                        <label htmlFor={cat} className="text-[9px] font-black uppercase tracking-widest leading-none cursor-pointer">
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <SheetFooter className="absolute bottom-6 left-6 right-6 flex-col gap-2">
                <Button 
                  onClick={() => { setStatusFilter("ALL"); setCategoryFilters(PACKING_CATEGORIES); }}
                  className="w-full rounded-none border-2 border-black font-black uppercase text-[10px] bg-white text-black hover:bg-gray-100"
                >
                  Clear All
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <p className="text-xs font-black uppercase tracking-widest">
            {stats.percent === 100 ? (
              <span className="text-green-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> All items packed!
              </span>
            ) : (
              `Progress: ${stats.packed}/${stats.total} items packed`
            )}
          </p>
          <span className="font-mono text-xs font-black">{stats.percent}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 border-2 border-black rounded-none overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${stats.percent}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            className={`h-full border-r-2 border-black ${stats.percent === 100 ? "bg-green-500" : "bg-blue-600"}`}
          />
        </div>
      </div>

      {/* Categories & Items */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {isAddingItem && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              className="overflow-hidden mb-6"
            >
              <AddItemForm 
                tripId={tripId} 
                onAdd={handleAddItem} 
                onCancel={() => setIsAddingItem(false)} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, catItems]) => (
            <CategorySection 
              key={category}
              title={category}
              items={catItems}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      </div>

      {/* Smart Suggestions */}
      <SmartSuggestions 
        trip={currentTrip} 
        currentItems={items} 
        onAdd={handleAddItem} 
      />

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-4 z-40">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Button 
            onClick={() => setIsAddingItem(true)}
            className="flex-[2] h-14 bg-black text-white rounded-none border-b-4 border-r-4 border-blue-600 font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add item to checklist
          </Button>

          <Button 
            variant="outline"
            onClick={() => setIsResetDialogOpen(true)}
            className="flex-1 h-14 border-2 border-black rounded-none font-black uppercase tracking-widest text-xs hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset all
          </Button>

          <Button 
            onClick={handleShare}
            className="flex-1 h-14 bg-white text-black border-2 border-black rounded-none font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Reset Dialog */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent className="border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase italic tracking-tighter text-2xl">Reset all items?</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-gray-600">
              This will uncheck all packed items. Your items will remain but all will be marked as unpacked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none border-2 border-black font-black uppercase text-[10px]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReset}
              className="rounded-none bg-red-600 text-white font-black uppercase text-[10px] border-2 border-black hover:bg-red-700"
            >
              Reset All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
