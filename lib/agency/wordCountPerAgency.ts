
import {XMLParser} from 'fast-xml-parser';
import {getTitleXML} from '../getTitleXML';
import {getAgenciesByTitle} from './text2AgencyMap';

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    allowBooleanAttributes: true,
});

const cleanHead = (txt = '') =>
    txt.replace(/^chapter\s+[ivxlcdm]+\s*—\s*/i, '').trim();

const isReserved = (head?: string) =>
    head?.toUpperCase().includes('[RESERVED]') ?? false;

function harvestSections(node: any, bag: any[] = []): any[] {
    if (!node || typeof node !== 'object') return bag;

    // fast-xml-parser will keep attributes under "@_…" keys
    if (node['@_TYPE'] === 'PART' && isReserved(node.HEAD)) return bag;
    if (node['@_TYPE'] === 'SECTION') bag.push(node);

    for (const val of Object.values(node)) {
        if (Array.isArray(val)) val.forEach(c => harvestSections(c, bag));
        else if (typeof val === 'object') harvestSections(val, bag);
    }
    return bag;
}

function wordsInSection(sec: any): number {
    const pull = (p: any): string =>
        typeof p === 'string'
            ? p
            : Array.isArray(p)
                ? p.map(pull).join(' ')
                : Object.values(p ?? {}).map(pull).join(' ');

    const txt = sec.P ? pull(sec.P) : '';
    return txt.trim().split(/\s+/).filter(Boolean).length;
}

function gatherChapters(node: any, out: any[] = []): any[] {
    if (!node || typeof node !== 'object') return out;

    if (node.DIV3) {
        const c = node.DIV3;
        Array.isArray(c) ? out.push(...c) : out.push(c);
    }
    for (const v of Object.values(node)) {
        if (Array.isArray(v)) v.forEach(n => gatherChapters(n, out));
        else if (typeof v === 'object') gatherChapters(v, out);
    }
    return out;
}

export async function getWordCountByAgency(
    title: number,
    issueDate: string
): Promise<Record<string, number>> {

    const titleMap = (await getAgenciesByTitle())[String(title)] ?? {};
    const xml = await getTitleXML(title, issueDate);
    const ecfr = parser.parse(xml)?.ECFR;
    if (!ecfr) throw new Error('ECFR root missing');

    const chapters = gatherChapters(ecfr);

    const tally: Record<string, number> = {};

    for (const ch of chapters) {
        if (!ch) continue;

        const chapNum = String(ch['@_N'] ?? '').trim();
        const mapped = titleMap[chapNum];
        const headTxt = typeof ch.HEAD === 'string'
            ? ch.HEAD
            : ch.HEAD?.['#text'] ?? '';
        const agency = mapped ?? cleanHead(headTxt);
        if (!agency) continue;

        const words = harvestSections(ch).reduce(
            (s, sec) => s + wordsInSection(sec), 0);

        tally[agency] = (tally[agency] ?? 0) + words;
    }

    return tally;
}
