import React from 'react';
import {Bar} from '@visx/shape';
import {Group} from '@visx/group';
import {scaleBand, scaleLinear} from '@visx/scale';
import {AxisLeft, AxisBottom} from '@visx/axis';
import {max} from 'd3-array';
import {formatDate} from '@/lib/utils';

interface WordCountData {
    agency: string;
    count: number;
}

interface ChartProps {
    data: WordCountData[];
    width?: number;
    height?: number;
    titleNum: string;
    amendedOn: string;
}

export function WordCountChart({
    data,
    width = 800,
    height = 400,
    titleNum,
    amendedOn,
}: ChartProps) {
    const margin = {top: 40, right: 40, bottom: 80, left: 100};

    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const xScale = scaleBand<string>({
        domain: data.map((d) => d.agency),
        padding: 0.3,
        range: [0, xMax],
    });

    const yScale = scaleLinear<number>({
        domain: [0, max(data, (d) => d.count) || 0],
        nice: true,
        range: [yMax, 0],
    });

    return (
        <svg width={width} height={height}>
            <Group top={margin.top} left={margin.left}>
                <text
                    x={xMax / 2}
                    y={-20}
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="bold"
                >
                    Word Count by Agency for Title {titleNum}
                </text>
                <text
                    x={xMax / 2}
                    y={0}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#9ca3af"
                >
                    Data sourced from e-CFR as of {formatDate(amendedOn)}
                </text>

                {data.map((d, i) => {
                    const barWidth = xScale.bandwidth();
                    const barHeight = yMax - yScale(d.count);
                    const barX = xScale(d.agency) ?? 0;
                    const barY = yScale(d.count);
                    return (
                        <Bar
                            key={`bar-${i}`}
                            x={barX}
                            y={barY}
                            width={barWidth}
                            height={barHeight}
                            fill="#2563eb"
                        />
                    );
                })}

                <AxisLeft scale={yScale} />
                <AxisBottom
                    top={yMax}
                    scale={xScale}
                    tickLabelProps={() => ({
                        angle: 45,
                        textAnchor: 'start',
                        fontSize: 10,
                        fill: '#4b5563',
                        overflow: 'visible',
                    })}
                />
            </Group>
        </svg>
    );
}