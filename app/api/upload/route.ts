import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/client";
import { checkSubscription } from "@/lib/middleware/subscription-check";

export async function POST(request: NextRequest) {
  // Check subscription tier and usage limits
  const subscriptionCheck = await checkSubscription(request);
  if (subscriptionCheck) {
    return subscriptionCheck;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Get file content as blob
    const buffer = await file.arrayBuffer();
    const blob = new Blob([buffer]);

    // Generate a unique filename
    const filename = `${userId}/${Date.now()}-${file.name}`;
    
    // Upload to Vercel Blob
    const { url } = await put(filename, blob, {
      access: 'public',
      contentType: file.type,
    });

    // Save reference in Supabase if needed
    const supabase = getSupabaseServiceClient();
    await supabase.from("user_files").insert({
      user_id: userId,
      file_name: file.name,
      file_url: url,
      file_type: file.type,
      file_size: file.size,
    });

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "An error occurred during file upload" },
      { status: 500 }
    );
  }
}