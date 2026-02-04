import { PhysicalDevice, DigitalTwin, Alert, SystemMetrics } from '@/types/dashboard';

// Military and Critical National Infrastructure Devices
export const militaryDevices: PhysicalDevice[] = [
  {
    id: 'mil-001',
    name: 'Site Radar',
    type: 'Radar System',
    manufacturer: 'DefenseTech',
    model: 'SR-500',
    firmwareVersion: '4.2.1',
    osVersion: 'VxWorks 7.0',
    location: 'Perimeter Zone A',
    owner: 'Military Command',
    networkType: 'Fiber Optic',
    ipAddress: '192.168.1.10',
    macAddress: 'AA:BB:CC:DD:E1:10',
    status: 'online',
    signalStrength: 98,
    latency: 5,
    lastHeartbeat: new Date(),
    position: { x: 120, y: 120 },
    connections: ['mil-002', 'mil-003'],
  },
  {
    id: 'mil-002',
    name: 'Security Camera',
    type: 'Surveillance Camera',
    manufacturer: 'SecureVision',
    model: 'SC-4K',
    firmwareVersion: '2.8.0',
    osVersion: 'Linux 5.4',
    location: 'Main Gate',
    owner: 'Security Division',
    networkType: '5G Private',
    ipAddress: '192.168.1.20',
    macAddress: 'AA:BB:CC:DD:E1:20',
    status: 'attack',
    signalStrength: 92,
    latency: 12,
    lastHeartbeat: new Date(),
    position: { x: 340, y: 100 },
    connections: ['mil-001', 'mil-004'],
  },
  {
    id: 'mil-003',
    name: 'Field Sensor',
    type: 'Environmental Sensor',
    manufacturer: 'SensorTech',
    model: 'FS-200',
    firmwareVersion: '1.5.3',
    osVersion: 'FreeRTOS',
    location: 'Field Zone B',
    owner: 'Operations Unit',
    networkType: 'LoRaWAN',
    ipAddress: '192.168.1.30',
    macAddress: 'AA:BB:CC:DD:E1:30',
    status: 'online',
    signalStrength: 85,
    latency: 25,
    lastHeartbeat: new Date(),
    position: { x: 220, y: 280 },
    connections: ['mil-001', 'mil-004'],
  },
  {
    id: 'mil-004',
    name: 'Gateway',
    type: 'Network Gateway',
    manufacturer: 'NetSecure',
    model: 'GW-1000',
    firmwareVersion: '3.0.2',
    osVersion: 'Linux 5.10',
    location: 'Command Center',
    owner: 'IT Division',
    networkType: 'Ethernet',
    ipAddress: '192.168.1.40',
    macAddress: 'AA:BB:CC:DD:E1:40',
    status: 'online',
    signalStrength: 100,
    latency: 3,
    lastHeartbeat: new Date(),
    position: { x: 440, y: 260 },
    connections: ['mil-002', 'mil-003'],
  },
];

// Smart City Devices
export const smartCityDevices: PhysicalDevice[] = [
  {
    id: 'sc-001',
    name: 'Traffic Controller',
    type: 'Traffic System',
    manufacturer: 'UrbanFlow',
    model: 'TC-500',
    firmwareVersion: '3.1.0',
    osVersion: 'Linux 4.19',
    location: 'Intersection A1',
    owner: 'City Transport Dept',
    networkType: 'LTE-M',
    ipAddress: '10.0.1.10',
    macAddress: 'CC:DD:EE:FF:01:10',
    status: 'online',
    signalStrength: 94,
    latency: 15,
    lastHeartbeat: new Date(),
    position: { x: 120, y: 120 },
    connections: ['sc-002', 'sc-003'],
  },
  {
    id: 'sc-002',
    name: 'Smart Streetlight',
    type: 'Lighting Controller',
    manufacturer: 'LumiCity',
    model: 'SL-300',
    firmwareVersion: '2.0.5',
    osVersion: 'RTOS',
    location: 'Main Boulevard',
    owner: 'Public Works',
    networkType: 'Zigbee',
    ipAddress: '10.0.1.20',
    macAddress: 'CC:DD:EE:FF:01:20',
    status: 'warning',
    signalStrength: 78,
    latency: 45,
    lastHeartbeat: new Date(Date.now() - 30000),
    position: { x: 340, y: 100 },
    connections: ['sc-001', 'sc-004'],
  },
  {
    id: 'sc-003',
    name: 'Air Quality Sensor',
    type: 'Environmental Sensor',
    manufacturer: 'CleanAir',
    model: 'AQ-100',
    firmwareVersion: '1.8.2',
    osVersion: 'Zephyr',
    location: 'Central Park',
    owner: 'Environmental Agency',
    networkType: 'NB-IoT',
    ipAddress: '10.0.1.30',
    macAddress: 'CC:DD:EE:FF:01:30',
    status: 'online',
    signalStrength: 88,
    latency: 80,
    lastHeartbeat: new Date(),
    position: { x: 220, y: 280 },
    connections: ['sc-001', 'sc-004'],
  },
  {
    id: 'sc-004',
    name: 'Smart Meter',
    type: 'Utility Meter',
    manufacturer: 'GridSmart',
    model: 'SM-200',
    firmwareVersion: '2.5.1',
    osVersion: 'Contiki',
    location: 'District 5',
    owner: 'Energy Authority',
    networkType: 'Cellular',
    ipAddress: '10.0.1.40',
    macAddress: 'CC:DD:EE:FF:01:40',
    status: 'attack',
    signalStrength: 82,
    latency: 35,
    lastHeartbeat: new Date(),
    position: { x: 440, y: 260 },
    connections: ['sc-002', 'sc-003'],
  },
];

