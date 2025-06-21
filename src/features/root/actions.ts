"use server";

import { createClient } from "@supabase/supabase-js";
import { PopChoiceFormDefinition } from "./definitions";
import { PopChoiceFormProps } from "./PopChoiceForm";
import embedText from "./textEmbedder";

export async function performRagAndRecommendMovie(initialState: PopChoiceFormProps, formData: FormData): Promise<PopChoiceFormProps> {
    const validationResult = PopChoiceFormDefinition.safeParse({
        question1: formData.get("questionanswer1") as string,
        question2: formData.get("questionanswer2") as string,
        question3: formData.get("questionanswer3") as string
    })
    
    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        };
    }

    const { question1, question2, question3 } = validationResult.data;
    const context = question1 + "\n" + question2 + "\n" + question3;
    
    try {
        const embeddedQuery = await embedText(context);
        
        if (!embeddedQuery || embeddedQuery.length === 0) {
            throw new Error("No embeddings returned. Please check the input text and try again.");
        }

        if (!process.env.NEXT_SUPABASE_URL || !process.env.NEXT_SUPABASE_API_KEY) {
            throw new Error("Supabase URL or Anon Key is not set. Please check your environment variables.");
        }

        const supabase = createClient(process.env.NEXT_SUPABASE_URL!, process.env.NEXT_SUPABASE_API_KEY!);

        
        let { data, error } = await supabase
            .rpc('match_scrimba_challenges', {
                match_count: 3, 
                match_threshold: 0.5, 
                query_embedding: embeddedQuery
            })

        
        if (error) {
            console.error("Error fetching movie recommendations:", error);
            return {
                errors: {
                    message: error.message
                }
            };
        }

        if (!data || data.length === 0) {
            return {
                errors: {
                    question1: "No movie recommendations found. Please try different questions.",
                    question2: "No movie recommendations found. Please try different questions.",
                    question3: "No movie recommendations found. Please try different questions."
                }
            };
        }

        console.log("Recommended movie data:", data);
        

        const recommendedMovie = data[0];
        return {
            recommendedMovie,
            errors: {}
        };
    } catch (error) {
        console.error("Error performing RAG and recommending movie:", error);
        return {
            errors: {
                question1: "An error occurred while processing your request. Please try again later.",
                question2: "An error occurred while processing your request. Please try again later.",
                question3: "An error occurred while processing your request. Please try again later."
            }
        };
    }
}