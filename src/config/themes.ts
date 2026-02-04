// Multi-domain theme configuration for the Digital  Twin Command System

import { UseCase } from '@/types/dashboard';

export interface ThemeConfig {
  id: UseCase;
  name: string;
  description: string;
  // Colors (CSS variable names)
  colors: {
    primary: string;
    accent: string;
    physical: string;
    twin: string;
    sync: string;
    threat: string;
    background: string;
    surface: string;
  };
  // Device naming per type
  deviceNames: {
    radar: string;
    camera: string;
    sensor: string;
    gateway: string;
  };
  // Menu terminology
  terminology: {
    networkDiscovery: string;
    networkDiscoveryDesc: string;
    twinCreation: string;
    twinCreationDesc: string;
    synchronization: string;
    synchronizationDesc: string;
    intelligence: string;
    intelligenceDesc: string;
    threatLabel: string;
    systemStatus: string;
  };
  // Visual style
  visualStyle: {
    gridPattern: 'tactical' | 'urban';
    nodeStyle: 'angular' | 'rounded';
    connectionStyle: 'rigid' | 'flowing';
  };
}

export const militaryTheme: ThemeConfig = {
  id: 'military',
  name: 'Tactical Defense',
  description: 'Military-grade network monitoring',
  colors: {
    primary: '142 71% 45%',       // Military green
    accent: '142 76% 36%',        // Tactical green
    physical: '142 71% 45%',      // Green physical
    twin: '160 60% 45%',          // Teal Digital 
    sync: '120 60% 50%',          // Bright green sync
    threat: '0 84% 60%',          // Red hostile
    background: '120 10% 4%',     // Deep black-green
    surface: '120 10% 7%',        // Dark surface
  },
  deviceNames: {
    radar: 'Site Radar',
    camera: 'Security Camera',
    sensor: 'Field Sensor',
    gateway: 'Secure Gateway',
  },
  terminology: {
    networkDiscovery: 'Asset Discovery',
    networkDiscoveryDesc: 'Scan perimeter IoT assets',
    twinCreation: 'Digital  Replication',
    twinCreationDesc: 'Deploy virtual mirrors',
    synchronization: 'Real-Time Surveillance',
    synchronizationDesc: 'Active threat monitoring',
    intelligence: 'Threat Intelligence',
    intelligenceDesc: 'AI forensics & analysis',
    threatLabel: 'HOSTILE',
    systemStatus: 'DEFCON Status',
  },
  visualStyle: {
    gridPattern: 'tactical',
    nodeStyle: 'angular',
    connectionStyle: 'rigid',
  },
};

export const smartCityTheme: ThemeConfig = {
  id: 'smart-cities',
  name: 'Urban Operations',
  description: 'Smart city infrastructure monitoring',
  colors: {
    primary: '199 89% 48%',       // Cyan blue
    accent: '210 100% 50%',       // Electric blue
    physical: '199 89% 55%',      // Light blue physical
    twin: '262 83% 58%',          // Violet Digital 
    sync: '199 89% 48%',          // Cyan sync
    threat: '25 95% 53%',         // Orange warning
    background: '220 50% 6%',     // Deep blue
    surface: '220 50% 9%',        // Blue surface
  },
  deviceNames: {
    radar: 'Traffic Controller',
    camera: 'Surveillance Node',
    sensor: 'Air Quality Sensor',
    gateway: 'City Gateway',
  },
  terminology: {
    networkDiscovery: 'Infrastructure Scan',
    networkDiscoveryDesc: 'Discover city IoT nodes',
    twinCreation: 'Virtual Modeling',
    twinCreationDesc: 'Create Digital  replicas',
    synchronization: 'Continuous Monitoring',
    synchronizationDesc: 'Real-time sync & alerts',
    intelligence: 'Urban Risk Analysis',
    intelligenceDesc: 'Predictive analytics',
    threatLabel: 'ALERT',
    systemStatus: 'City Status',
  },
  visualStyle: {
    gridPattern: 'urban',
    nodeStyle: 'rounded',
    connectionStyle: 'flowing',
  },
};

export const themes: Record<UseCase, ThemeConfig> = {
  'military': militaryTheme,
  'smart-cities': smartCityTheme,
};

export function getTheme(useCase: UseCase | null): ThemeConfig {
  return useCase ? themes[useCase] : militaryTheme;
}

// Device type mapping from ID prefix
export function getDeviceType(deviceId: string): 'radar' | 'camera' | 'sensor' | 'gateway' {
  if (deviceId.includes('001') || deviceId.includes('radar') || deviceId.includes('traffic')) return 'radar';
  if (deviceId.includes('002') || deviceId.includes('camera') || deviceId.includes('light')) return 'camera';
  if (deviceId.includes('003') || deviceId.includes('sensor') || deviceId.includes('air')) return 'sensor';
  return 'gateway';
}
