"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminSubmissionsList } from "@/components/admin-submissions-list";
import { AddToolModal } from "@/components/add-tool-modal";

interface ToolSubmissionsClientProps {
  submissions: any[];
  activeFilter: string;
}

export function ToolSubmissionsClient({ submissions, activeFilter }: ToolSubmissionsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tool Submissions</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Tool
        </Button>
      </div>
      <AdminSubmissionsList submissions={submissions} activeFilter={activeFilter} />
      <AddToolModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
