"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Plane, 
  Hotel, 
  Utensils, 
  Target, 
  FileText, 
  Calendar as CalendarIcon, 
  ArrowLeft,
  Share2,
  Printer,
  Download,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const SECTION_TYPES = {
  TRAVEL: { icon: Plane, color: "text-blue-500", bg: "bg-blue-50" },
  HOTEL: { icon: Hotel, color: "text-purple-500", bg: "bg-purple-50" },
  FOOD: { icon: Utensils, color: "text-orange-500", bg: "bg-orange-50" },
  ACTIVITY: { icon: Target, color: "text-green-500", bg: "bg-green-50" },
  GENERAL: { icon: FileText, color: "text-gray-500", bg: "bg-gray-50" },
};

export default function TripViewPage() {
  const params = useParams();
  const router = useRouter();
  const { id: tripId } = params;

  const [trip, setTrip] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsRes, allTripsRes] = await Promise.all([
          fetch(`/api/trips/${tripId}/sections`),
          fetch("/api/trips")
        ]);

        if (sectionsRes.ok) {
          const data = await sectionsRes.json();
          setSections(data.sort((a, b) => a.order - b.order));
        }

        if (allTripsRes.ok) {
          const allTrips = await allTripsRes.json();
          const currentTrip = allTrips.find(t => t.id === tripId);
          setTrip(currentTrip);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tripId]);

  const totalBudget = useMemo(() => {
    return sections.reduce((acc, s) => {
      return acc + (s.sectionBudgets?.reduce((a, c) => a + c.amount, 0) || 0);
    }, 0);
  }, [sections]);

  const budgetByCategory = useMemo(() => {
    const cats = {};
    sections.forEach(s => {
      s.sectionBudgets?.forEach(b => {
        cats[b.category] = (cats[b.category] || 0) + b.amount;
      });
    });
    return cats;
  }, [sections]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-12 h-12 border-4 border-black border-t-blue-500 rounded-full animate-spin mb-4" />
      <span className="font-black uppercase italic tracking-tighter">Loading Your Masterplan...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* Top Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b-4 border-black px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="hover:bg-gray-100 rounded-none border-2 border-transparent hover:border-black transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="h-8 w-1 bg-gray-200" />
          <h1 className="font-black uppercase italic tracking-tighter text-xl hidden sm:block">
            {trip?.name} <span className="text-gray-400 font-normal">/ Itinerary</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-2 border-black rounded-none hidden sm:flex">
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          <Button className="bg-black text-white rounded-none font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] hover:shadow-none transition-all">
            <Share2 className="h-4 w-4 mr-2" /> Share Trip
          </Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-12 flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: Timeline */}
        <div className="flex-1">
          <div className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2 block">JOURNEY_DETAILS</span>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4">The Masterplan</h2>
            <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {trip?.startDate ? format(new Date(trip.startDate), "PPP") : "TBD"}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {sections.length} Stops Planned
              </div>
            </div>
          </div>

          <div className="space-y-12 relative">
            {/* Connecting Line */}
            <div className="absolute left-6 top-10 bottom-10 w-1 bg-gray-100 -z-10" />

            {sections.map((section, idx) => {
              const type = SECTION_TYPES[section.sectionType] || SECTION_TYPES.GENERAL;
              const sectionTotal = section.sectionBudgets?.reduce((a, c) => a + c.amount, 0) || 0;

              return (
                <motion.div 
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-6 group"
                >
                  <div className="relative">
                    <div className={cn(
                      "w-12 h-12 border-4 border-black flex items-center justify-center transition-all group-hover:scale-110 bg-white relative z-10",
                      section.isPlanned && "bg-green-50 shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]"
                    )}>
                      <type.icon className={cn("h-6 w-6", type.color)} />
                    </div>
                  </div>

                  <div className="flex-1 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase text-gray-400">Step {idx + 1}</span>
                          {section.isPlanned && <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-green-500 text-white italic">Confirmed</span>}
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight">
                          {section.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Estimated Cost</span>
                        <span className="text-lg font-black tracking-tighter">₹{sectionTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {section.description && (
                      <p className="text-gray-600 font-bold text-sm mb-6 leading-relaxed whitespace-pre-wrap">
                        {section.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 border-l-4 border-black p-3">
                        <span className="text-[8px] font-black uppercase text-gray-400 block mb-1">Duration</span>
                        <div className="flex items-center gap-2 font-bold text-xs uppercase">
                          <Clock className="h-3 w-3 text-blue-500" />
                          {section.startDate ? format(new Date(section.startDate), "MMM dd") : "—"}
                          <ChevronRight className="h-3 w-3" />
                          {section.endDate ? format(new Date(section.endDate), "MMM dd") : "—"}
                        </div>
                      </div>
                      {section.attachmentUrl && (
                        <a 
                          href={section.attachmentUrl} 
                          target="_blank"
                          className="bg-blue-50 border-l-4 border-blue-500 p-3 hover:bg-blue-100 transition-colors group/link"
                        >
                          <span className="text-[8px] font-black uppercase text-blue-600 block mb-1">Resource Link</span>
                          <div className="flex items-center gap-2 font-bold text-xs text-blue-700 uppercase">
                            <ExternalLink className="h-3 w-3" />
                            View Booking
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sidebar Stats */}
        <div className="lg:w-80">
          <div className="sticky top-28 space-y-6">
            
            {/* Budget Card */}
            <div className="bg-black text-white p-6 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4 block">FINANCIAL_OVERVIEW</span>
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Total Trip Investment</span>
                <div className="text-4xl font-black tracking-tighter italic">₹{totalBudget.toLocaleString()}</div>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-white/10">
                {Object.entries(budgetByCategory).map(([cat, amount]) => (
                  <div key={cat} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-400">{cat}</span>
                    <span>₹{amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border-2 border-black p-6">
              <h4 className="font-black uppercase italic mb-4 flex items-center gap-2">
                <Target className="h-4 w-4" /> Next Steps
              </h4>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full border-2 border-black rounded-none h-11 font-black uppercase italic text-xs tracking-tighter shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
                  <Link href={`/trips/${tripId}/itinerary`}>Edit Itinerary</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-2 border-black rounded-none h-11 font-black uppercase italic text-xs tracking-tighter shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
                  <Link href={`/trips/${tripId}/packing`}>Packing List</Link>
                </Button>
              </div>
            </div>

            {/* Export */}
            <div className="p-4 border-2 border-dashed border-gray-300 flex flex-col items-center text-center">
              <Download className="h-6 w-6 text-gray-300 mb-2" />
              <p className="text-[10px] font-bold text-gray-400 uppercase leading-tight">
                Export itinerary as PDF for offline access
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
