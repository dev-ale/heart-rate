"use client";

import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface HeartRateChartProps {
    data: { time: string; heartRate: number }[];
    color?: string;
}

const HeartRateChart: React.FC<HeartRateChartProps> = ({ data, color }) => {
    const strokeColor = color ? color : '#A8E6CF';
    return (
        <div style={{ width: '100%', height: '30%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Line type="monotone" dataKey="heartRate" stroke={strokeColor} strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HeartRateChart;
