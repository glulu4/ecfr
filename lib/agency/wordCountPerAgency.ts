import {XMLParser} from 'fast-xml-parser';
import {getTitleXML} from '../getTitleXML';
import {getJSONStructure} from '../getJSONStructure';


/* ---------- XML parser instance ---------- */
const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    allowBooleanAttributes: true,
});

/* ---------- helpers ---------- */
const normalizeAgency = (raw = '') =>
    raw.replace(/^chapter\s+[ivxlcdm]+\s*—\s*/i, '')
        .replace(/\s*\[.*?\]\s*$/i, '')
        .trim();

const isReserved = (head?: string) =>
    head?.toUpperCase().includes('[RESERVED]') ?? false;

/* recursively collect <DIV8 TYPE="SECTION"> ----------------------- */
const collectSections = (node: any, out: any[] = []) => {
    if (!node || typeof node !== 'object') return out;

    if (node['@_TYPE'] === 'PART' && isReserved(node.HEAD)) return out;
    if (node['@_TYPE'] === 'SECTION') out.push(node);

    for (const child of Object.values(node)) {
        if (Array.isArray(child)) child.forEach(c => collectSections(c, out));
        else if (typeof child === 'object') collectSections(child, out);
    }
    return out;
};

/* grab all text in a <SECTION> ------------------------------------ */
const wordCountOfSection = (section: any): number => {
    const pull = (p: any): string =>
        typeof p === 'string'
            ? p
            : Array.isArray(p)
                ? p.map(pull).join(' ')
                : Object.values(p ?? {}).map(pull).join(' ');

    const txt = section.P ? pull(section.P) : '';
    return txt.trim().split(/\s+/).filter(Boolean).length;
};

/* ----------------------------------------------------------------- *
 *    MAIN: word-count by agency
 * ----------------------------------------------------------------- */
export async function getWordCountByAgency(
    title: number,
    issueDate: string,
): Promise<Record<string, number>> {

    /* 1 – fetch both artefacts in parallel -------------------------- */
    const [xml, struct] = await Promise.all([
        getTitleXML(title, issueDate),
        getJSONStructure(title, issueDate),
    ]);

    /* 2 – PART → agency map from the structure JSON ----------------- */
    const part2agency: Record<string, string> = {};
    (function walk(n: any, agency = ''): void {
        if (!n) return;
        const t = n.type ?? n.TYPE;

        if (t === 'chapter')
            agency = normalizeAgency(n.label ?? n.HEAD ?? '');

        if (t === 'part' && !n.reserved && agency) {
            part2agency[String(n.identifier)] = agency;
        }

        (n.children ?? []).forEach((c: any) => walk(c, agency));
    })(struct);

    /* 3 – parse XML ------------------------------------------------- */
    const ecfr = parser.parse(xml)?.ECFR;
    if (!ecfr) throw new Error('ECFR root missing in XML');

    /* 4 – collect every <DIV5 TYPE="PART"> -------------------------- */
    const parts: any[] = [];
    (function walk(node: any): void {
        if (!node || typeof node !== 'object') return;
        if (node['@_TYPE'] === 'PART') parts.push(node);
        for (const c of Object.values(node))
            Array.isArray(c) ? c.forEach(walk) : walk(c);
    })(ecfr);

    /* 5 – tally words ---------------------------------------------- */
    const out: Record<string, number> = {};

    for (const part of parts) {
        const num = String(part['@_N'] ?? part.N ?? '').replace(/\D/g, '');
        const agency = part2agency[num];
        if (!agency) continue;                              // unmapped

        const words = collectSections(part)
            .reduce((s, sec) => s + wordCountOfSection(sec), 0);

        out[agency] = (out[agency] ?? 0) + words;
    }

    return out;
}
