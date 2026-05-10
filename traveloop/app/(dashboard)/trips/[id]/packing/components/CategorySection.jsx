"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Trash2, Edit3, Flag } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const ItemRow = ({ item, onUpdate, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);

  const handleToggle = (checked) => {
    onUpdate(item.id, { isPacked: checked });
  };

  const handlePriority = () => {
    onUpdate(item.id, { isPriority: !item.isPriority });
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== item.name) {
      onUpdate(item.id, { name: editName.trim() });
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={() => setIsEditing(true)}
      className={cn(
        "group flex items-center justify-between p-3 border-2 border-transparent border-b-gray-100 hover:border-black hover:bg-gray-50 transition-all",
        item.isPacked && "bg-gray-50/50"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <Checkbox 
            checked={item.isPacked}
            onCheckedChange={handleToggle}
            className="h-5 w-5 rounded-none border-2 border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
          />
          {item.isPriority && (
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-600 rounded-full border border-white" />
          )}
        </div>

        {isEditing ? (
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
            className="bg-transparent border-b-2 border-black outline-none font-mono text-xs w-full py-0"
          />
        ) : (
          <span 
            className={cn(
              "text-xs font-bold uppercase tracking-tight transition-all duration-300",
              item.isPacked ? "text-gray-400 line-through decoration-black decoration-2" : "text-black",
              item.isPriority && !item.isPacked && "text-red-700"
            )}
          >
            {item.name}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isHovered && !isEditing && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-1"
          >
            <button 
              onClick={handlePriority}
              className={cn(
                "p-1.5 transition-colors",
                item.isPriority ? "text-red-600" : "text-gray-300 hover:text-red-400"
              )}
            >
              <Flag className={cn("h-3.5 w-3.5", item.isPriority && "fill-current")} />
            </button>
            <button 
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-gray-300 hover:text-black transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => onDelete(item.id)}
              className="p-1.5 text-gray-300 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CategorySection = ({ title, items, onUpdate, onDelete }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const total = items.length;
  const packed = items.filter(i => i.isPacked).length;
  const isComplete = total > 0 && total === packed;
  const percent = total > 0 ? (packed / total) * 100 : 0;

  return (
    <div className="space-y-2">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "w-full flex items-center justify-between p-4 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
          isComplete ? "bg-green-50 border-green-600" : "bg-white"
        )}
      >
        <div className="flex items-center gap-4">
          {/* Mini Progress Ring */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-100"
              />
              <motion.circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="62.8"
                initial={{ strokeDashoffset: 62.8 }}
                animate={{ strokeDashoffset: 62.8 - (62.8 * percent) / 100 }}
                transition={{ duration: 1 }}
                className={isComplete ? "text-green-500" : "text-blue-600"}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black">
              {Math.round(percent)}%
            </span>
          </div>

          <h3 className={cn(
            "text-sm font-black uppercase italic tracking-tighter",
            isComplete && "text-green-700"
          )}>
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <span className={cn(
            "font-mono text-xs font-black px-2 py-0.5 border-2 border-black",
            isComplete ? "bg-green-600 text-white border-green-600" : "bg-gray-50"
          )}>
            {packed}/{total}
          </span>
          <motion.div
            animate={{ rotate: isCollapsed ? -90 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </button>

      {/* Items List */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white border-2 border-black border-t-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="divide-y divide-gray-100">
              {items.map(item => (
                <ItemRow 
                  key={item.id} 
                  item={item} 
                  onUpdate={onUpdate} 
                  onDelete={onDelete} 
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategorySection;
