/**
 * Check if a user can access a specific model based on their subscription tier
 * @param subscriptionTier The user's subscription tier
 * @param modelName The model name to check access for
 * @returns Boolean indicating if the user can access the model
 */
export function canAccessModel(subscriptionTier: "free" | "pro" | "engineer", modelName: string): boolean {
 if (subscriptionTier === "engineer") {
 // Engineer tier can access all models
 return true;
 } else if (subscriptionTier === "pro") {
 // Pro tier can access all except Llama models
 return !modelName.includes("llama") && modelName !== "default";
 } else {
 // Free tier can only access GPT-4 Turbo
 return modelName === "gpt-4-turbo";
 }
}

/**
 * Get available models for a subscription tier
 * @param subscriptionTier The user's subscription tier
 * @returns Array of available model objects with id and name
 */
export function getAvailableModels(subscriptionTier: "free" | "pro" | "engineer") {
 const allModels = [
 { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
 { id: "llama-4-scout", name: "Llama4 Scout" },
 { id: "llama-4-maverick", name: "Llama4 Maverick" },
 { id: "deepseek-r1-distill-llama-70b", name: "DeepSeek" },
 { id: "gpt-4o", name: "GPT-4o" },
 ];

 return allModels.filter(model => canAccessModel(subscriptionTier, model.id));
}
