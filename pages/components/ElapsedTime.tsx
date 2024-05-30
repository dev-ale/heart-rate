import React, { useEffect, useState } from 'react';

interface ElapsedTimeProps {
    startTime: Date | null;
    color?: string;
}

const ElapsedTime: React.FC<ElapsedTimeProps> = ({ startTime, color }) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const fontColor = color ? color : '#A8E6CF';

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (startTime) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
            }, 1000);
        } else {
            setElapsedTime(0);
        }

        return () => clearInterval(interval);
    }, [startTime]);

    const formatTime = (seconds: number) => {
        if (seconds == 0) return '';

        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    return <div style={{ marginTop: '20px', fontSize: '1.5rem', color: fontColor }}>{formatTime(elapsedTime)}</div>;
};

export default ElapsedTime;
