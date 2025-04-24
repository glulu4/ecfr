import {NextRequest} from 'next/server';

export async function GET(req: NextRequest) {

    console.log("In route getting json strcyure");
    
    const title = req.nextUrl.searchParams.get("title");
    const date = req.nextUrl.searchParams.get("date");

    if (!title || !date) {
        return new Response(JSON.stringify({error: "Missing title or date"}), {
            status: 400,
        });
    }

    const res = await fetch(
        `https://www.ecfr.gov/api/versioner/v1/structure/${date}/title-${title}.json`,

    );
    if (!res.ok) {
        return new Response(JSON.stringify({error: "Failed to fetch JSON"}), {
            status: res.status,
        });
    }
    const json = await res.json();


    console.log("route res: ", res);
    

    return new Response(JSON.stringify(json), {
        headers: {
            "Content-Type": "application/json",
        },
    });

}
