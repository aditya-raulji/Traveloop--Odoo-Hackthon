"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Loader2, 
  Lock, 
  MapPin, 
  ArrowRight,
  Plane
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PublicChecklistPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/public/checklist/${token}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          setError("Checklist not found or private");
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-black" />
        <p className="mt-4 font-black uppercase tracking-widest text-xs">Unpacking Shared Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
        <Lock className="h-16 w-16 text-red-600 mb-4" />
        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Access Denied</h2>
        <p className="font-mono text-xs text-gray-500 uppercase mb-8 max-w-sm">{error}</p>
        <Button asChild className="bg-black text-white rounded-none font-black uppercase px-8 h-12">
          <Link href="/">Back to Traveloop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24">
      {/* Public Header */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-blue-400 font-black uppercase text-[10px] tracking-[0.3em]">
            <Plane className="h-4 w-4" /> Shared Checklist
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-tight">
            {data.tripName}
          </h1>
          
          <div className="space-y-2 pt-4">
            <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
              <span>{data.stats.packed}/{data.stats.total} Packed</span>
              <span>{data.stats.percent}% Ready</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-none overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${data.stats.percent}%` }}
                className="h-full bg-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-8">
        <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-12">
          {Object.entries(data.categories).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center justify-between border-b-4 border-black pb-2">
                <h3 className="text-lg font-black uppercase italic tracking-tighter">{category}</h3>
                <span className="font-mono text-xs font-black bg-black text-white px-2">
                  {items.filter(i => i.isPacked).length}/{items.length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 py-1 group">
                    <div className={cn(
                      "w-5 h-5 border-2 border-black flex items-center justify-center transition-colors",
                      item.isPacked ? "bg-black" : "bg-gray-50"
                    )}>
                      {item.isPacked && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <span className={cn(
                      "text-[11px] font-bold uppercase tracking-tight",
                      item.isPacked ? "text-gray-400 line-through" : "text-black"
                    )}>
                      {item.name}
                    </span>
                    {item.isPriority && (
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full" title="Priority" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CTA Section */}
          <div className="pt-12 border-t-4 border-black text-center space-y-6">
            <div className="space-y-2">
              <h4 className="text-xl font-black uppercase italic tracking-tighter">Plan your own journey</h4>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Create checklists, itineraries, and budgets with Traveloop.
              </p>
            </div>
            <Button asChild size="lg" className="bg-blue-600 text-white border-2 border-black rounded-none font-black uppercase tracking-widest text-xs h-14 px-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <Link href="/signup" className="flex items-center gap-2">
                Get Started for Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="mt-20 text-center">
        <span className="font-black italic uppercase tracking-tighter text-2xl">
          Travel<span className="text-blue-600">oop</span>
        </span>
      </div>
    </div>
  );
}
