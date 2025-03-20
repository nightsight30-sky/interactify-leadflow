
interface GeminiResponse {
  score: number;
  analysis: string;
}

// Simulate a Gemini AI model for lead scoring
// In a real implementation, this would make API calls to Google's Gemini API
export const geminiService = {
  // Analyze lead message and request type to generate a score and analysis
  analyzeLeadContent: async (message: string, requestType: string): Promise<GeminiResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let baseScore = 50; // Start with a neutral score
    let analysis = "";
    
    // Analyze request type (higher priority leads get higher scores)
    if (requestType.toLowerCase().includes('demo')) {
      baseScore += 25;
      analysis += "Demo requests indicate high purchase intent. ";
    } else if (requestType.toLowerCase().includes('pricing')) {
      baseScore += 15;
      analysis += "Pricing inquiries suggest active consideration. ";
    } else if (requestType.toLowerCase().includes('product')) {
      baseScore += 20;
      analysis += "Product inquiries show strong interest. ";
    } else if (requestType.toLowerCase().includes('support')) {
      baseScore += 5;
      analysis += "Support requests may indicate existing customer. ";
    }
    
    // Analyze message content for indicators of interest/intent
    const messageLower = message.toLowerCase();
    
    // Length analysis (more detailed messages suggest higher engagement)
    if (message.length > 200) {
      baseScore += 10;
      analysis += "Detailed message shows high engagement. ";
    }
    
    // Check for urgency indicators
    if (messageLower.includes('urgent') || 
        messageLower.includes('asap') || 
        messageLower.includes('soon') ||
        messageLower.includes('quickly')) {
      baseScore += 15;
      analysis += "Urgency indicators suggest immediate need. ";
    }
    
    // Check for budget/size indicators
    if (messageLower.includes('budget') || 
        messageLower.includes('enterprise') || 
        messageLower.includes('team') ||
        messageLower.includes('company')) {
      baseScore += 10;
      analysis += "Enterprise/budget mentions indicate serious buyer. ";
    }
    
    // Check for competition mentions
    if (messageLower.includes('competitor') || 
        messageLower.includes('alternative') || 
        messageLower.includes('compare') ||
        messageLower.includes('versus')) {
      baseScore += 15;
      analysis += "Comparison shopping indicates active buying process. ";
    }
    
    // Limit the final score to 0-99 range
    const finalScore = Math.min(Math.max(Math.round(baseScore), 1), 99);
    
    return {
      score: finalScore,
      analysis: analysis.trim()
    };
  }
};
