import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import {
  DashboardState,
  UseCase,
  SystemStage,
  DeviceStatus,
  Alert,
} from '@/types/dashboard';
import {
  militaryDevices,
  smartCityDevices,
  createDigitalTwins,
  generateMetrics,
  militaryAttackQueue,
  smartCityAttackQueue,
} from '@/data/mockData';

type DashboardAction =
  | { type: 'SET_USE_CASE'; payload: UseCase }
  | { type: 'SET_STAGE'; payload: SystemStage }
  | { type: 'SELECT_DEVICE'; payload: string | null }
  | { type: 'SELECT_TWIN'; payload: string | null }
  | { type: 'HOVER_DEVICE'; payload: string | null }
  | { type: 'CREATE_TWINS' }
  | { type: 'DISCOVER_DEVICE'; payload: string }
  | { type: 'SET_SCANNING_COMPLETE' }
  | { type: 'TOGGLE_DEVICE_FOR_TWINNING'; payload: string }
  | { type: 'SELECT_ALL_FOR_TWINNING' }
  | { type: 'SHOW_NEXT_ATTACK' }
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
  scanningComplete: false,
  discoveredDeviceIds: [],
  selectedForTwinning: [],
  attackPool: [],
  activeAttack: null,
  attackHistory: [],
  attackCycleIndex: 0,
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
        scanningComplete: false,
        discoveredDeviceIds: [],
        selectedForTwinning: [],
        attackPool: [],
        activeAttack: null,
        attackHistory: [],
        attackCycleIndex: 0,
      };
    }

    case 'DISCOVER_DEVICE': {
      if (state.discoveredDeviceIds.includes(action.payload)) return state;
      return {
        ...state,
        discoveredDeviceIds: [...state.discoveredDeviceIds, action.payload],
      };
    }

    case 'SET_SCANNING_COMPLETE':
      return {
        ...state,
        scanningComplete: true,
        selectedForTwinning: state.devices.map(d => d.id),
      };

    case 'TOGGLE_DEVICE_FOR_TWINNING': {
      const isSelected = state.selectedForTwinning.includes(action.payload);
      return {
        ...state,
        selectedForTwinning: isSelected
          ? state.selectedForTwinning.filter(id => id !== action.payload)
          : [...state.selectedForTwinning, action.payload],
      };
    }

    case 'SELECT_ALL_FOR_TWINNING': {
      const allSelected = state.selectedForTwinning.length === state.devices.length;
      return {
        ...state,
        selectedForTwinning: allSelected ? [] : state.devices.map(d => d.id),
      };
    }

    case 'SET_STAGE': {
      const stageOrder: SystemStage[] = ['network-discovery', 'Digital -twin-creation', 'synchronization', 'ai-analysis'];

      // Intelligence is always accessible (it's a data layer, not a flow step)
      if (action.payload === 'intelligence') {
        return {
          ...state,
          currentStage: 'intelligence',
          selectedDeviceId: null,
          selectedTwinId: null,
        };
      }

      const newIndex = stageOrder.indexOf(action.payload);

      if (newIndex > 1 && !state.twinCreationComplete) {
        return state;
      }

      // AI Analysis stage: populate attack pool for persistent detection
      if (action.payload === 'ai-analysis') {
        const pool = (state.useCase === 'military' ? militaryAttackQueue : smartCityAttackQueue)
          .filter(atk => state.twins.some(t => t.physicalDeviceId === atk.targetDeviceId));

        return {
          ...state,
          currentStage: 'ai-analysis',
          intelligenceActive: true,
          attackPool: pool,
          activeAttack: null,
          attackHistory: [],
          attackCycleIndex: 0,
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

    // Show the next attack — PERSISTENT: devices stay red once flagged
    case 'SHOW_NEXT_ATTACK': {
      if (state.attackPool.length === 0) return state;

      const nextAttack = state.attackPool[state.attackCycleIndex % state.attackPool.length];

      // If we've shown all attacks, stop cycling
      if (state.attackCycleIndex >= state.attackPool.length) return state;

      const newStatus: DeviceStatus =
        nextAttack.severity === 'critical' ? 'compromised' : 'suspicious';

      // Mark the targeted device and its twin — PERSISTENT, no clearing
      const updatedDevices = state.devices.map(d =>
        d.id === nextAttack.targetDeviceId ? { ...d, status: newStatus } : d
      );

      const updatedTwins = state.twins.map(t => {
        if (t.physicalDeviceId === nextAttack.targetDeviceId) {
          return {
            ...t,
            status: newStatus,
            driftIndicator: newStatus === 'compromised' ? 85 : 45,
          };
        }
        return t;
      });

      // Create an alert for the log
      const newAlert: Alert = {
        id: `alert-${nextAttack.id}-${Date.now()}`,
        timestamp: new Date(),
        severity: nextAttack.severity,
        type: nextAttack.label,
        deviceId: nextAttack.targetDeviceId,
        twinId: `twin-${nextAttack.targetDeviceId}`,
        description: nextAttack.description,
        aiReasoning: nextAttack.aiReasoning,
        actionsTaken: nextAttack.actionsTaken,
        resolved: false,
      };

      const newAlerts = [...state.alerts, newAlert];

      const newHistory = [...state.attackHistory, nextAttack];

      return {
        ...state,
        activeAttack: nextAttack,
        attackHistory: newHistory,
        attackCycleIndex: state.attackCycleIndex + 1,
        devices: updatedDevices,
        twins: updatedTwins,
        alerts: newAlerts,
        metrics: generateMetrics(updatedDevices, newAlerts),
      };
    }

    case 'SELECT_DEVICE':
      return { ...state, selectedDeviceId: action.payload, selectedTwinId: null };

    case 'SELECT_TWIN':
      return { ...state, selectedTwinId: action.payload, selectedDeviceId: null };

    case 'HOVER_DEVICE':
      return { ...state, hoveredDeviceId: action.payload };

    case 'CREATE_TWINS': {
      const selectedDevices = state.devices.filter(d =>
        state.selectedForTwinning.includes(d.id)
      );
      const twins = createDigitalTwins(selectedDevices);
      return {
        ...state,
        twins,
        twinCreationComplete: true,
        currentStage: 'Digital -twin-creation',
        metrics: { ...state.metrics, totalTwins: twins.length },
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
  toggleDeviceForTwinning: (id: string) => void;
  selectAllForTwinning: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const setUseCase = useCallback((useCase: UseCase) => dispatch({ type: 'SET_USE_CASE', payload: useCase }), []);
  const setStage = useCallback((stage: SystemStage) => dispatch({ type: 'SET_STAGE', payload: stage }), []);
  const selectDevice = useCallback((id: string | null) => dispatch({ type: 'SELECT_DEVICE', payload: id }), []);
  const selectTwin = useCallback((id: string | null) => dispatch({ type: 'SELECT_TWIN', payload: id }), []);
  const hoverDevice = useCallback((id: string | null) => dispatch({ type: 'HOVER_DEVICE', payload: id }), []);
  const createTwins = useCallback(() => dispatch({ type: 'CREATE_TWINS' }), []);
  const toggleDeviceForTwinning = useCallback((id: string) => dispatch({ type: 'TOGGLE_DEVICE_FOR_TWINNING', payload: id }), []);
  const selectAllForTwinning = useCallback(() => dispatch({ type: 'SELECT_ALL_FOR_TWINNING' }), []);

  const canAccessStage = useCallback((stage: SystemStage): boolean => {
    // Intelligence is always accessible — it's a data/log layer
    if (stage === 'intelligence') return true;

    const stageOrder: SystemStage[] = ['network-discovery', 'Digital -twin-creation', 'synchronization', 'ai-analysis'];
    const targetIndex = stageOrder.indexOf(stage);
    if (targetIndex <= 1) return true;
    return state.twinCreationComplete;
  }, [state.twinCreationComplete]);

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
        toggleDeviceForTwinning,
        selectAllForTwinning,
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
