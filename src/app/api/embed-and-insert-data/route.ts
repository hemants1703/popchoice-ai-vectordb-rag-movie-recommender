import { splitTextIntoChunks } from "@/features/root/textEmbedder";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    const text = await request.text();

    if (!text || text.trim() === "") {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    try {
        const textChunks = await splitTextIntoChunks(text, 1000);
        
        if (textChunks.length === 0) {
            return NextResponse.json({ error: "No text chunks created. Please provide a longer text." }, { status: 400 });
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

        // Process chunks sequentially to avoid overwhelming the API and handle errors properly
        for (const chunk of textChunks) {
            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
            });

            console.log("Embedding response for chunk:", chunk);
            console.log("Response data:", response.data[0].embedding);

            if (!response || !response.data || response.data.length === 0) {
                console.log("No embeddings returned for chunk:", chunk);
                throw new Error("Failed to generate embeddings for the provided text.");
            }

            const { data, error } = await supabase
                .from("popchoice_vector_db")
                .insert([{
                    content: chunk,
                    embedding: response.data[0].embedding
                }])
                .select();

            if (error) {
                console.log("Error inserting data into Supabase", error);
                throw new Error(`Failed to insert data into Supabase: ${error.message}`);
            }
            console.log("Inserted chunk into Supabase:", data);
        }

        return NextResponse.json({ message: "Embeddings and Database Insertion Complete!" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to embed data" }, { status: 500 });
    }
}