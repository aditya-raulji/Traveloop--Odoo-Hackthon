import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, tripContext } = body;

    // Structure for Anthropic API call
    // For now, we'll return a structured mock response that follows the requested schema
    // In a production environment, you would use: 
    // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    
    console.log("AI Prompt received:", prompt, "Context:", tripContext);

    // Simulated AI response based on common travel patterns
    const mockResponses = {
      flight: {
        suggestedTitle: "International Flight to Bali",
        suggestedDescription: "Economy class flight from Mumbai International (BOM) to Ngurah Rai International (DPS). Includes 1 layover. Remember to check-in 24 hours before.",
        estimatedBudget: 45000,
        suggestedDuration: 1,
        sectionType: "TRAVEL"
      },
      hotel: {
        suggestedTitle: "Luxury Resort Stay",
        suggestedDescription: "4-night stay in a beachfront villa. Includes daily breakfast, pool access, and spa credits. Located near Seminyak beach.",
        estimatedBudget: 60000,
        suggestedDuration: 4,
        sectionType: "HOTEL"
      },
      default: {
        suggestedTitle: prompt || "Custom Activity",
        suggestedDescription: "Planned activity based on your travel goals. Includes local transportation and entry fees if applicable.",
        estimatedBudget: 5000,
        suggestedDuration: 1,
        sectionType: "ACTIVITY"
      }
    };

    const type = prompt.toLowerCase().includes("flight") ? "flight" : 
                 prompt.toLowerCase().includes("hotel") || prompt.toLowerCase().includes("stay") ? "hotel" : "default";

    return NextResponse.json(mockResponses[type]);
  } catch (error) {
    console.error("AI Fill API Error:", error);
    return NextResponse.json({ error: "Failed to generate AI suggestion" }, { status: 500 });
  }
}
