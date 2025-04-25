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

    return data.agencies as Agency[];
}

