"use client";

import { useActionState, useEffect, useState } from "react";
import { performRagAndRecommendMovie } from "./actions";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner";

export type PopChoiceFormProps = | {
    errors?: {
        question1?: string | string[];
        question2?: string | string[];
        question3?: string | string[];
        message?: string | string[];
    },
    recommendedMovie?: {
        id: number;
        content: string;
        similarity: number;
    };
} | undefined;

export default function PopChoiceForm() {
    const [formState, formAction, isFormSubmissionInProgress] = useActionState<PopChoiceFormProps, FormData>(performRagAndRecommendMovie, undefined);
    const [questionAnswers, setQuestionAnswers] = useState({
        answer1: "",
        answer2: "",
        answer3: ""
    });
    const [movieSuggested, setMovieSuggested] = useState<boolean>(false);

    useEffect(() => {
        if (formState?.recommendedMovie) {
            setMovieSuggested(true)
        }
        
        if (formState?.errors) {
            if (formState.errors.question1) {
                toast.error(formState.errors.question1, {
                    duration: 5000,
                    position: "top-right",
                });
            }
            if (formState.errors.question2) {
                toast.error(formState.errors.question2, {
                    duration: 5000,
                    position: "top-right",
                });
            }
            if (formState.errors.question3) {
                toast.error(formState.errors.question3, {
                    duration: 5000,
                    position: "top-right",
                });
            }
            if (formState.errors.message) {
                toast.error(formState.errors.message, {
                    duration: 5000,
                    position: "top-right",
                });
            }
        }
    }, [formState]);

    if (movieSuggested && formState?.recommendedMovie) {
        return (
            <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <h1 className="text-white text-3xl font-bold mb-4">Your Movie Recommendation</h1>
                    <p className="text-gray-200 mb-6">{formState.recommendedMovie.content}</p>
                    <button 
                        onClick={() => setMovieSuggested(false)} 
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 px-6 rounded-lg"
                    >
                        Start Over
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <form action={formAction} className="space-y-6">
                        <Toaster />
                        
                        {/* Header with Popcorn Icon and Title */}
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🍿</div>
                            <h1 className="text-white text-3xl font-bold">PopChoice</h1>
                        </div>

                        {/* First Question */}
                        <div className="space-y-3">
                            <h2 className="text-white text-lg font-medium">
                                What's your favorite movie and why?
                            </h2>
                            <textarea 
                                name="questionanswer1"
                                placeholder="The Shawshank Redemption Because it taught me to never give up hope no matter how hard life gets"
                                rows={2}
                                className="w-full bg-blue-700/50 border-blue-600 text-gray-200 placeholder:text-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                defaultValue={""}
                                onChange={(e) => setQuestionAnswers({ ...questionAnswers, answer1: e.target.value })}
                                required
                            />
                            {formState?.errors?.question1 && (
                                <p className="text-red-400 text-sm">
                                    {formState?.errors?.question1}
                                </p>
                            )}
                        </div>

                        {/* Second Question */}
                        <div className="space-y-3">
                            <h2 className="text-white text-lg font-medium">
                                Are you in the mood for something new or a classic?
                            </h2>
                            <textarea 
                                name="questionanswer2"
                                placeholder="I want to watch movies that were released after 1990"
                                rows={2}
                                className="w-full bg-blue-700/50 border-blue-600 text-gray-200 placeholder:text-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                defaultValue={""}
                                onChange={(e) => setQuestionAnswers({ ...questionAnswers, answer2: e.target.value })}
                                required
                            />
                            {formState?.errors?.question2 && (
                                <p className="text-red-400 text-sm">
                                    {formState?.errors?.question2}
                                </p>
                            )}
                        </div>

                        {/* Third Question */}
                        <div className="space-y-3">
                            <h2 className="text-white text-lg font-medium">
                                Do you wanna have fun or do you want something serious?
                            </h2>
                            <textarea 
                                name="questionanswer3"
                                placeholder="I want to watch something stupid and fun"
                                rows={2}
                                className="w-full bg-blue-700/50 border-blue-600 text-gray-200 placeholder:text-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                defaultValue={""}
                                onChange={(e) => setQuestionAnswers({ ...questionAnswers, answer3: e.target.value })}
                                required
                            />
                            {formState?.errors?.question3 && (
                                <p className="text-red-400 text-sm">
                                    {formState?.errors?.question3}
                                </p>
                            )}
                        </div>

                        {/* Error Message */}
                        {formState?.errors?.message && (
                            <p className="text-red-400 text-sm text-center">
                                {formState?.errors?.message}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isFormSubmissionInProgress}
                            className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 rounded-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isFormSubmissionInProgress ? "Processing..." : "Let's Go"}
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}