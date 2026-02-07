import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  DashboardState,
  UseCase,
  SystemStage,
  PhysicalDevice,
  DigitalTwin,
  Alert,
  SystemMetrics
} from '@/types/dashboard';
import {
  militaryDevices,
  smartCityDevices,
  createDigitalTwins,
  generateAlerts,
  generateMetrics,
  attackScenarios,
} from '@/data/mockData';

type DashboardAction =
  | { type: 'SET_USE_CASE'; payload: UseCase }
  | { type: 'SET_STAGE'; payload: SystemStage }
  | { type: 'SELECT_DEVICE'; payload: string | null }
  | { type: 'SELECT_TWIN'; payload: string | null }
  | { type: 'HOVER_DEVICE'; payload: string | null }
  | { type: 'CREATE_TWINS' }
  | { type: 'RESET' };

const initialState: DashboardState = {
  useCase: null,
  currentStage: 'network-discovery',
  selectedDeviceId: null,
  selectedTwinId: null,
  hoveredDeviceId: null,
  devices: [],
  twins: [],
  alerts: [],
  metrics: {
    totalDevices: 0,
    totalTwins: 0,
    activeAlerts: 0,
    avgSyncLatency: 0,
    mttd: 0,
    overallRiskScore: 0,
    attackAttempts: 0,
    maliciousTraffic: 0,
    incidentsTrend: [],
  },
  twinCreationComplete: false,
  intelligenceActive: false,
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_USE_CASE': {
      const devices = action.payload === 'military' ? militaryDevices : smartCityDevices;
      return {
        ...state,
        useCase: action.payload,
        devices,
        alerts: [],
        metrics: generateMetrics(devices, []),
        currentStage: 'network-discovery',
        twinCreationComplete: false,
        intelligenceActive: false,
        twins: [],
      };
    }
    case 'SET_STAGE': {
      // Enforce lifecycle order
      const stageOrder: SystemStage[] = ['network-discovery', 'Digital -twin-creation', 'synchronization', 'intelligence'];
      const newIndex = stageOrder.indexOf(action.payload);

      // Can only go forward if twins are created (for sync and intelligence stages)
      if (newIndex > 1 && !state.twinCreationComplete) {
        return state;
      }

      // Intelligence stage: activate AI analysis and reveal attacks
      if (action.payload === 'intelligence') {
        const scenarios = attackScenarios[state.useCase || 'military'] || {};
        const updatedDevices = state.devices.map(d => ({
          ...d,
          status: scenarios[d.id] || d.status,
        }));
        const updatedTwins = state.twins.map(t => {
          const attackStatus = scenarios[t.physicalDeviceId];
          return {
            ...t,
            status: attackStatus || t.status,
            driftIndicator: attackStatus === 'compromised' ? 85 :
                           attackStatus === 'suspicious' ? 45 : t.driftIndicator,
          };
        });
        const alerts = generateAlerts(updatedDevices);
        return {
          ...state,
          currentStage: 'intelligence',
          devices: updatedDevices,
          twins: updatedTwins,
          alerts,
          metrics: generateMetrics(updatedDevices, alerts),
          intelligenceActive: true,
          selectedDeviceId: null,
          selectedTwinId: null,
        };
      }

      return {
        ...state,
        currentStage: action.payload,
        selectedDeviceId: null,
        selectedTwinId: null,
      };
    }
    case 'SELECT_DEVICE':
      return {
        ...state,
        selectedDeviceId: action.payload,
        selectedTwinId: null,
      };
    case 'SELECT_TWIN':
      return {
        ...state,
        selectedTwinId: action.payload,
        selectedDeviceId: null,
      };
    case 'HOVER_DEVICE':
      return {
        ...state,
        hoveredDeviceId: action.payload,
      };
    case 'CREATE_TWINS': {
      const twins = createDigitalTwins(state.devices);
      return {
        ...state,
        twins,
        twinCreationComplete: true,
        currentStage: 'Digital -twin-creation',
        metrics: {
          ...state.metrics,
          totalTwins: twins.length,
        },
      };
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  setUseCase: (useCase: UseCase) => void;
  setStage: (stage: SystemStage) => void;
  selectDevice: (id: string | null) => void;
  selectTwin: (id: string | null) => void;
  hoverDevice: (id: string | null) => void;
  createTwins: () => void;
  canAccessStage: (stage: SystemStage) => boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const setUseCase = (useCase: UseCase) => dispatch({ type: 'SET_USE_CASE', payload: useCase });
  const setStage = (stage: SystemStage) => dispatch({ type: 'SET_STAGE', payload: stage });
  const selectDevice = (id: string | null) => dispatch({ type: 'SELECT_DEVICE', payload: id });
  const selectTwin = (id: string | null) => dispatch({ type: 'SELECT_TWIN', payload: id });
  const hoverDevice = (id: string | null) => dispatch({ type: 'HOVER_DEVICE', payload: id });
  const createTwins = () => dispatch({ type: 'CREATE_TWINS' });

  const canAccessStage = (stage: SystemStage): boolean => {
    const stageOrder: SystemStage[] = ['network-discovery', 'Digital -twin-creation', 'synchronization', 'intelligence'];
    const targetIndex = stageOrder.indexOf(stage);

    // Can always access first two stages
    if (targetIndex <= 1) return true;

    // Need twins created for sync and intelligence
    return state.twinCreationComplete;
  };

  return (
    <DashboardContext.Provider
      value={{
        state,
        dispatch,
        setUseCase,
        setStage,
        selectDevice,
        selectTwin,
        hoverDevice,
        createTwins,
        canAccessStage,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
