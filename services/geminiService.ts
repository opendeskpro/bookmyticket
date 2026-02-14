
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize with named parameter and use process.env.API_KEY directly
export const generateEventDescription = async (title: string, category: string) => {
  if (!process.env.API_KEY) return "AI services are currently unavailable.";
  
  // Create a new instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, compelling, and professional event description for an event titled "${title}" in the category "${category}". Keep it under 100 words.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      },
    });
    // Access the .text property directly, do not call as a method
    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Something went wrong while generating the description.";
  }
};

export const suggestPricing = async (category: string, location: string) => {
  if (!process.env.API_KEY) return null;

  // Create a new instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest appropriate ticket pricing tiers (Early Bird, Regular, VIP) in INR for a ${category} event in ${location}. Return ONLY a JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tiers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    // Access the .text property directly, do not call as a method
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Pricing Suggestion Error:", error);
    return null;
  }
};
