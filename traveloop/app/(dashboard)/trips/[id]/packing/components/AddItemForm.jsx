"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

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

export default function AddItemForm({ tripId, onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/packing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), category })
      });

      if (res.ok) {
        const newItem = await res.json();
        onAdd(newItem);
        setName("");
        toast.success(`"${newItem.name}" added to checklist!`);
      } else {
        toast.error("Failed to add item");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Item Name</label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Passport, Charger..."
              className="h-12 border-2 border-black rounded-none font-mono text-xs focus-visible:ring-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 border-2 border-black rounded-none font-mono text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white uppercase">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none border-2 border-black">
                {PACKING_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat} className="font-mono text-[10px] uppercase">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-10 px-6 border-2 border-black rounded-none font-black uppercase text-[10px] tracking-widest hover:bg-gray-100"
          >
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button
            type="submit"
            disabled={!name.trim() || loading}
            className="h-10 px-8 bg-black text-white border-2 border-black rounded-none font-black uppercase text-[10px] tracking-widest shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" /> Add Item
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
