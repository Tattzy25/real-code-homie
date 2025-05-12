"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSupabaseAuth } from "@/lib/hooks/use-supabase-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/chat-message";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatHeader } from "@/components/chat-header";
import { CodeBlock } from "@/components/code-block";
import { Loader2, Send, MessageSquare, Code, Layout } from "lucide-react";
import { extractCodeBlocks } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { logError } from "@/lib/error-logger";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { publishCodeProgress } from "@/lib/websocket/ably-service";
import { PersonaSelector } from "@/components/persona-selector";
import { ModelSelector } from "@/components/model-selector";
import { CodePreview } from "@/components/code-preview";

type Message = {
 id: string;
 role: "user" | "assistant" | "system";
 content: string;
};

export default function ChatConversationPage() {
 const [messages, setMessages] = useState<Message[]>([]);
 const [input, setInput] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 const [isLoadingConversation, setIsLoadingConversation] = useState(true);
 const messagesEndRef = useRef<HTMLDivElement>(null);
 const { session, isLoading: loading } = useSupabaseAuth();
 const router = useRouter();
 const params = useParams();
 const conversationId = params.id as string;
 const { toast } = useToast();
 const [currentModel, setCurrentModel] = useState("default");
 const [currentPersona, setCurrentPersona] = useState("default");
 const [activeTab, setActiveTab] = useState("chat");
 const [extractedCode, setExtractedCode] = useState("");
 const [userTier, setUserTier] = useState<"free" | "pro" | "engineer">("free");
 let currentCodeBlock = "";

 // Redirect if not logged in
 useEffect(() => {
 if (!loading && !session) {
 router.push("/login");
 }
 }, [session, loading, router]);

 // Load conversation messages
 useEffect(() => {
 const fetchMessages = async () => {
 if (!session?.user || !conversationId) return;

 try {
 setIsLoadingConversation(true);
 const supabase = (window as any).supabase;

 // Check if conversation belongs to user
 const { data: conversation, error: convoError } = await supabase
 .from("conversations")
 .select("*")
 .eq("id", conversationId)
 .eq("user_id", session.user.id)
 .single();

 if (convoError || !conversation) {
 router.push("/chat");
 return;
 }

 // Fetch messages
 const { data, error } = await supabase
 .from("messages")
 .select("*")
 .eq("conversation_id", conversationId)
 .order("created_at", { ascending: true });

 if (error) throw error;

 setMessages(
 data.map((msg: any) => ({
 id: msg.id,
 role: msg.role,
 content: msg.content,
 })),
 );
 } catch (error) {
 console.error("Error fetching messages:", error);
 toast({
 title: "Error",
 description: "Failed to load conversation. Please try again.",
 variant: "destructive",
 });
 } finally {
 setIsLoadingConversation(false);
 }
 };

 fetchMessages();
 }, [session, conversationId, router, toast]);

 // Auto-scroll to bottom of messages
 useEffect(() => {
 if (messagesEndRef.current) {
 messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
 }
 }, [messages]);

 // Get user subscription tier
 useEffect(() => {
 const getUserTier = async () => {
 if (!session?.user) return;

 try {
 const supabase = (window as any).supabase;
 const { data, error } = await supabase
 .from("users")
 .select("subscription_tier, preferred_model")
 .eq("id", session.user.id)
 .single();

 if (error) throw error;

 setUserTier(data.subscription_tier);

 // Set preferred model if available
 if (data.preferred_model) {
 setCurrentModel(data.preferred_model);
 }
 } catch (error) {
 console.error("Error fetching user tier:", error);
 }
 };

 getUserTier();
 }, [session]);

 // Handle code blocks in messages
 const renderMessageContent = (content: string) => {
 const { text, codeBlocks } = extractCodeBlocks(content);

 if (codeBlocks.length === 0) {
 return <p className="whitespace-pre-wrap">{content}</p>;
 }

 const parts = [];
 let lastIndex = 0;

 codeBlocks.forEach((block, index) => {
 // Add text before code block
 if (block.startIndex > lastIndex) {
 parts.push(
 <p key={`text-${index}`} className="whitespace-pre-wrap mb-4">
 {content.substring(lastIndex, block.startIndex)}
 </p>,
 );
 }

 // Add code block
 parts.push(<CodeBlock key={`code-${index}`} code={block.code} language={block.language} className="my-4" />);

 lastIndex = block.endIndex;
 });

 // Add any remaining text
 if (lastIndex < content.length) {
 parts.push(
 <p key="text-end" className="whitespace-pre-wrap">
 {content.substring(lastIndex)}
 </p>,
 );
 }

 return <>{parts}</>;
 };

 if (loading || isLoadingConversation) {
 return (
 <div className="flex items-center justify-center min-h-screen bg-zinc-950">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
 </div>
 );
 }

 if (!session) {
 return null; // Will redirect to login
 }

 // Save user preferences when they change
 useEffect(() => {
 const saveUserPreferences = async () => {
 if (!session?.user) return;

 try {
 const supabase = (window as any).supabase;
 await supabase
 .from("users")
 .update({
 preferred_model: currentModel,
 })
 .eq("id", session.user.id);
 } catch (error) {
 console.error("Error saving user preferences:", error);
 }
 };

 saveUserPreferences();
 }, [currentModel, session]);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();

 if (!input.trim() || isLoading || !session?.user) return;

 const userMessage: Message = {
 id: `user-${Date.now()}`,
 role: "user",
 content: input,
 };

 setMessages((prev) => [...prev, userMessage]);
 setInput("");
 setIsLoading(true);

 try {
 // Save user message to database
 const supabase = (window as any).supabase;
 await supabase.from("messages").insert({
 conversation_id: conversationId,
 role: "user",
 content: userMessage.content,
 });

 // Get AI response
 const response = await fetch("/api/chat", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 message: userMessage.content,
 conversationId,
 modelName: currentModel,
 persona: currentPersona,
 }),
 });

 if (!response.ok) {
 const errorData = await response.json();
 throw new Error(errorData.message || "Failed to get response");
 }

 const reader = response.body?.getReader();
 if (!reader) throw new Error("Failed to get response stream");

 const decoder = new TextDecoder();
 let done = false;
 let assistantMessage = "";

 // Create a temporary message ID
 const tempMessageId = `assistant-${Date.now()}`;
 setMessages((prev) => [...prev, { id: tempMessageId, role: "assistant", content: "" }]);

 while (!done) {
 const { value, done: doneReading } = await reader.read();
 done = doneReading;

 if (value) {
 const chunk = decoder.decode(value);
 try {
 // Parse the chunk as JSON
 const lines = chunk
 .split("\n")
 .filter(Boolean)
 .map((line) => line.replace(/^data: /, "").trim());

 for (const line of lines) {
 if (line === "[DONE]") continue;
 try {
 const parsed = JSON.parse(line);
 if (parsed.type === "text" && parsed.text) {
 assistantMessage += parsed.text;

 // Update the message in real-time
 setMessages((prev) =>
 prev.map((msg) => (msg.id === tempMessageId ? { ...msg, content: assistantMessage } : msg)),
 );

 // Extract code blocks in real-time
 const { codeBlocks } = extractCodeBlocks(assistantMessage);
 if (codeBlocks.length > 0) {
 currentCodeBlock = codeBlocks[codeBlocks.length - 1].code;
 setExtractedCode(currentCodeBlock);

 // Publish code progress for real-time updates
 publishCodeProgress(conversationId, {
 code: currentCodeBlock,
 isComplete: false,
 });
 }
 }
 } catch (e) {
 // Skip invalid JSON
 logError(e as Error, "low", { context: "JSON parsing", chunk });
 }
 }
 } catch (e) {
 logError(e as Error, "medium", {
 context: "Stream processing",
 conversationId,
 chunk: chunk.substring(0, 100), // Log only first100 chars to avoid huge logs
 });
 }
 }
 }

 // When streaming is complete, publish final code
 if (currentCodeBlock) {
 publishCodeProgress(conversationId, {
 code: currentCodeBlock,
 isComplete: true,
 });
 }
 } catch (error: any) {
 logError(error, "high", {
 component: "ChatConversationPage",
 conversationId,
 input: input.substring(0, 100), // First100 chars for context
 });

 console.error("Error getting AI response:", error);
 toast({
 title: "Error",
 description: error.message || "Failed to get a response. Please try again.",
 variant: "destructive",
 });

 // Remove the loading message
 setMessages((prev) => prev.filter((msg) => !msg.id.includes("assistant-")));
 } finally {
 setIsLoading(false);
 }
 };

 const handleModelChange = (model: string) => {
 setCurrentModel(model);
 };

 const handlePersonaChange = (persona: string) => {
 setCurrentPersona(persona);
 };

 // Check if model is available for user's subscription tier
 const isModelAvailable = (model: string) => {
 if (userTier === "engineer") return true; // Engineer tier has access to all models
 if (userTier === "pro" && model !== "gpt-4o") return true; // Pro tier has access to all except GPT-4o
 return model === "default"; // Free tier only has access to default model
 };

 return (
 <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
 {/* Sidebar */}
 <ChatSidebar 
 isOpen={isSidebarOpen} 
 onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
 currentConversationId={conversationId} 
 onConversationSelect={(id) => router.push(`/chat/${id}`)} 
/>

 {/* Main Content */}
 <div className="flex-1 flex flex-col h-full overflow-hidden">
 {/* Header */}
 <ChatHeader
 isSidebarOpen={isSidebarOpen}
 toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
 currentPersona={currentPersona}
 currentModel={currentModel}
 onPersonaChange={handlePersonaChange}
 onModelChange={handleModelChange}
 isLoading={isLoading}
 />

 {/* Content Area with Tabs */}
 <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
 <TabsList className="mx-4 mt-2 bg-zinc-900 border-b border-zinc-800">
 <TabsTrigger value="chat" className="flex items-center gap-1">
 <MessageSquare className="h-4 w-4" />
 <span>Chat</span>
 </TabsTrigger>
 <TabsTrigger value="code" className="flex items-center gap-1">
 <Code className="h-4 w-4" />
 <span>Code</span>
 </TabsTrigger>
 <TabsTrigger value="preview" className="flex items-center gap-1">
 <Layout className="h-4 w-4" />
 <span>Preview</span>
 </TabsTrigger>
 </TabsList>

 {/* Chat Tab */}
 <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden">
 {/* Messages */}
 <div className="flex-1 overflow-y-auto p-4 space-y-4">
 {messages.map((message) => (
 <ChatMessage key={message.id} message={message} />
 ))}
 <div ref={messagesEndRef} />
 </div>

 {/* Input */}
 <div className="p-4 border-t border-zinc-800">
 <form onSubmit={handleSubmit} className="flex gap-2">
 <Textarea
 value={input}
 onChange={(e) => setInput(e.target.value)}
 placeholder="Ask me anything about coding..."
 className="min-h-[60px] bg-zinc-900 border-zinc-800 resize-none"
 onKeyDown={(e) => {
 if (e.key === "Enter" && !e.shiftKey) {
 e.preventDefault();
 handleSubmit(e);
 }
 }}
 />
 <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
 {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
 </Button>
 </form>
 </div>
 </TabsContent>

 {/* Code Tab */}
 <TabsContent value="code" className="flex-1 overflow-hidden p-4">
 {extractedCode ? (
 <CodeBlock code={extractedCode} language="html" className="h-full" />
 ) : (
 <div className="flex items-center justify-center h-full text-zinc-500">
 <p>No code generated yet. Ask me to write some code!</p>
 </div>
 )}
 </TabsContent>

 {/* Preview Tab */}
 <TabsContent value="preview" className="flex-1 overflow-hidden p-4">
 {extractedCode ? (
 <CodePreview conversationId={conversationId} code={extractedCode} />
 ) : (
 <div className="flex items-center justify-center h-full text-zinc-500">
 <p>No preview available. Generate some HTML/CSS code first!</p>
 </div>
 )}
 </TabsContent>
 </Tabs>
 </div>
 </div>
 );
}