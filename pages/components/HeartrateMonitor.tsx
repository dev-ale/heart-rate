import { useEffect, useState } from "react";
import HeartRateChart from "./HeartrateChart";


export default function HeartRateMonitor() {
    const [status, setStatus] = useState('Disconnected');
    const [heartRate, setHeartRate] = useState<number | null>(null);
    const [zone, setZone] = useState<{ name: string, color: string } | null>(null);
    const [heartRateData, setHeartRateData] = useState<{ time: string; heartRate: number }[]>([]);

    const serviceUuid = 'heart_rate';
    const characteristicUuid = 'heart_rate_measurement';

    const connectToHeartRateMonitor = async () => {
        try {
            console.log('Requesting Bluetooth Device...');
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [serviceUuid] }]
            });

            console.log('Connecting to GATT Server...');
            const server = await device.gatt!.connect();

            console.log('Getting Heart Rate Service...');
            const service = await server.getPrimaryService(serviceUuid);

            console.log('Getting Heart Rate Measurement Characteristic...');
            const characteristic = await service.getCharacteristic(characteristicUuid);

            console.log('Starting Notifications...');
            await characteristic.startNotifications();

            characteristic.addEventListener('characteristicvaluechanged', handleHeartRateMeasurement);

            setStatus('Connected');
        } catch (error) {
            console.log('Error: ' + error);
            setStatus('Disconnected (Error)');
        }
    };

    const handleHeartRateMeasurement = (event: Event) => {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value = target.value;
        const heartRate = value ? value.getUint8(1) : 0;
        console.log(event);

        setHeartRate(heartRate);

        const zone = calculateHeartRateZone(heartRate, 31, 87);
        setZone(zone);

        // Update heart rate data for the chart
        const currentTime = new Date().toLocaleTimeString();
        setHeartRateData(prevData => [...prevData, { time: currentTime, heartRate }]);

    
        // Set the document title to the heart rate
        document.title = 'Heart Rate: ' + heartRate;
        document.body.style.backgroundColor = zone.color;
    };

    const calculateHeartRateZone = (heartRate: number, age: number, weight: number) => {
        const maxHeartRate = 220 - age;
        const zones = [
            { name: 'Zone 1', min: 0, max: 0.6 * maxHeartRate, color: '#00FF00' }, // Green
            { name: 'Zone 2', min: 0.6 * maxHeartRate, max: 0.7 * maxHeartRate, color: '#FFFF00' }, // Yellow
            { name: 'Zone 3', min: 0.7 * maxHeartRate, max: 0.8 * maxHeartRate, color: '#FFA500' }, // Orange
            { name: 'Zone 4', min: 0.8 * maxHeartRate, max: 0.9 * maxHeartRate, color: '#FF4500' }, // Red-Orange
            { name: 'Zone 5', min: 0.9 * maxHeartRate, max: maxHeartRate, color: '#FF0000' } // Red
        ];

        return zones.find(zone => heartRate >= zone.min && heartRate < zone.max) || { name: 'Unknown', color: '#FFFFFF' };
    };

    useEffect(() => {
        const button = document.getElementById('connect');
        if (button) {
            button.addEventListener('click', connectToHeartRateMonitor);
        }

        return () => {
            if (button) {
                button.removeEventListener('click', connectToHeartRateMonitor);
            }
        };
    }, []);

    return (
        <div>
            <button id="connect">Connect</button>
            <p id="status">Status: {status}</p>
            <p id="heart-rate">Heart Rate: {heartRate !== null ? heartRate : 'N/A'}</p>
            <p id="zone">Zone: {zone !== null ? zone.name : 'N/A'}</p>
            <HeartRateChart data={heartRateData} />
        </div>
    );
}