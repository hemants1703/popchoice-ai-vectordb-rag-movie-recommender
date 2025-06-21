import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { user_id, message } = await request.json() as { user_id: string, message: string };

    if (!user_id || !message) {
        return NextResponse.json({ error: "Missing user_id or message" }, { status: 400 });
    }

    try {
        const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_API_KEY!);

        const { data, error } = await supabase.from("chatty_gemini").select("*").eq("user_id", user_id);

        if (error) {
            console.log("Error fetching data from Supabase", error);
            throw new Error("Failed to fetch data from Supabase");
        }

        

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch data from Supabase" }, { status: 500 });
    }
}