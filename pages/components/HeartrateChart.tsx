import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface HeartRateChartProps {
    data: { time: string; heartRate: number }[];
}

const HeartRateChart: React.FC<HeartRateChartProps> = ({ data }) => {
    return (
        <div style={{ width: '100%', height: '30vh' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Line type="monotone" dataKey="heartRate" stroke="#8884d8" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HeartRateChart;
