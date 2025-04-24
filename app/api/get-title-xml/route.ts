import {NextRequest} from 'next/server';

export async function GET(req: NextRequest) {
    const title = req.nextUrl.searchParams.get("title");
    const date = req.nextUrl.searchParams.get("date");

    if (!title || !date) {
        return new Response(JSON.stringify({error: "Missing title or date"}), {
            status: 400,
        });
    }

    const res = await fetch(
        `https://www.ecfr.gov/api/versioner/v1/full/${date}/title-${title}.xml`,
        {
            headers: {
                "User-Agent": "curl/7.81.0",
                Accept: "application/xml",
            },
        }
    );

    const xml = await res.text();



    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
