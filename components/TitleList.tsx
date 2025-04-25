
import {fetchAllEcfrTitles} from '@/lib/fetchTitles';
import {TitleDisplayData} from '@/types/types';
import React from 'react';
import {ChevronRight} from 'lucide-react';

export default async function TitleList() {
    const titles = await fetchAllEcfrTitles();

    console.log("Fetched Titles: ", titles[1]);
    
    return (
        <ul className="grid gap-6 mx-auto max-w-5xl">
            {titles.map((title: TitleDisplayData, idx) => {
                return (
                    <li
                        key={idx}
                        className="group/item flex items-center justify-between p-4 rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm transition"
                    >
                        <div className='gap-2'>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Title {title.number}
                            </h2>
                            <p className="text-md text-gray-500">{title.name}</p>
                        </div>

                        <a
                            href={`/title/${title.number}`}
                            className="group/edit invisible group-hover/item:visible flex items-center gap-1 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition"
                        >
                            <span className="group-hover/edit:text-gray-700">View</span>
                            <ChevronRight className="h-4 w-4 group-hover/edit:translate-x-0.5 group-hover/edit:text-gray-500 transition-transform" />
                        </a>
                    </li>

                );
            })}
        </ul>
    );
}
