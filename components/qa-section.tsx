"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface QAItem {
  id?: number;
  question: string;
  answer: string;
}

interface QASectionProps {
  qaItems: QAItem[];
  title?: string;
}

export function QASection({ qaItems, title = "Frequently Asked Questions" }: QASectionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  if (!qaItems || qaItems.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-black mb-4">{title}</h3>
      <div className="space-y-2">
        {qaItems.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-black pr-4">{item.question}</span>
              {openItems.has(index) ? (
                <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
              )}
            </button>
            {openItems.has(index) && (
              <div className="px-4 pb-4 text-gray-600">
                <div className="border-t border-gray-100 pt-3">
                  {item.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
