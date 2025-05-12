"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabase } from "@/lib/supabase/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
 Card,
 CardContent,
 CardDescription,
 CardFooter,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Code, ArrowLeft, Check, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Signup() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const [errorMessage, setErrorMessage] = useState("");
 const router = useRouter();
 const searchParams = useSearchParams();
 const plan = searchParams.get("plan") || "free";
 const { supabase } = useSupabase();
 const { toast } = useToast();

 const validateForm = () => {
 if (!email.trim()) {
 setErrorMessage("Email is required");
 return false;
 }

 if (!email.includes("@") || !email.includes(".")) {
 setErrorMessage("Please enter a valid email address");
 return false;
 }

 if (!password.trim()) {
 setErrorMessage("Password is required");
 return false;
 }

 if (password.length < 6) {
 setErrorMessage("Password must be at least 6 characters");
 return false;
 }

 setErrorMessage("");
 return true;
 };

 const handleSignup = async (e: React.FormEvent) => {
 e.preventDefault();

 if (!validateForm()) {
 return;
 }

 setIsLoading(true);
 setErrorMessage("");

 try {
 const { data, error } = await supabase.auth.signUp({
 email,
 password,
 });

 if (error) {
 // Handle specific error cases
 if (error.message?.includes("User already registered")) {
 setErrorMessage("This email is already registered. Please log in instead.");
 } else if (error.message?.includes("database")) {
 setErrorMessage("Database connection error. Please try again later.");
 } else {
 setErrorMessage(error.message || "Failed to sign up. Please try again.");
 }
 } else {
 // Show success toast
 toast({
 title: "Account created",
 description:
 "Your account has been created successfully. You can now start using Code Homie!",
 });

 // Redirect to chat page
 if (plan !== "free") {
 router.push(`/subscription?plan=${plan}`);
 } else {
 router.push("/chat");
 }
 }
 } catch (error: any) {
 console.error("Signup error:", error);

 setErrorMessage(error.message || "Failed to sign up. Please try again.");
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
 {/* Header */}
 <header className="border-b border-zinc-800 p-4">
 <div className="container mx-auto flex items-center">
 <Link href="/" className="flex items-center gap-2">
 <ArrowLeft className="h-5 w-5" />
 <span>Back to Home</span>
 </Link>
 <div className="mx-auto flex items-center gap-2">
 <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
 <Code className="h-4 w-4" />
 </div>
 <span className="font-bold">Code Homie</span>
 </div>
 <div className="w-24"></div> {/* Spacer for centering */}
 </div>
 </header>

 <div className="flex items-center justify-center flex-1 p-4">
 <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
 <CardHeader className="space-y-1">
 <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
 <CardDescription className="text-zinc-400">
 Enter your details to create your Code Homie account
 </CardDescription>
 </CardHeader>
 <CardContent>
 {errorMessage && (
 <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900 text-red-300">
 <AlertCircle className="h-4 w-4" />
 <AlertDescription>{errorMessage}</AlertDescription>
 </Alert>
 )}

 {plan !== "free" && (
 <div className="mb-6 p-3 bg-blue-600/20 border border-blue-600/30 rounded-md">
 <div className="flex items-center gap-2 mb-2">
 <Check className="h-5 w-5 text-blue-500" />
 <span className="font-medium">{plan === "pro" ? "Pro Builder" : "Pro Engineer"} Plan Selected</span>
 </div>
 <p className="text-sm text-zinc-400">
 You'll be prompted to set up your subscription after creating your account.
 </p>
 </div>
 )}

 <form onSubmit={handleSignup} className="space-y-4">
 <div className="space-y-2">
 <label htmlFor="email" className="text-sm font-medium">
 Email
 </label>
 <Input
 id="email"
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 className="bg-zinc-800 border-zinc-700"
 disabled={isLoading}
 />
 </div>

 <div className="space-y-2">
 <label htmlFor="password" className="text-sm font-medium">
 Password
 </label>
 <Input
 id="password"
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 className="bg-zinc-800 border-zinc-700"
 disabled={isLoading}
 />
 <p className="text-xs text-zinc-500">Password must be at least 6 characters</p>
 </div>

 <Button type="submit" className="w-full" disabled={isLoading}>
 {isLoading ? (
 <>
 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
 Creating account...
 </>
 ) : (
 "Create Account"
 )}
 </Button>
 </form>
 </CardContent>
 <CardFooter className="flex justify-center">
 <div className="text-sm text-zinc-400">
 Already have an account?{" "}
 <Link href="/login" className="text-blue-500 hover:underline">
 Sign in
 </Link>
 </div>
 </CardFooter>
 </Card>
 </div>
 </div>
 );
}