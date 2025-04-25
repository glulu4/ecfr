
import {ECFR_BASE_URL} from "@/lib/constants";


export async function getVersions(titleNum: string) {
    const res = await fetch(`${ECFR_BASE_URL}/api/versioner/v1/versions/title-${titleNum}.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return data;
}

export async function getVersionsByDate(titleNum: string):Promise<string[]> {

    const dates = new Set();
    const versionObj = await getVersions(titleNum);
    const versions = versionObj.content_versions;

    for (const version of versions) {
        const date = version.date;

        if (!dates.has(date)) {
            dates.add(date);
        }
        
    }
    return Array.from(dates) as string[];

}