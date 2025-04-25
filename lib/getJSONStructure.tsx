import {config} from "@/app/config";

/**
 * Fetches the full XML content of a given eCFR title at a specific issue date.
 *
 * @param title - The eCFR title number (e.g. 21 for Food and Drugs).
 * @param issueDate - The issue date in YYYY-MM-DD format.
 * @returns A promise that resolves to the raw XML string.
 */
export async function getJSONStructure(
    title: number,
    issueDate: string
) {

    const url = `${config.baseUrl}/api/get-json?title=${title}&date=${issueDate}`;
    
    const res = await fetch(url);
    
    if (res.status === 403) {
        throw new Error("Blocked by CAPTCHA or request filter");
    }
    
    return await res.json();
}