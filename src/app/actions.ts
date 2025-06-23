'use server';

import { generateExplanation } from '@/ai/flows/cache-and-improve-explanations';
import { isFlowRateLimitError } from 'genkit';

export async function getExplanationAction(query: string): Promise<{ explanation?: string; error?: string }> {
  if (!query) {
    return { error: 'Please enter a question.' };
  }
  
  try {
    const result = await generateExplanation({ query });
    if (result.explanation) {
      return { explanation: result.explanation };
    } else {
      throw new Error('Empty explanation returned from the AI model.');
    }
  } catch (e) {
    console.error(e);
    if (isFlowRateLimitError(e)) {
      return { error: 'You have made too many requests. Please try again tomorrow.' };
    }
    return { error: 'Sorry, I had trouble thinking of an explanation. Please try again later.' };
  }
}
