"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ToolForm } from "./tool-form";

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddToolModal({ isOpen, onClose }: AddToolModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <div className="bg-muted px-6 py-4 rounded-t-lg border-b shrink-0">
          <DialogTitle className="text-base font-semibold">Add New Tool</DialogTitle>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ToolForm onSuccess={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
