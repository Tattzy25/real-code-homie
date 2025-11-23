import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/client";
import { StreamingTextResponse, streamText } from "ai";
import { getModel } from "@/lib/ai/model-router";
import { checkSubscription } from "@/lib/middleware/subscription-check";

export const maxDuration =30; // Allow streaming responses up to30 seconds
a
export async function POST(request: NextRequest) {
 // Check subscription tier and usage limits
 const subscriptionCheck = await checkSubscription(request);
 if (subscriptionCheck) {
 return subscriptionCheck;
 }

 try {
 const { message, conversationId, modelName = "default", persona = "default" } = await request.json();

 if (!message) {
 return NextResponse.json({ error: "Message is required" }, { status:400 });
 }

 // Get user from auth
 const supabase = getSupabaseServiceClient();

 const {
 data: { session },
 } = await supabase.auth.getSession();

 if (!session) {
 return NextResponse.json({ error: "Unauthorized" }, { status:401 });
 }

 const userId = session.user.id;

 // Get user's subscription tier
 const { data: userData, error: userError } = await supabase
 .from("users")
 .select("subscription_tier, usage_count")
 .eq("id", userId)
 .single();

 if (userError) {
 console.error("Error fetching user data:", userError);
 return NextResponse.json({ error: "Failed to fetch user data" }, { status:500 });
 }

 // Get conversation history
 let conversationHistory: any[] = [];
 if (conversationId) {
 const { data: messagesData, error: messagesError } = await supabase
 .from("messages")
 .select("role, content")
 .eq("conversation_id", conversationId)
 .order("created_at", { ascending: true })
 .limit(10); // Limit to last10 messages for context

 if (messagesError) {
 console.error("Error fetching conversation history:", messagesError);
 } else {
 conversationHistory = messagesData;
 }
 }

 // Get model configuration based on subscription tier and user preferences
 const { model, systemPrompt, provider } = getModel(userData.subscription_tier, modelName, persona);

 // Prepare messages for the AI
 const messages = [
 { role: "system", content: systemPrompt },
 ...conversationHistory,
 { role: "user", content: message },
 ];

 // Stream the response
 const result = streamText({
 model,
 messages,
 temperature:0.7,
 maxTokens:2048,
 });

 // Save user message to database
 if (conversationId) {
 await supabase.from("messages").insert({
 conversation_id: conversationId,
 role: "user",
 content: message,
 });
 }

 // Update user's usage count
 await supabase
 .from("users")
 .update({ usage_count: userData.usage_count +1 })
 .eq("id", userId);

 // Log usage
 await supabase.from("usage_logs").insert({
 user_id: userId,
 action_type: "chat_message",
 model: modelName,
 provider: provider,
 });

 // Create a TransformStream to capture the full response
 const fullResponseStream = new TransformStream();
 const writer = fullResponseStream.writable.getWriter();
 let fullResponse = "";

 // Process the stream
 // Using the current API methods from Vercel AI SDK
 result.onChunk = ({ content }) => {
   fullResponse = content;
 };

 result.onFinish = async () => {
   // Save assistant message to database when stream completes
   if (conversationId && fullResponse) {
     await supabase.from("messages").insert({
       conversation_id: conversationId,
       role: "assistant",
       content: fullResponse,
     });
   }

   await writer.close();
 };

 return new StreamingTextResponse(result);
 } catch (error) {
 console.error("Chat API error:", error);
 return NextResponse.json({ error: "An error occurred while processing your request" }, { status:500 });
 }
}