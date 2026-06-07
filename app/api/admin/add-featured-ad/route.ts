import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check admin permission
    if (!user || user.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      url,
      description,
      tool_name,
      logo_url,
      price_paid,
      status = "approved"
    } = body;

    // Validate required fields
    if (!url || !description || !tool_name) {
      return NextResponse.json(
        { error: "Missing required fields: url, description, tool_name" },
        { status: 400 }
      );
    }

    // Validate description length
    if (description.length > 40) {
      return NextResponse.json(
        { error: "Description must be 40 characters or less" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Insert the featured ad directly
    const { data: featuredAd, error: adError } = await adminClient
      .from("featured_ads")
      .insert({
        url,
        description,
        tool_name,
        logo_url: logo_url || null,
        price_paid: price_paid || null,
        status,
        user_id: user.id, // Admin as submitter
        submitted_at: new Date().toISOString(),
        rejection_message: null
      })
      .select()
      .single();

    if (adError) {
      console.error("Featured ad insertion error:", adError);
      return NextResponse.json(
        { error: "Failed to create featured ad: " + adError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, featuredAd });
  } catch (error) {
    console.error("Add featured ad error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
