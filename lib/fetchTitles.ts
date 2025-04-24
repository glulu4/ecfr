import {TitleDisplayData} from "@/types/types";
import {ECFR_BASE_URL} from "./constants";

export async function fetchAllEcfrTitles(): Promise<TitleDisplayData[]> {
    const res = await fetch(`${ECFR_BASE_URL}/api/versioner/v1/titles.json`);
    

    if (!res.ok) {
        throw new Error("Failed to fetch titles");
    }
    const data = await res.json();
    if (!data.titles) {
        throw new Error("No titles found");
    }
    // Sort titles by number
    data.titles.sort((a: TitleDisplayData, b: TitleDisplayData) => {
        return a.number - b.number;
    });
    
    

    return data.titles;
}
