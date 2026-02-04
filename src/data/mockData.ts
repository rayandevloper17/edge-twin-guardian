import { PhysicalDevice, DigitalTwin, Alert, SystemMetrics } from '@/types/dashboard';

// ============================================
// MILITARY TOPOLOGY: Hierarchical Command Structure
// Gateway at center-top, devices radiate in command hierarchy
// ============================================

export const militaryDevices: PhysicalDevice[] = [
  {
    id: 'mil-gateway',
    name: 'Secure Gateway',
    type: 'Network Gateway',
    deviceType: 'gateway',
    manufacturer: 'NetSecure',
    model: 'GW-1000',
    firmwareVersion: '3.0.2',
    osVersion: 'Linux 5.10',
    location: 'Command Center',
    owner: 'IT Division',
    networkType: 'Fiber Optic',
    ipAddress: '192.168.1.1',
    macAddress: 'AA:BB:CC:DD:E1:01',
    status: 'online',
    signalStrength: 100,
    latency: 2,
    lastHeartbeat: new Date(),
    // Central top position - command node
    position: { x: 250, y: 70 },
    // Gateway connects to ALL field devices (star topology from command)
    connections: ['mil-radar', 'mil-camera', 'mil-sensor'],
  },
  {
    id: 'mil-radar',
    name: 'Site Radar',
    type: 'Radar System',
    deviceType: 'radar',
    manufacturer: 'DefenseTech',
    model: 'SR-500',
    firmwareVersion: '4.2.1',
    osVersion: 'VxWorks 7.0',
    location: 'Perimeter Zone A',
    owner: 'Military Command',
    networkType: '5G Private',
    ipAddress: '192.168.1.10',
    macAddress: 'AA:BB:CC:DD:E1:10',
    status: 'online',
    signalStrength: 98,
    latency: 5,
    lastHeartbeat: new Date(),
    // Left subordinate position
    position: { x: 100, y: 140 },
    connections: ['mil-gateway', 'mil-sensor'],
  },
  {
    id: 'mil-camera',
    name: 'Security Camera',
    type: 'Surveillance Camera',
    deviceType: 'camera',
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
    // Right subordinate position
    position: { x: 400, y: 140 },
    connections: ['mil-gateway', 'mil-sensor'],
  },
  {
    id: 'mil-sensor',
    name: 'Field Sensor',
    type: 'Environmental Sensor',
    deviceType: 'sensor',
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
    // Bottom center - field level
    position: { x: 250, y: 170 },
    connections: ['mil-radar', 'mil-camera'],
  },
];

// ============================================
// SMART CITY TOPOLOGY: Distributed Mesh Network
// Decentralized many-to-many connections
// ============================================

export const smartCityDevices: PhysicalDevice[] = [
  {
    id: 'sc-traffic',
    name: 'Traffic Controller',
    type: 'Traffic System',
    deviceType: 'radar',
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
    // Top-left - distributed position
    position: { x: 120, y: 80 },
    // Mesh: connects to multiple peers
    connections: ['sc-light', 'sc-sensor', 'sc-gateway'],
  },
  {
    id: 'sc-light',
    name: 'Smart Lighting Node',
    type: 'Lighting Controller',
    deviceType: 'camera',
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
    // Top-right
    position: { x: 380, y: 80 },
    connections: ['sc-traffic', 'sc-gateway'],
  },
  {
    id: 'sc-sensor',
    name: 'Air Quality Sensor',
    type: 'Environmental Sensor',
    deviceType: 'sensor',
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
    // Bottom-left
    position: { x: 120, y: 170 },
    connections: ['sc-traffic', 'sc-gateway'],
  },
  {
    id: 'sc-gateway',
    name: 'City Gateway',
    type: 'Utility Gateway',
    deviceType: 'gateway',
    manufacturer: 'GridSmart',
    model: 'CG-200',
    firmwareVersion: '2.5.1',
    osVersion: 'Contiki',
    location: 'District Hub',
    owner: 'City IT',
    networkType: 'Fiber',
    ipAddress: '10.0.1.1',
    macAddress: 'CC:DD:EE:FF:01:01',
    status: 'attack',
    signalStrength: 95,
    latency: 8,
    lastHeartbeat: new Date(),
    // Bottom-right - NOT central, just another node in mesh
    position: { x: 380, y: 170 },
    connections: ['sc-traffic', 'sc-light', 'sc-sensor'],
  },
];

// Digital Twin Layer - BOTTOM (y: 280-360)
// Mirrors physical topology but in separate spatial layer
export const createDigitalTwins = (devices: PhysicalDevice[]): DigitalTwin[] => {
  return devices.map((device, index) => ({
    id: `twin-${device.id}`,
    physicalDeviceId: device.id,
    deviceType: device.deviceType,
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
    // Digital layer positioned BELOW physical layer
    position: { x: device.position.x, y: device.position.y + 220 },
  }));
};

export const generateAlerts = (devices: PhysicalDevice[]): Alert[] => {
  const attackDevices = devices.filter(d => d.status === 'attack');
  const warningDevices = devices.filter(d => d.status === 'warning');
  
  const alerts: Alert[] = [];
  
  attackDevices.forEach((device, i) => {
    alerts.push({
      id: `alert-${i + 1}`,
      timestamp: new Date(Date.now() - 60000),
      severity: 'critical',
      type: 'DOS attack detected',
      deviceId: device.id,
      twinId: `twin-${device.id}`,
      description: `DDoS attack detected on ${device.name}. Immediate action required.`,
      aiReasoning: 'Pattern analysis indicates distributed denial of service attack originating from multiple external IPs. Behavior deviation score: 92%. Confidence: High.',
      actionsTaken: ['In Quarantine', 'Traffic isolated', 'Incident reported to SOC'],
      resolved: false,
    });
    
    alerts.push({
      id: `alert-${i + 2}`,
      timestamp: new Date(Date.now() - 120000),
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
