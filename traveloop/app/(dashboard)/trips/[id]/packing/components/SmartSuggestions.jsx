"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Plus, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SUGGESTIONS = {
  BEACH: [
    { name: "Sunscreen", category: "TOILETRIES" },
    { name: "Swimwear", category: "CLOTHING" },
    { name: "Beach Towel", category: "ACCESSORIES" },
    { name: "Flip Flops", category: "CLOTHING" },
    { name: "Sunglasses", category: "ACCESSORIES" }
  ],
  COLD: [
    { name: "Warm Jacket", category: "CLOTHING" },
    { name: "Thermals", category: "CLOTHING" },
    { name: "Gloves & Beanie", category: "CLOTHING" },
    { name: "Lip Balm", category: "TOILETRIES" }
  ],
  INTERNATIONAL: [
    { name: "Universal Adapter", category: "ELECTRONICS" },
    { name: "Forex Card / Cash", category: "DOCUMENTS" },
    { name: "Passport", category: "DOCUMENTS" },
    { name: "Visa Documents", category: "DOCUMENTS" },
    { name: "Travel Insurance", category: "DOCUMENTS" }
  ],
  GENERAL: [
    { name: "Phone Charger", category: "ELECTRONICS" },
    { name: "Power Bank", category: "ELECTRONICS" },
    { name: "Toothbrush & Paste", category: "TOILETRIES" },
    { name: "Deodorant", category: "TOILETRIES" },
    { name: "Basic First Aid", category: "MEDICINE" }
  ]
};

export default function SmartSuggestions({ trip, currentItems, onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingIds, setLoadingIds] = useState(new Set());

  const tripSuggestions = useMemo(() => {
    if (!trip) return SUGGESTIONS.GENERAL;

    let list = [...SUGGESTIONS.GENERAL];
    
    // Check for beach destinations (hacky check for demo)
    const beachCities = ["Bali", "Goa", "Phuket", "Maldives", "Ibiza", "Santorini", "Miami"];
    const isBeachTrip = trip.stops?.some(stop => 
      beachCities.some(city => stop.city.name.includes(city))
    );

    if (isBeachTrip) list = [...list, ...SUGGESTIONS.BEACH];
    
    // Check for cold (hacky)
    const coldCities = ["Iceland", "Switzerland", "Shimla", "Manali", "Norway", "Canada"];
    const isColdTrip = trip.stops?.some(stop => 
      coldCities.some(city => stop.city.name.includes(city))
    );
    
    if (isColdTrip) list = [...list, ...SUGGESTIONS.COLD];

    // Check for international (hacky check if country != User's country, but let's assume if it has any stop it's worth suggesting)
    list = [...list, ...SUGGESTIONS.INTERNATIONAL];

    // Unique suggestions only
    return Array.from(new Map(list.map(s => [s.name, s])).values());
  }, [trip]);

  const handleAdd = async (suggestion) => {
    const id = suggestion.name;
    setLoadingIds(prev => new Set(prev).add(id));
    
    try {
      const res = await fetch(`/api/trips/${trip.id}/packing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(suggestion)
      });
      if (res.ok) {
        const newItem = await res.json();
        onAdd(newItem);
      }
    } catch (error) {
      console.error("Failed to add suggestion");
    } finally {
      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const isAlreadyAdded = (name) => {
    return currentItems.some(item => item.name.toLowerCase() === name.toLowerCase());
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group"
      >
        <div className="p-1 bg-yellow-100 border border-yellow-600 rounded-none group-hover:bg-yellow-200 transition-colors">
          <Lightbulb className="h-4 w-4 text-yellow-700" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">
          💡 Suggested Items
        </span>
        <ChevronDown className={cn("h-3 w-3 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pb-4">
              {tripSuggestions.map((s, idx) => {
                const added = isAlreadyAdded(s.name);
                const loading = loadingIds.has(s.name);

                return (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <button
                      disabled={added || loading}
                      onClick={() => handleAdd(s)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 border-2 font-black uppercase text-[9px] tracking-widest transition-all",
                        added 
                          ? "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed" 
                          : "bg-white border-black hover:bg-yellow-50 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                      )}
                    >
                      {added ? <Check className="h-3 w-3" /> : loading ? <div className="h-3 w-3 border-2 border-black border-t-transparent animate-spin rounded-full" /> : <Plus className="h-3 w-3" />}
                      {s.name}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
