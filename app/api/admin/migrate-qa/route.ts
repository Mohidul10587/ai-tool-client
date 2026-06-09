import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Instructions for manual migration
    const instructions = `
To add Q&A support, run this SQL command in your Supabase SQL editor:

ALTER TABLE tool_submissions ADD COLUMN IF NOT EXISTS qa_items JSONB DEFAULT '[]'::jsonb;
CREATE INDEX IF NOT EXISTS idx_tool_submissions_qa_items ON tool_submissions USING gin (qa_items);

Or use the Supabase dashboard SQL editor to run the migration.
    `;

    return NextResponse.json({ 
      success: true, 
      message: "Migration instructions",
      instructions 
    });
  } catch (error) {
    console.error("Migration info error:", error);
    return NextResponse.json({ error: "Failed to get migration info" }, { status: 500 });
  }
}
