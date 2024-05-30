"use client";

import React from 'react';
import { FaHeart } from 'react-icons/fa'; // Importing heart icon from react-icons

interface HeartRateMonitorProps {
    heartRate: number | null;
    zone: { name: string, color: string } | null;
}

const HeartRateMonitor: React.FC<HeartRateMonitorProps> = ({ heartRate, zone }) => {
    const backgroundColor = zone ? zone.color : '#A8E6CF';

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '50%', 
            width: 480, 
            height: 480, 
            backgroundColor: backgroundColor,
            boxShadow: '0 0 20px 10px rgba(255, 255, 255, 0.5)',
            position: 'relative',
            marginBottom: '20px',
            color: '#fff',
            fontSize: '1.5rem',
        }}>
            <span style={{ fontSize: '12rem' }}>{heartRate !== null ? heartRate : '--'}</span> {/* Increased font size */}
           <FaHeart style={{ fontSize: '3rem', color: 'white' }} />
            <span style={{ fontSize: '3rem' }}>{zone ? zone.name : '--'}</span> {/* Increased font size */}
        </div>
    );
};

export default HeartRateMonitor;
