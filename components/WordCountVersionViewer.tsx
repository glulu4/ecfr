'use client';

import { useState, useEffect } from 'react';
import { GroupedBarChart } from './GroupedBarChart';
import { DateSelection } from './DateSelection'; 
import { type Datum } from './GroupedBarChart'; 

type Props = {
    titleNum: number;
    availableDates: string[];
};

const wcCache = new Map<string, Record<string, number>>();

export function WordCountVersionViewer({ titleNum, availableDates }: Props) {
    const [data, setData] = useState<Datum[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [enabledDates, setEnabledDates] = useState<string[]>([availableDates[0]]);

    useEffect(() => {
        if (enabledDates.length === 0) {
            setData([]);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const results = await Promise.all(
                    enabledDates.map(async date => {
                        const key = `${titleNum}-${date}`;
                        if (!wcCache.has(key)) {
                            const res = await fetch(`/api/word-count?title=${titleNum}&date=${date}`);
                            const json = await res.json();
                            wcCache.set(key, json);
                        }
                        return { date: date, data: wcCache.get(key)! };
                    }),
                );

                const flattened: Datum[] = results.flatMap(({ date, data }) =>
                    Object.entries(data).map(([agency, value]) => ({
                        agency,
                        date,
                        value,
                    })),
                );

                if (!cancelled) setData(flattened);
            } catch (e: any) {
                if (!cancelled) setError(e.message ?? 'Unknown error');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [titleNum, enabledDates.join('|')]);

    return (
        <section className="space-y-6">
            <DateSelection
                availableDates={availableDates}
                initialSelected={[availableDates[0]]}
                maxSelections={3}
                onSelectionChange={setEnabledDates}
            />

            {loading && <p className="text-gray-500">Loading…</p>}
            {error && <p className="text-red-600">{error}</p>}
            {data.length > 0 && !loading && !error && (
                <div className="max-h-[600px] overflow-y-auto">
                    <GroupedBarChart data={data} selectedDates={enabledDates} />
                </div>
            )}
        </section>
    );
}