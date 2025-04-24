import {Agency} from "@/types/agency";
import {fetchAgencies} from "./fetch-agencies";

let cachedText2AgencyMap: Record<string, string> | null = null;

/**
 * Flattens an agency and all its children into a CFR reference map.
 * Uses the previous chapter when a chapter is missing in a reference.
 */
function addAgencyRefsToMap(
    agency: Agency,
    map: Record<string, string>,
    prevChapter: string | null = null // Track previous chapter, nullable
) {
    let currentChapter = prevChapter; // Initialize with previous chapter

    for (const ref of agency.cfr_references || []) {
        // Update current chapter if provided
        if (ref.chapter) {
            currentChapter = ref.chapter;
        } 
        else if (!currentChapter) {
            console.warn("Skipping reference with missing chapter and no previous chapter: ", ref);
            continue; // Skip if no chapter and no fallback
        }

        // Create key using currentChapter (either from ref or prevChapter)
        const key = `${ref.title}:${currentChapter}`;
        if (!map[key]) {
            map[key] = agency.name;
        }
    }

    // Recurse into children, passing the current chapter
    for (const child of agency.children || []) {
        addAgencyRefsToMap(child, map, currentChapter);
    }
}

/**
 * Retrieves a mapping of CFR (Code of Federal Regulations) title and chapter references
 * to their corresponding agency names. The result is memoized to avoid redundant computations.
 */
export async function getAgencyMap(): Promise<Record<string, string>> {
    if (cachedText2AgencyMap) return cachedText2AgencyMap;

    const agencies: Agency[] = await fetchAgencies();

    const map: Record<string, string> = {};

    for (const agency of agencies) {
        addAgencyRefsToMap(agency, map);
    }

    cachedText2AgencyMap = map;
    return map;
}






// import type {AgenciesByTitle, Agency} from "@/types/agency";
// import {fetchAgencies} from "./fetch-agencies";



// let cache: AgenciesByTitle | null = null;

// /* ------------------------------------------------------------------ */
// /*  PUBLIC: getAgenciesByTitle                                         */
// /* ------------------------------------------------------------------ */
// export async function getAgenciesByTitle(): Promise<AgenciesByTitle> {
//     if (cache) return cache;

//     const index: AgenciesByTitle = {};
//     const agencies = await fetchAgencies();

//     agencies.forEach(a => walk(a, index));

//     return (cache = index);
// }

// /* ------------------------------------------------------------------ */
// /*  PRIVATE: depth-first traversal                                     */
// /* ------------------------------------------------------------------ */
// function walk(
//     agency: Agency,
//     index: AgenciesByTitle,
//     lastChapter: string | null = null
// ): void {
//     for (const {title, chapter} of agency.cfr_references ?? []) {
//         const chap = chapter ?? lastChapter;
//         if (!chap) continue;

//         const t = String(title);
//         index[t] ??= {};

//         // --- duplicate detection ---------------------------------------
//         if (index[t][chap] && index[t][chap] !== agency.name) {
//             console.error(
//                 `Duplicate ownership: ${t} CFR Chapter ${chap} ` +
//                 `already assigned to "${index[t][chap]}", ` +
//                 `tried to assign "${agency.name}".`
//             );
//             // You could throw here instead of logging if you want a hard fail.
//             continue;
//         }
//         // ---------------------------------------------------------------

//         index[t][chap] = agency.name;
//         lastChapter = chap;
//     }

//     for (const child of agency.children ?? []) {
//         walk(child, index, lastChapter);
//     }
// }
