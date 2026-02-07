import { useEffect, useRef } from 'react';
import { useDashboard } from '@/context/DashboardContext';

/**
 * Network scanning hook.
 * 
 * When a use case is selected, this hook simulates a network scan
 * that reveals devices one by one with a delay between each.
 * After all devices are discovered, scanning is marked complete
 * and all devices are pre-selected for twinning.
 */
export function useNetworkScanning() {
  const { state, dispatch } = useDashboard();
  const hasStartedScanning = useRef(false);

  useEffect(() => {
    if (!state.useCase || state.scanningComplete || hasStartedScanning.current) return;
    if (state.devices.length === 0) return;

    hasStartedScanning.current = true;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Reveal devices sequentially with delays
    state.devices.forEach((device, index) => {
      timers.push(
        setTimeout(() => {
          dispatch({ type: 'DISCOVER_DEVICE', payload: device.id });
        }, 1500 + index * 1200)
      );
    });

    // Mark scanning complete after all devices revealed
    timers.push(
      setTimeout(() => {
        dispatch({ type: 'SET_SCANNING_COMPLETE' });
      }, 1500 + state.devices.length * 1200 + 800)
    );

    return () => timers.forEach(clearTimeout);
  }, [state.useCase, state.devices.length, state.scanningComplete, dispatch]);

  // Reset when use case changes (user returns to home)
  useEffect(() => {
    if (!state.useCase) {
      hasStartedScanning.current = false;
    }
  }, [state.useCase]);
}
