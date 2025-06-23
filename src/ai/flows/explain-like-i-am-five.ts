'use server';
/**
 * @fileOverview A flow that simplifies complex questions into explanations tailored for a 5-year-old.
 *
 * - explainLikeIAmFive - A function that processes user input and generates a simplified explanation.
 * - ExplainLikeIAmFiveInput - The input type for the explainLikeIAmFive function.
 * - ExplainLikeIAmFiveOutput - The return type for the explainLikeIAmFive function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainLikeIAmFiveInputSchema = z.object({
  query: z.string().describe('The complex question or topic to be explained.'),
});
export type ExplainLikeIAmFiveInput = z.infer<typeof ExplainLikeIAmFiveInputSchema>;

const ExplainLikeIAmFiveOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A simplified explanation of the query, tailored for a 5-year-old.'),
});
export type ExplainLikeIAmFiveOutput = z.infer<typeof ExplainLikeIAmFiveOutputSchema>;

export async function explainLikeIAmFive(input: ExplainLikeIAmFiveInput): Promise<ExplainLikeIAmFiveOutput> {
  return explainLikeIAmFiveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainLikeIAmFivePrompt',
  input: {schema: ExplainLikeIAmFiveInputSchema},
  output: {schema: ExplainLikeIAmFiveOutputSchema},
  prompt: `You are an expert at explaining things to 5-year-olds.  A user will ask you a question, and you will respond with a simplified explanation tailored for a 5-year-old's understanding.\n\nQuestion: {{{query}}}`,
});

const explainLikeIAmFiveFlow = ai.defineFlow(
  {
    name: 'explainLikeIAmFiveFlow',
    inputSchema: ExplainLikeIAmFiveInputSchema,
    outputSchema: ExplainLikeIAmFiveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
