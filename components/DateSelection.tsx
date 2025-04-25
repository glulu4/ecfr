'use client';

import {useState} from 'react';
import toast from 'react-hot-toast';
import {Check} from 'lucide-react';
import {Carousel, CarouselContent, CarouselItem} from '@/components/ui/carousel'; 
import {formatDate} from '@/lib/utils';

interface DatePillCarouselProps {
    availableDates: string[];
    initialSelected?: string[];
    maxSelections?: number;
    onSelectionChange: (dates: string[]) => void;
}

export function DateSelection({
    availableDates,
    initialSelected = [],
    maxSelections = 3,
    onSelectionChange,
}: DatePillCarouselProps) {
    const [selected, setSelected] = useState(initialSelected);

    const toggle = (d: string) => {
        setSelected(prev => {
            if (prev.includes(d)) {
                const next = prev.filter(x => x !== d);
                onSelectionChange(next);
                return next;
            }
            if (prev.length >= maxSelections) {
                toast.error(`You can only select up to ${maxSelections} dates.`);
                return prev;
            }
            const next = [...prev, d];
            onSelectionChange(next);
            return next;
        });
    };

    return (
        <div className="relative mx-auto max-w-5xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-slate-900 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-slate-900 to-transparent" />

            <Carousel opts={{dragFree: true, align: 'start'}}>
                <CarouselContent className="gap-2 px-1 py-2">
                    {availableDates.map(d => {
                        const active = selected.includes(d);
                        return (
                            <CarouselItem
                                key={d}
                                className="basis-auto grow-0 shrink-0"   
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(d)}
                                    aria-pressed={active}
                                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm transition-colors
                    ${active
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {formatDate(d)}
                                    {active && <Check className="inline-block ml-1 h-3 w-3" />}
                                </button>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
            </Carousel>
        </div>
    );
}
