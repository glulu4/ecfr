// // components/WordCount.tsx
// 'use client';

// import {useEffect, useState} from 'react';
// import {TitleDisplayData} from '@/types/types';
// import {getWordCountPerAgency} from '@/lib/agency/wordCountPerAgency';

// export function WordCount({title}: {title: TitleDisplayData}) {
//     const [wc, setWc] = useState<Record<string, number> | null>(null);

//     useEffect(() => {
//         getWordCountPerAgency(title.number, title.latest_amended_on)
//             .then(setWc)
//             .catch(console.error);
//     }, [title]);

//     if (!wc) return <p>Loading…</p>;
//     return (
//         <div className="mt-2 space-y-1">
//             {Object.entries(wc).map(([agency, count]) => (
//                 <div key={agency}>
//                     <strong>{agency}</strong>: {count.toLocaleString()} words
//                 </div>
//             ))}
//         </div>
//     );
// }
