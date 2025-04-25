import type {AgenciesByTitle, Agency} from "@/types/agency";
import {fetchAgencies} from "./fetch-agencies";



let cache: AgenciesByTitle | null = null;

export async function getAgenciesByTitle(): Promise<AgenciesByTitle> {
    if (cache) return cache;

    const index: AgenciesByTitle = {};
    const agencies = await fetchAgencies();

    agencies.forEach(a => walk(a, index));

    return (cache = index);
}


function walk(
    agency: Agency,
    index: AgenciesByTitle,
    lastChapter: string | null = null
): void {
    for (const {title, chapter} of agency.cfr_references ?? []) {
        const chap = chapter ?? lastChapter;
        if (!chap) continue;

        const t = String(title);
        index[t] ??= {};

        const existing = index[t][chap];

        if (existing) {
            if (!existing.split(' / ').includes(agency.name)) {
                index[t][chap] = `${existing} / ${agency.name}`;
            }
        } else {
            index[t][chap] = agency.name;
        }

        lastChapter = chap;         
    }

    for (const child of agency.children ?? []) {
        walk(child, index, lastChapter);
    }
}