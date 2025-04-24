import {config} from "@/app/config";
import {ECFR_BASE_URL} from "@/lib/constants";

/**
 * Fetches the full XML content of a given eCFR title at a specific issue date.
 *
 * @param title - The eCFR title number (e.g. 21 for Food and Drugs).
 * @param issueDate - The issue date in YYYY-MM-DD format.
 * @returns A promise that resolves to the raw XML string.
 */
export async function getTitleXML(
    title: number,
    issueDate: string
): Promise<string> {




    const url = `${config.baseUrl}/api/get-title-xml?title=${title}&date=${issueDate}`;
    
    const res = await fetch(url);

    if (res.status === 403) {
        throw new Error("Blocked by CAPTCHA or request filter");
    }
    if (res.status === 404) {
        throw new Error(`Title ${title} not found for date ${issueDate}`);
    }
    if (res.status === 429) {
        throw new Error("Rate limit exceeded");
    }

    if (!res.ok) {
        throw new Error(`Failed to fetch XML for Title ${title} on ${issueDate}`);
    }

    return res.text();
}
