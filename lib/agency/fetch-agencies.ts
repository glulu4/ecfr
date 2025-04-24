import {Agency} from "@/types/agency";
import {ECFR_BASE_URL} from "../constants";


export async function fetchAgencies() {
    const res = await fetch(`${ECFR_BASE_URL}/api/admin/v1/agencies.json`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch agencies");
    }
    const data = await res.json();
    if (!data.agencies) {
        throw new Error("No agencies found");
    }

    // // Sort agencies by name
    // data.agencies.sort((a: { name: string }, b: { name: string }) => {
    //     return a.name.localeCompare(b.name);
    // });

    return data.agencies as Agency[];
}

