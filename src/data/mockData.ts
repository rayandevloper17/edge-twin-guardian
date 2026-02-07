import { PhysicalDevice, DigitalTwin, Alert, SystemMetrics, DeviceStatus, AttackEvent } from '@/types/dashboard';

// ============================================
// MILITARY TOPOLOGY
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
    status: 'benign',
    signalStrength: 100,
    latency: 2,
    lastHeartbeat: new Date(),
    position: { x: 400, y: 100 },
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
    status: 'benign',
    signalStrength: 98,
    latency: 5,
    lastHeartbeat: new Date(),
    position: { x: 150, y: 100 },
    connections: ['mil-gateway'],
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
    status: 'benign',
    signalStrength: 92,
    latency: 12,
    lastHeartbeat: new Date(),
    position: { x: 650, y: 100 },
    connections: ['mil-gateway'],
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
    status: 'benign',
    signalStrength: 85,
    latency: 25,
    lastHeartbeat: new Date(),
    position: { x: 275, y: 160 },
    connections: ['mil-gateway'],
  },
];

// ============================================
// SMART CITY TOPOLOGY
// ============================================

export const smartCityDevices: PhysicalDevice[] = [
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
    status: 'benign',
    signalStrength: 95,
    latency: 8,
    lastHeartbeat: new Date(),
    position: { x: 400, y: 100 },
    connections: ['sc-traffic', 'sc-light', 'sc-sensor'],
  },
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
    status: 'benign',
    signalStrength: 94,
    latency: 15,
    lastHeartbeat: new Date(),
    position: { x: 150, y: 100 },
    connections: ['sc-gateway'],
  },
  {
    id: 'sc-light',
    name: 'Smart Lighting',
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
    status: 'benign',
    signalStrength: 78,
    latency: 45,
    lastHeartbeat: new Date(Date.now() - 30000),
    position: { x: 650, y: 100 },
    connections: ['sc-gateway'],
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
    status: 'benign',
    signalStrength: 88,
    latency: 80,
    lastHeartbeat: new Date(),
    position: { x: 275, y: 160 },
    connections: ['sc-gateway'],
  },
];

// ============================================
// ATTACK EVENT QUEUES — Progressive reveal during Intelligence
// Based on dataset: benign, ddos_syn, dos_tcp, mirai_udp, recon_portscan
// ============================================

export const militaryAttackQueue: AttackEvent[] = [
  {
    id: 'atk-mil-1',
    attackType: 'recon_portscan',
    targetDeviceId: 'mil-radar',
    severity: 'medium',
    label: 'Recon Port Scan',
    description: 'Sequential port scanning activity detected on Site Radar. External IP probing open services.',
    aiReasoning: 'Digital twin behavioral analysis detected 847 SYN packets to sequential ports (1-1024) within 12 seconds. Pattern matches known reconnaissance toolkit signatures. Source IP geolocation: Eastern Europe. Confidence: High.',
    confidence: 78,
    sourceIP: '45.33.32.156',
    destinationPort: 443,
    protocol: 'TCP',
    actionsTaken: ['Enhanced monitoring enabled', 'Port scan logged', 'Firewall rules updated'],
  },
  {
    id: 'atk-mil-2',
    attackType: 'ddos_syn',
    targetDeviceId: 'mil-camera',
    severity: 'critical',
    label: 'DDoS SYN Flood',
    description: 'Distributed SYN flood attack detected on Security Camera. Multiple source IPs identified.',
    aiReasoning: 'Twin drift indicator spiked to 92%. Incoming SYN rate: 45,000 packets/sec from 127 unique IPs. Connection table saturation at 94%. Pattern consistent with coordinated DDoS campaign targeting surveillance infrastructure.',
    confidence: 94,
    sourceIP: '185.220.101.x',
    destinationPort: 80,
    protocol: 'TCP',
    actionsTaken: ['Traffic isolated', 'Device quarantined', 'Incident reported to SOC'],
  },
  {
    id: 'atk-mil-3',
    attackType: 'mirai_udp',
    targetDeviceId: 'mil-sensor',
    severity: 'high',
    label: 'Mirai UDP Flood',
    description: 'Mirai botnet variant detected targeting Field Sensor with UDP flood.',
    aiReasoning: 'UDP packet payload analysis matches Mirai variant C&C communication pattern. Flood rate: 12,000 packets/sec. Twin analysis shows 67% deviation from normal UDP baseline. Botnet signature confirmed.',
    confidence: 89,
    sourceIP: '23.129.64.x',
    destinationPort: 53,
    protocol: 'UDP',
    actionsTaken: ['UDP traffic filtered', 'Botnet signatures updated', 'Network team alerted'],
  },
  {
    id: 'atk-mil-4',
    attackType: 'dos_tcp',
    targetDeviceId: 'mil-gateway',
    severity: 'critical',
    label: 'DoS TCP',
    description: 'TCP connection exhaustion attack on Secure Gateway. Service degradation imminent.',
    aiReasoning: 'Twin model detected TCP connection pool depletion. 98% of available connections consumed by incomplete handshakes. Slowloris-style attack from single high-bandwidth node. Attack duration: 4 minutes.',
    confidence: 91,
    sourceIP: '91.219.236.x',
    destinationPort: 8443,
    protocol: 'TCP',
    actionsTaken: ['Connection rate limiting applied', 'Failover gateway activated', 'Forensic capture initiated'],
  },
];

