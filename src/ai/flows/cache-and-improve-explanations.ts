'use server';
/**
 * @fileOverview A flow for generating and caching ELI5 explanations, with user feedback to improve future responses.
 *
 * - generateExplanation - A function that generates an ELI5 explanation for a given query and handles user feedback.
 * - ExplanationInput - The input type for the generateExplanation function.
 * - ExplanationOutput - The return type for the generateExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplanationInputSchema = z.object({
  query: z.string().describe('The question or topic to explain like I am 5.'),
});
export type ExplanationInput = z.infer<typeof ExplanationInputSchema>;

const ExplanationOutputSchema = z.object({
  explanation: z.string().describe('The ELI5 explanation.'),
});
export type ExplanationOutput = z.infer<typeof ExplanationOutputSchema>;

export async function generateExplanation(input: ExplanationInput): Promise<ExplanationOutput> {
  return cacheAndImproveExplanationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'eli5ExplanationPrompt',
  input: {schema: ExplanationInputSchema},
  output: {schema: ExplanationOutputSchema},
  prompt: `Explain the following question or topic like I am 5:\n\n{{{query}}}`,
});

const cacheAndImproveExplanationsFlow = ai.defineFlow(
  {
    name: 'cacheAndImproveExplanationsFlow',
    inputSchema: ExplanationInputSchema,
    outputSchema: ExplanationOutputSchema,
    cache: true,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
