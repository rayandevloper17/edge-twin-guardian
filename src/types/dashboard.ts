// Types for the Network Edge Digital Twin Dashboard

export type UseCase = 'military' | 'smart-cities';

export type SystemStage = 
  | 'network-discovery'
  | 'digital-twin-creation'
  | 'synchronization'
  | 'intelligence';

export type DeviceStatus = 'online' | 'offline' | 'warning' | 'attack';

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
  signalStrength: number; // 0-100
  latency: number; // ms
  lastHeartbeat: Date;
  position: { x: number; y: number };
  connections: string[]; // IDs of connected devices
}

export interface DigitalTwin {
  id: string;
  physicalDeviceId: string;
  deviceType: DeviceType;
  modelType: TwinModelType;
  modelVersion: string;
  lastSyncTime: Date;
  syncLatency: number; // ms
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
  driftIndicator: number; // 0-100, percentage of deviation from baseline
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
  mttd: number; // Mean Time To Detect (seconds)
  overallRiskScore: number; // 0-100
  attackAttempts: number;
  maliciousTraffic: number; // in MB
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
}
