import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { text } = await request.json() as { text: string };

    if (!text) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.embedContent({
            model: 'text-embedding-004',
            contents: text,
        });

        if (!response.embeddings) {
            throw new Error("Failed to embed data");
        }

        // console.log(response.embeddings);

        const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_API_KEY!);

        const { data, error } = await supabase
            .from("chatty_gemini")
            .insert([{
                user_id: "0",
                content: text,
                embedding: response.embeddings[0].values
            }])
            .select();

        if (error) {
            console.log("Error inserting data into Supabase", error);
            throw new Error("Failed to insert data into Supabase");
        }

        return NextResponse.json({ gemini_embeddings_response: response, supabase_response: data }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to embed data" }, { status: 500 });
    }
}