import {NextRequest} from 'next/server';
import {getWordCountByAgency} from '@/lib/agency/wordCountPerAgency';

export async function GET(req: NextRequest) {
    const title = req.nextUrl.searchParams.get('title');
    const date = req.nextUrl.searchParams.get('date');

    if (!title || !date) {
        return new Response(JSON.stringify({error: 'Missing title or date'}), {
            status: 400,
        });
    }

    try {
        const data = await getWordCountByAgency(Number(title), date);
        return new Response(JSON.stringify(data), {
            headers: {'Content-Type': 'application/json'},
        });
    } catch (err) {
        return new Response(JSON.stringify({error: 'Failed to fetch word count'}), {
            status: 500,
        });
    }
}