export const smartCityAttackQueue: AttackEvent[] = [
  {
    id: 'atk-sc-1',
    attackType: 'recon_portscan',
    targetDeviceId: 'sc-light',
    severity: 'medium',
    label: 'Recon Port Scan',
    description: 'Port scanning activity detected on Smart Lighting controller. Probing for vulnerable services.',
    aiReasoning: 'Digital twin detected 623 sequential SYN probes across common IoT ports (22, 23, 80, 443, 8080). Pattern matches automated scanning toolkit. Source IP traced to compromised residential network.',
    confidence: 76,
    sourceIP: '103.25.17.x',
    destinationPort: 8080,
    protocol: 'TCP',
    actionsTaken: ['Enhanced monitoring enabled', 'Firewall rules updated'],
  },
  {
    id: 'atk-sc-2',
    attackType: 'dos_tcp',
    targetDeviceId: 'sc-gateway',
    severity: 'critical',
    label: 'DoS TCP',
    description: 'TCP connection exhaustion attack targeting City Gateway. Critical infrastructure at risk.',
    aiReasoning: 'Twin model detected 96% connection pool depletion. Slowloris-style attack maintaining thousands of half-open connections. Attack sustained for 7 minutes. Critical city services affected.',
    confidence: 92,
    sourceIP: '91.219.236.x',
    destinationPort: 443,
    protocol: 'TCP',
    actionsTaken: ['Connection rate limiting applied', 'Backup gateway activated', 'City SOC notified'],
  },
  {
    id: 'atk-sc-3',
    attackType: 'ddos_syn',
    targetDeviceId: 'sc-traffic',
    severity: 'critical',
    label: 'DDoS SYN Flood',
    description: 'Distributed SYN flood targeting Traffic Controller. Traffic management systems at risk.',
    aiReasoning: 'Twin analysis shows 89% deviation from baseline. 38,000 SYN packets/sec from 94 distributed sources. Traffic controller response time degraded by 340%. Coordinated attack on city infrastructure.',
    confidence: 95,
    sourceIP: '185.220.101.x',
    destinationPort: 80,
    protocol: 'TCP',
    actionsTaken: ['Traffic rerouted', 'Device quarantined', 'Emergency traffic protocols activated'],
  },
  {
    id: 'atk-sc-4',
    attackType: 'mirai_udp',
    targetDeviceId: 'sc-sensor',
    severity: 'high',
    label: 'Mirai UDP Flood',
    description: 'Mirai botnet variant targeting Air Quality Sensor with UDP flood.',
    aiReasoning: 'UDP payload analysis matches Mirai C&C signatures. Sensor reporting 78% deviation from normal behavior. Flood rate: 8,500 packets/sec. Environmental monitoring integrity compromised.',
    confidence: 87,
    sourceIP: '23.129.64.x',
    destinationPort: 53,
    protocol: 'UDP',
    actionsTaken: ['UDP traffic filtered', 'Sensor isolated for analysis', 'Environmental data backup activated'],
  },
];

// Legacy attack scenarios (kept for compatibility)
export const attackScenarios: Record<string, Record<string, DeviceStatus>> = {
  military: {
    'mil-camera': 'compromised',
  },
  'smart-cities': {
    'sc-gateway': 'compromised',
    'sc-light': 'suspicious',
  },
};

// Digital Twin Layer
export const createDigitalTwins = (devices: PhysicalDevice[]): DigitalTwin[] => {
  const TWIN_Y_OFFSET = 260;

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
    driftIndicator: Math.random() * 15,
    status: 'benign' as DeviceStatus,
    position: { x: device.position.x, y: device.position.y + TWIN_Y_OFFSET },
  }));
};

export const generateAlerts = (devices: PhysicalDevice[]): Alert[] => {
  const attackDevices = devices.filter(d => d.status === 'compromised');
  const warningDevices = devices.filter(d => d.status === 'suspicious');
  const alerts: Alert[] = [];

  attackDevices.forEach((device, i) => {
    alerts.push({
      id: `alert-${i + 1}`,
      timestamp: new Date(Date.now() - 60000),
      severity: 'critical',
      type: 'Attack detected',
      deviceId: device.id,
      twinId: `twin-${device.id}`,
      description: `Attack detected on ${device.name}. Immediate action required.`,
      aiReasoning: 'Pattern analysis indicates ongoing attack. Behavior deviation score: 92%. Confidence: High.',
      actionsTaken: ['In Quarantine', 'Traffic isolated', 'Incident reported to SOC'],
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

export const generateMetrics = (devices: PhysicalDevice[], alerts: Alert[]): SystemMetrics => {
  const hasAttacks = alerts.length > 0;
  return {
    totalDevices: devices.length,
    totalTwins: devices.length,
    activeAlerts: alerts.filter(a => !a.resolved).length,
    avgSyncLatency: Math.floor(Math.random() * 30) + 20,
    mttd: hasAttacks ? Math.floor(Math.random() * 120) + 30 : 0,
    overallRiskScore: alerts.some(a => a.severity === 'critical') ? 75 : hasAttacks ? 25 : 0,
    attackAttempts: hasAttacks ? alerts.length * 4 : 0,
    maliciousTraffic: hasAttacks ? alerts.length * 38 : 0,
    incidentsTrend: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 86400000),
      count: hasAttacks ? Math.floor(Math.random() * 10) + 1 : 0,
    })),
  };
};
