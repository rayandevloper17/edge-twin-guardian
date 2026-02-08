// Types for the Network Edge Digital Twin Dashboard

export type UseCase = 'military' | 'smart-cities';

export type SystemStage =
  | 'network-discovery'
  | 'Digital -twin-creation'
  | 'synchronization'
  | 'intelligence';

export type DeviceStatus = 'benign' | 'suspicious' | 'compromised';

export type AttackType = 'ddos_syn' | 'dos_tcp' | 'mirai_udp' | 'recon_portscan';

export function getAttackLabel(type: AttackType): string {
  switch (type) {
    case 'ddos_syn': return 'DDoS SYN Flood';
    case 'dos_tcp': return 'DoS TCP';
    case 'mirai_udp': return 'Mirai UDP Flood';
    case 'recon_portscan': return 'Recon Port Scan';
  }
}

// Helper to get display label for device security status
export function getStatusLabel(status: DeviceStatus, threatLabel?: string): string {
  switch (status) {
    case 'benign': return 'Benign';
    case 'suspicious': return 'Suspicious';
    case 'compromised': return threatLabel || 'Compromised';
  }
}

export interface AttackEvent {
  id: string;
  attackType: AttackType;
  targetDeviceId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  label: string;
  description: string;
  aiReasoning: string;
  confidence: number;
  sourceIP: string;
  destinationPort: number;
  protocol: string;
  actionsTaken: string[];
}

export type TwinModelType = 'physics-based' | 'data-driven' | 'hybrid';

export type DeviceType = 'radar' | 'camera' | 'sensor' | 'gateway';

export interface PhysicalDevice {
  id: string;
  name: string;
  type: string;
  deviceType: DeviceType;
  manufacturer: string;
  model: string;
  firmwareVersion: string;
  osVersion: string;
  location: string;
  owner: string;
  networkType: string;
  ipAddress: string;
  macAddress: string;
  status: DeviceStatus;
  signalStrength: number;
  latency: number;
  lastHeartbeat: Date;
  position: { x: number; y: number };
  connections: string[];
}

export interface DigitalTwin {
  id: string;
  physicalDeviceId: string;
  deviceType: DeviceType;
  modelType: TwinModelType;
  modelVersion: string;
  lastSyncTime: Date;
  syncLatency: number;
  normalBehaviorProfile: {
    cpuUsage: { min: number; max: number };
    memoryUsage: { min: number; max: number };
    networkTraffic: { min: number; max: number };
    temperature: { min: number; max: number };
  };
  currentValues: {
    cpuUsage: number;
    memoryUsage: number;
    networkTraffic: number;
    temperature: number;
  };
  historicalBaseline: {
    avgResponseTime: number;
    avgPacketLoss: number;
    avgUptime: number;
  };
  contextInputs: string[];
  driftIndicator: number;
  status: DeviceStatus;
  position: { x: number; y: number };
}

export interface Alert {
  id: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  deviceId: string;
  twinId?: string;
  description: string;
  aiReasoning?: string;
  actionsTaken: string[];
  resolved: boolean;
}

export interface SyncData {
  physicalValue: number;
  twinValue: number;
  timestamp: Date;
  drift: number;
}

export interface SystemMetrics {
  totalDevices: number;
  totalTwins: number;
  activeAlerts: number;
  avgSyncLatency: number;
  mttd: number;
  overallRiskScore: number;
  attackAttempts: number;
  maliciousTraffic: number;
  incidentsTrend: { date: Date; count: number }[];
}

export interface DashboardState {
  useCase: UseCase | null;
  currentStage: SystemStage;
  selectedDeviceId: string | null;
  selectedTwinId: string | null;
  hoveredDeviceId: string | null;
  devices: PhysicalDevice[];
  twins: DigitalTwin[];
  alerts: Alert[];
  metrics: SystemMetrics;
  twinCreationComplete: boolean;
  intelligenceActive: boolean;
  // Scanning phase
  scanningComplete: boolean;
  discoveredDeviceIds: string[];
  // Device selection for twinning
  selectedForTwinning: string[];
  // Attack simulation
  attackPool: AttackEvent[];       // Full list of possible attacks (never consumed)
  activeAttack: AttackEvent | null; // Currently displayed attack (cycles)
  attackHistory: AttackEvent[];     // Running log of all past attacks shown
  attackCycleIndex: number;         // Current position in the attack pool
}
