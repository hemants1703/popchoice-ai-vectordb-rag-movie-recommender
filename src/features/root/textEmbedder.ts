import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export default async function embedText(text: string) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.");
    }

    if (!text || text.trim() === "") {
        throw new Error("Text cannot be empty or whitespace.");
    }
    
    if (typeof text !== "string") {
        throw new Error("Input text must be a string.");
    }

    try {
        const textChunks = await splitTextIntoChunks(text, 1000);

        if (textChunks.length === 0) {
            throw new Error("No text chunks created. Please provide a longer text.");
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const embeddings = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: textChunks,
            dimensions: 1536, // Ensure the dimensions match the model's output
        });

        if (!embeddings || !embeddings.data || embeddings.data.length === 0) {
            throw new Error("No embeddings returned. Please check the input text and try again.");
        }

        return embeddings.data[0].embedding;
    } catch (error) {
        console.error("Error embedding text:", error);
        throw new Error("An error occurred while embedding the text. Please try again later.");
    }
}

export async function splitTextIntoChunks(text: string, chunkSize: number): Promise<string[]> {
    if (!text || text.trim() === "") {
        throw new Error("Text cannot be empty or whitespace.");
    }
    if (chunkSize <= 0) {
        throw new Error("Chunk size must be a positive integer.");
    }

    // Create a text splitter with the specified chunk size and overlap
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap: 20, // Overlap of 20 characters
        separators: ["\n\n", "\n", " ", ""], // Use newlines and spaces as separators
    });

    return await textSplitter.splitText(text);
}