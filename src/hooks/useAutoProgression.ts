import { useEffect, useRef } from 'react';
import { useDashboard } from '@/context/DashboardContext';

/**
 * Autonomous stage progression hook.
 * 
 * After the user creates digital twins (the ONLY manual action),
 * the system automatically advances through remaining stages:
 *   Twin Creation → Synchronization → Intelligence
 * 
 * This reflects the patent's autonomous cyber-defense architecture
 * where the user is an observer, not an operator.
 */
export function useAutoProgression() {
  const { state, setStage } = useDashboard();
  const hasStartedProgression = useRef(false);

  useEffect(() => {
    // Only trigger once when twins are first created
    if (!state.twinCreationComplete || hasStartedProgression.current) return;
    hasStartedProgression.current = true;

    // Stage 2 → 3: Auto-advance to Synchronization after brief delay
    const syncTimer = setTimeout(() => {
      setStage('synchronization');
    }, 3000); // 3s to let user observe twin creation

    // Stage 3 → 4: Auto-advance to Intelligence (AI analysis)
    const intelligenceTimer = setTimeout(() => {
      setStage('intelligence');
    }, 8000); // 8s total — 5s of sync observation

    return () => {
      clearTimeout(syncTimer);
      clearTimeout(intelligenceTimer);
    };
  }, [state.twinCreationComplete, setStage]);

  // Reset ref when use case changes (system reset)
  useEffect(() => {
    if (!state.twinCreationComplete) {
      hasStartedProgression.current = false;
    }
  }, [state.twinCreationComplete]);
}
