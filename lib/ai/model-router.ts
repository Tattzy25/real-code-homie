// Import from the main AI package instead of individual SDK packages to avoid zod dependency issues
import { OpenAIAdapter } from "ai";
import { GroqAdapter } from "groq-sdk";

type ModelConfig = {
  model: any;
  systemPrompt: string;
  provider: "groq" | "openai";
};

export function getModel(
  subscriptionTier: "free" | "pro" | "engineer",
  modelName = "default",
  persona = "default",
): ModelConfig {
  // Base system prompt
  let systemPrompt = `You are Code Homie, an AI coding assistant. Help the user with their coding questions.
  Be concise but thorough. Provide code examples when relevant.
  When writing code, make sure it's well-commented and follows best practices.`

  // Adjust system prompt based on persona
  if (persona === "debugger") {
    systemPrompt = `You are Code Homie in debugger mode. Focus on finding and fixing bugs in the user's code.
    Carefully analyze the code, identify issues, and suggest fixes with explanations.
    Be thorough but concise in your analysis.`
  } else if (persona === "architect") {
    systemPrompt = `You are Code Homie in architect mode. Focus on code structure, patterns, and best practices.
    Help the user design robust, scalable, and maintainable code architectures.
    Suggest appropriate design patterns and architectural approaches.`
  } else if (persona === "teacher") {
    systemPrompt = `You are Code Homie in teacher mode. Focus on explaining concepts clearly and thoroughly.
    Break down complex topics into understandable parts. Provide examples to illustrate concepts. 
    Check for understanding and anticipate common points of confusion.`
  } else if (persona === "speed-coder") {
    systemPrompt = `You are Code Homie in speed coder mode. Focus on providing efficient, working solutions quickly.
    Prioritize brevity and functionality over extensive explanations.
    Provide code that works out of the box with minimal setup.`
  }

  let model;
  let provider: "openai" | "groq" = "openai"; // Assign a default value to provider

  if (subscriptionTier === "free") {
    model = new OpenAIAdapter({ model: "gpt-4-turbo" });
  } else if (subscriptionTier === "pro") {
    if (modelName === "llama-4-scout") {
      model = new GroqAdapter({ model: "meta-llama/llama-4-scout-17b-16e-instruct" });
      provider = "groq";
    } else if (modelName === "default" || modelName === "gpt-4-turbo" || modelName === "gpt-4o") {
      model = new OpenAIAdapter({ model: modelName === "default" ? "gpt-4-turbo" : modelName });
    }
  } else if (subscriptionTier === "engineer") {
    if (modelName === "llama-4-scout") {
      model = new GroqAdapter({ model: "meta-llama/llama-4-scout-17b-16e-instruct" });
      provider = "groq";
    } else if (modelName === "llama-4-maverick") {
      model = new GroqAdapter({ model: "meta-llama/llama-4-maverick-17b-128e-instruct" });
      provider = "groq";
    } else if (modelName === "deepseek-r1-distill-llama-70b") {
      model = new GroqAdapter({ model: "deepseek-r1-distill-llama-70b" });
      provider = "groq";
    } else if (modelName === "gpt-4-turbo" || modelName === "gpt-4o") {
      model = new OpenAIAdapter({ model: modelName });
    }
  }

  // Handle default model selection based on subscription tier
  if (modelName === "default") {
    if (subscriptionTier === "free") {
      model = new OpenAIAdapter({ model: "gpt-4-turbo" });
    } else if (subscriptionTier === "pro") {
      model = new GroqAdapter({ model: "meta-llama/llama-4-scout-17b-16e-instruct" });
      provider = "groq";
    } else if (subscriptionTier === "engineer") {
      model = new OpenAIAdapter({ model: "gpt-4o" });
      provider = "openai";
    }
  } else {
    // Use the appropriate adapter based on provider for non-default models
    if (provider === 'groq') {
      model = new GroqAdapter({ model: modelName });
    } else if (provider === 'openai') {
      model = new OpenAIAdapter({ model: modelName });
    }
  }

  return { model, systemPrompt, provider };
}