export const createDigitalTwins = (devices: PhysicalDevice[]): DigitalTwin[] => {
  return devices.map((device, index) => ({
    id: `twin-${device.id}`,
    physicalDeviceId: device.id,
    modelType: (['physics-based', 'data-driven', 'hybrid'] as const)[index % 3],
    modelVersion: `1.${index}.0`,
    lastSyncTime: new Date(),
    syncLatency: Math.floor(Math.random() * 50) + 10,
    normalBehaviorProfile: {
      cpuUsage: { min: 10, max: 60 },
      memoryUsage: { min: 20, max: 70 },
      networkTraffic: { min: 100, max: 5000 },
      temperature: { min: 25, max: 45 },
    },
    currentValues: {
      cpuUsage: Math.floor(Math.random() * 50) + 10,
      memoryUsage: Math.floor(Math.random() * 50) + 20,
      networkTraffic: Math.floor(Math.random() * 4000) + 500,
      temperature: Math.floor(Math.random() * 15) + 28,
    },
    historicalBaseline: {
      avgResponseTime: Math.floor(Math.random() * 100) + 50,
      avgPacketLoss: Math.random() * 2,
      avgUptime: 99.5 + Math.random() * 0.4,
    },
    contextInputs: ['Network topology', 'Historical patterns', 'Threat intelligence feeds'],
    driftIndicator: device.status === 'attack' ? 85 : device.status === 'warning' ? 45 : Math.random() * 15,
    status: device.status,
    position: { x: device.position.x + 50, y: device.position.y + 180 },
  }));
};

export const generateAlerts = (devices: PhysicalDevice[]): Alert[] => {
  const attackDevices = devices.filter(d => d.status === 'attack');
  const warningDevices = devices.filter(d => d.status === 'warning');
  
  const alerts: Alert[] = [];
  
  attackDevices.forEach((device, i) => {
    alerts.push({
      id: `alert-${i + 1}`,
      timestamp: new Date(Date.now() - 60000), // 1 min ago
      severity: 'critical',
      type: 'DOS attack detected',
      deviceId: device.id,
      twinId: `twin-${device.id}`,
      description: `DDoS attack detected on ${device.name}. Immediate action required.`,
      aiReasoning: 'Pattern analysis indicates distributed denial of service attack originating from multiple external IPs. Behavior deviation score: 92%. Confidence: High.',
      actionsTaken: ['In Quarantine', 'Traffic isolated', 'Incident reported to SOC'],
      resolved: false,
    });
    
    // Add additional critical alerts
    alerts.push({
      id: `alert-${i + 2}`,
      timestamp: new Date(Date.now() - 120000), // 2 min ago
      severity: 'critical',
      type: 'DOS attack detected',
      deviceId: device.id,
      twinId: `twin-${device.id}`,
      description: `Continued attack pattern on ${device.name}.`,
      aiReasoning: 'Secondary wave detected. Attack vector: DDoS.',
      actionsTaken: ['In Quarantine'],
      resolved: false,
    });
  });
  
  warningDevices.forEach((device, i) => {
    alerts.push({
      id: `alert-warning-${i + 1}`,
      timestamp: new Date(Date.now() - 300000),
      severity: 'medium',
      type: 'Connection Anomaly',
      deviceId: device.id,
      description: `Intermittent connectivity issues detected on ${device.name}. Possible network degradation.`,
      aiReasoning: 'Latency spikes correlate with external network activity. Monitoring for escalation.',
      actionsTaken: ['Enhanced monitoring enabled', 'Network team notified'],
      resolved: false,
    });
  });
  
  return alerts;
};

export const generateMetrics = (devices: PhysicalDevice[], alerts: Alert[]): SystemMetrics => ({
  totalDevices: devices.length,
  totalTwins: devices.length,
  activeAlerts: alerts.filter(a => !a.resolved).length,
  avgSyncLatency: Math.floor(Math.random() * 30) + 20,
  mttd: Math.floor(Math.random() * 120) + 30,
  overallRiskScore: alerts.some(a => a.severity === 'critical') ? 75 : 25,
  attackAttempts: 17,
  maliciousTraffic: 157,
  incidentsTrend: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000),
    count: Math.floor(Math.random() * 10) + 1,
  })),
});
