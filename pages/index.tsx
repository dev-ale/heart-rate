import Image from "next/image";
import { Inter } from "next/font/google";
import HeartRateMonitor from "./components/HeartrateMonitor";
import { useState, useEffect } from "react";
import HeartRateChart from "./components/HeartrateChart";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [status, setStatus] = useState('Disconnected');
    const [heartRate, setHeartRate] = useState<number | null>(null);
    const [zone, setZone] = useState<{ name: string, color: string } | null>(null);
    const [heartRateData, setHeartRateData] = useState<{ time: string; heartRate: number }[]>([]);
    const [device, setDevice] = useState<BluetoothDevice | null>(null);

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

          setDevice(device);
          setStatus('Connected');
      } catch (error) {
          console.log('Error: ' + error);
          setStatus('Disconnected (Error)');
      }
  };

  const disconnectFromHeartRateMonitor = () => {
      if (device && device.gatt) {
          device.gatt.disconnect();
          setDevice(null);
          setStatus('Disconnected');
          setHeartRate(null);
          setZone(null);
          setHeartRateData([]);
          document.body.style.backgroundColor = '#FFFFFF'; // Reset background color
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
        { name: 'Zone 1', min: 0, max: 0.6 * maxHeartRate, color: '#A8E6CF' }, // Pastel Green
        { name: 'Zone 2', min: 0.6 * maxHeartRate, max: 0.7 * maxHeartRate, color: '#FFD3B6' }, // Pastel Yellow
        { name: 'Zone 3', min: 0.7 * maxHeartRate, max: 0.8 * maxHeartRate, color: '#FF8C94' }, // Pastel Orange
        { name: 'Zone 4', min: 0.8 * maxHeartRate, max: 0.9 * maxHeartRate, color: '#FFAAA5' }, // Pastel Red
        { name: 'Zone 5', min: 0.9 * maxHeartRate, max: maxHeartRate, color: '#FF8B94' } // Pastel Pink
    ];

      return zones.find(zone => heartRate >= zone.min && heartRate < zone.max) || { name: 'Unknown', color: '#FFFFFF' };
  };

  const handleButtonClick = () => {
      if (status === 'Connected') {
          disconnectFromHeartRateMonitor();
      } else {
          connectToHeartRateMonitor();
      }
  };

  return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'space-around' }}>
          <button 
              onClick={handleButtonClick} 
              style={{ position: 'absolute', top: 10, right: 10 }}
          >
              {status === 'Connected' ? 'Disconnect' : 'Connect'}
          </button>
          <HeartRateMonitor heartRate={heartRate} zone={zone} />
          <br />
          <br />
          <br />
          <HeartRateChart data={heartRateData} color={zone?.color} />
      </div>
  );
};
