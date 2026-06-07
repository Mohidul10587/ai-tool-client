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
      name,
      url,
      slug,
      overview,
      short_description,
      detail_description,
      category_id,
      subcategory_id,
      pricing,
      platform,
      logo_url,
      hero_image_url,
      pricing_info,
      key_features,
      use_cases,
      pros,
      cons,
      tags,
      status = "published"
    } = body;

    // Validate required fields
    if (!name || !url || !short_description || !category_id) {
      return NextResponse.json(
        { error: "Missing required fields: name, url, short_description, category_id" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Insert the tool directly to tools table (bypassing submission process)
    const { data: tool, error: toolError } = await adminClient
      .from("tool_submissions")
      .insert({
        name,
        url,
        slug,
        overview,
        short_description,
        detail_description,
        category_id: parseInt(category_id),
        subcategory_id: subcategory_id ? parseInt(subcategory_id) : null,
        pricing,
        platform,
        logo_url,
        hero_image_url,
        pricing_info,
        key_features,
        use_cases,
        pros: pros?.filter(Boolean) || [],
        cons: cons?.filter(Boolean) || [],
        tags: tags?.filter(Boolean) || [],
        status,
        user_id: user.id, // Admin as submitter
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (toolError) {
      console.error("Tool insertion error:", toolError);
      return NextResponse.json(
        { error: "Failed to create tool: " + toolError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, tool });
  } catch (error) {
    console.error("Add tool error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
