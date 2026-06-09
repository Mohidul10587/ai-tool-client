"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ToolForm } from "./tool-form";

type Submission = {
  id: string;
  url: string;
  status: "pending" | "published" | "rejected";
  submitted_at: string;
  name?: string; slug?: string; category_id?: number; subcategory_id?: number;
  category_snapshot?: string; subcategory_snapshot?: string;
  pricing?: string; overview?: string; logo_url?: string; hero_image_url?: string;
  platform?: string;
  pricing_info?: { model?: string; paidFrom?: string; billingFrequency?: string; freeTrial?: string };
  key_features?: { title: string; description: string }[];
  use_cases?: { title: string; audience: string; description: string }[];
  pros?: string[]; cons?: string[]; tags?: string[];
  qa_items?: { question: string; answer: string }[];
  short_description?: string; detail_description?: string;
};

interface Props {
  editing: Submission | null;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (status: Submission["status"], overrides?: Partial<Submission>) => void;
}

export function SubmissionEditModal({ editing, saving, error, onClose, onSave }: Props) {
  if (!editing) return null;
  return (
    <Dialog open={!!editing} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <div className="bg-muted px-6 py-4 rounded-t-lg border-b shrink-0">
          <DialogTitle className="text-base font-semibold">Edit Submission</DialogTitle>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ToolForm
            key={editing.id}
            initialData={editing}
            editMode
            saving={saving}
            error={error}
            onSuccess={(status, overrides) => onSave(status!, overrides)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
