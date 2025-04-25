'use client';

import {Group} from '@visx/group';
import {Bar} from '@visx/shape';
import {AxisLeft, AxisBottom} from '@visx/axis';
import {scaleBand, scaleLinear, scaleOrdinal} from '@visx/scale';
import {max} from 'd3-array';
import {format} from 'd3-format';
import {Fragment} from 'react';

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

export type Datum = {agency: string; date: string; value: number};
type Props = {
    data: Datum[];
    selectedDates: string[];
    width?: number;
    height?: number;
};

const palette = ['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#0e7490', '#059669', '#ca8a04'];

/* ================================================================= */
export function GroupedBarChart({
    data,
    selectedDates,
    width = 920,
    height = 480,
}: Props) {
    if (!data.length) return null;

    const agencies = Array.from(new Set(data.map(d => d.agency))).sort();
    const dates = selectedDates;

    const colour = scaleOrdinal<string, string>({
        domain: dates,
        range: palette,
    });

    const legendHeight = 32;
    const barHeight = 12; 
    const barSpacing = 4; 
    const groupHeight = dates.length * (barHeight + barSpacing) - barSpacing;
    const totalHeight = agencies.length * (groupHeight + 10) + 100;
    const adjustedHeight = Math.max(height, totalHeight);

    const margin = {top: 48 + legendHeight, right: 60, bottom: 56, left: 260}; 
    const xMax = width - margin.left - margin.right;
    const yMax = adjustedHeight - margin.top - margin.bottom;

    const xScale = scaleLinear<number>({
        domain: [0, max(data, d => d.value) ?? 0],
        nice: true,
        range: [0, xMax],
    });

    const yScale = scaleBand<string>({
        domain: agencies,
        padding: 0.35,
        range: [0, yMax],
    });

    return (
        <svg width={width} height={adjustedHeight}>
            {/* Legend */}
            <Group top={20} left={margin.left}>
                {dates.map((d, i) => (
                    <Group key={d} transform={`translate(${i * 150}, 0)`}>
                        <circle r={6} cx={6} cy={6} fill={colour(d)} />
                        <text x={16} y={10} fontSize={12} fill="#374151">
                            {formatDate(d)}
                        </text>
                    </Group>
                ))}
            </Group>

            <Group top={margin.top} left={margin.left}>
                {agencies.map(agency => (
                    <Group key={agency} top={yScale(agency)!}>
                        {dates.map((date, idx) => {
                            const datum = data.find(v => v.agency === agency && v.date === date);
                            if (!datum) return <Fragment key={date} />;
                            const y = idx * (barHeight + barSpacing);
                            const w = xScale(datum.value);
                            return (
                                <Bar
                                    key={date}
                                    x={0}
                                    y={y}
                                    width={w}
                                    height={barHeight}
                                    fill={colour(date)}
                                    rx={4}
                                />
                            );
                        })}
                        <foreignObject
                            x={-margin.left + 4}
                            y={(dates.length * (barHeight + barSpacing) - 14) / 2}
                            width={margin.left - 10}
                            height={32}
                            style={{overflow: 'visible'}}
                        >
                            <div
                                style={{
                                    fontSize: 12,
                                    color: '#111827',
                                    textAlign: 'right',
                                    lineHeight: '14px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {agency}
                            </div>
                        </foreignObject>
                    </Group>
                ))}

                <AxisLeft
                    scale={yScale}
                    hideAxisLine
                    hideTicks
                    tickLabelProps={() => ({display: 'none'})}
                />
                <AxisBottom
                    top={yMax}
                    scale={xScale}
                    tickStroke="#d1d5db"
                    stroke="#d1d5db"
                    tickFormat={v => format(',')(v as number)}
                    tickLabelProps={() => ({
                        fontSize: 11,
                        fill: '#4b5563',
                        dy: '0.25em',
                    })}
                />
            </Group>
        </svg>
    );
}