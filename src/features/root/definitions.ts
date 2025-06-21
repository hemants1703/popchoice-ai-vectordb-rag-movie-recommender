import { z } from "zod";

export const PopChoiceFormDefinition = z.object({
    question1: z.string().min(1, "Question 1 is required."),
    question2: z.string().min(1, "Question 2 is required."),
    question3: z.string().min(1, "Question 3 is required.")
});

