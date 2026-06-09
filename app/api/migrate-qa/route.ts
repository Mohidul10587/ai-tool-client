import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const adminClient = createAdminClient();
    
    // Add qa_items column if it doesn't exist
    const { error } = await adminClient.rpc('add_qa_items_column');
    
    if (error) {
      console.error("Migration error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: "Failed to run migration" }, { status: 500 });
  }
}
