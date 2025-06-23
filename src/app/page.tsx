"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BrainCircuit, Loader2, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getExplanationAction } from "./actions";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  query: z
    .string()
    .min(10, {
      message: "Please ask a more detailed question (at least 10 characters).",
    })
    .max(300, {
      message: "Your question is too long (maximum 300 characters).",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Home() {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: FormSchema) {
    setIsLoading(true);
    setExplanation(null);
    setFeedback(null);

    const result = await getExplanationAction(values.query);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: result.error,
      });
    } else if (result.explanation) {
      setExplanation(result.explanation);
    }

    setIsLoading(false);
  }

  return (
    <main className="relative flex min-h-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob [animation-delay:2s]"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob [animation-delay:4s]"></div>

      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <header className="text-center space-y-2">
          <BrainCircuit className="mx-auto h-16 w-16 text-primary" />
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Explain It Like I'm 5
          </h1>
          <p className="text-lg text-muted-foreground">
            Your friendly AI-powered explainer for curious minds.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>What are you curious about?</CardTitle>
            <CardDescription>
              Enter a question or topic below and we'll explain it simply.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="e.g., Why is the sky blue?"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    "Explain It!"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {explanation && (
          <Card className="shadow-lg animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
            <CardHeader>
              <CardTitle>Here's a simple way to think about it...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{explanation}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Was this helpful?</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFeedback("up")}
                  aria-label="Upvote explanation"
                >
                  <ThumbsUp
                    className={cn(
                      "h-5 w-5",
                      feedback === "up" && "text-accent-foreground fill-accent"
                    )}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFeedback("down")}
                  aria-label="Downvote explanation"
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <ThumbsDown
                    className={cn(
                      "h-5 w-5",
                      feedback === "down" && "text-destructive fill-destructive/20"
                    )}
                  />
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  );
}
