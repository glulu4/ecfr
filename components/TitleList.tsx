
import {getWordCountByAgency} from '@/lib/agency/wordCountPerAgency';
import {fetchAllEcfrTitles} from '@/lib/fetchTitles';
import {getJSONStructure} from '@/lib/getJSONStructure';
import {TitleDisplayData} from '@/types/types';
import React from 'react';

export default async function TitleList() {
    const titles = await fetchAllEcfrTitles();

    console.log("Fetched Titles: ", titles[1]);
    

    // // Kick off one word-count fetch per title in parallel
    const countsArray = await Promise.all(
        titles.slice(0,5).map((t) => getWordCountByAgency(t.number, t.latest_amended_on))
    );

    const json = await getJSONStructure(titles[1].number, titles[1].latest_amended_on);
    console.log("JSON Structure: ", json);
    

    return (
        <ul className="grid gap-4">
            {titles.slice(0,5).map((title: TitleDisplayData, idx) => {
                const wc = countsArray[idx];
                return (
                    <li key={idx} className="border p-4 rounded hover:shadow transition">
                        <h2 className="text-lg font-semibold">
                            Title {title.number}: {title.name}
                        </h2>
                        <div className="mt-2 space-y-1">
                            {Object.entries(wc).map(([agency, count]) => (
                                <div key={agency}>
                                    <strong>{agency}</strong>: {count as number} words
                                </div>
                            ))}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
