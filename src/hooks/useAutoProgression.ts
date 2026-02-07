import { useEffect, useRef } from 'react';
import { useDashboard } from '@/context/DashboardContext';

/**
 * Autonomous stage progression hook.
 * 
 * After the user creates digital twins (the ONLY manual action),
 * the system automatically advances through remaining stages:
 *   Twin Creation → Synchronization → Intelligence → Progressive Attacks
 * 
 * This reflects the patent's autonomous cyber-defense architecture
 * where the user is an observer, not an operator.
 */
export function useAutoProgression() {
  const { state, setStage, dispatch } = useDashboard();
  const hasStartedProgression = useRef(false);
  const hasStartedAttacks = useRef(false);
  const attackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stage progression after twin creation
  useEffect(() => {
    if (!state.twinCreationComplete || hasStartedProgression.current) return;
    hasStartedProgression.current = true;

    // Stage 2 → 3: Auto-advance to Synchronization after brief delay
    const syncTimer = setTimeout(() => {
      setStage('synchronization');
    }, 3000);

    // Stage 3 → 4: Auto-advance to Intelligence (AI analysis)
    const intelligenceTimer = setTimeout(() => {
      setStage('intelligence');
    }, 8000);

    return () => {
      clearTimeout(syncTimer);
      clearTimeout(intelligenceTimer);
    };
  }, [state.twinCreationComplete, setStage]);

  // Progressive attack reveal during intelligence stage
  useEffect(() => {
    if (state.currentStage !== 'intelligence' || hasStartedAttacks.current) return;
    hasStartedAttacks.current = true;

    // Start revealing attacks after a brief delay
    const startDelay = setTimeout(() => {
      attackIntervalRef.current = setInterval(() => {
        dispatch({ type: 'REVEAL_NEXT_ATTACK' });
      }, 2000); // One attack every 2 seconds
    }, 1500);

    // Safety cleanup after 30s
    const safetyTimer = setTimeout(() => {
      if (attackIntervalRef.current) {
        clearInterval(attackIntervalRef.current);
        attackIntervalRef.current = null;
      }
    }, 30000);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(safetyTimer);
      if (attackIntervalRef.current) {
        clearInterval(attackIntervalRef.current);
        attackIntervalRef.current = null;
      }
    };
  }, [state.currentStage, dispatch]);

  // Reset refs when use case changes (system reset)
  useEffect(() => {
    if (!state.twinCreationComplete) {
      hasStartedProgression.current = false;
      hasStartedAttacks.current = false;
      if (attackIntervalRef.current) {
        clearInterval(attackIntervalRef.current);
        attackIntervalRef.current = null;
      }
    }
  }, [state.twinCreationComplete]);
}
