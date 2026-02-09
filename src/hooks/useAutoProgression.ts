import { useEffect, useRef } from 'react';
import { useDashboard } from '@/context/DashboardContext';

/**
 * Autonomous stage progression hook.
 * 
 * After the user creates digital twins (the ONLY manual action),
 * the system automatically advances through remaining stages:
 *   Twin Creation → Synchronization → AI Analysis
 * 
 * During AI Analysis, attacks are revealed one at a time with delays.
 * Once a device is flagged, it stays red permanently (persistent detection).
 * Intelligence is NOT part of this flow — it's a user-accessible data layer.
 */
export function useAutoProgression() {
  const { state, dispatch } = useDashboard();
  const hasStartedProgression = useRef(false);
  const hasStartedAttacks = useRef(false);
  const attackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stage progression after twin creation
  useEffect(() => {
    if (!state.twinCreationComplete || hasStartedProgression.current) return;
    hasStartedProgression.current = true;

    // Stage 2 → 3: Auto-advance to Synchronization after brief delay
    const syncTimer = setTimeout(() => {
      dispatch({ type: 'SET_STAGE', payload: 'synchronization' });
    }, 3000);

    // Stage 3 → 4: Auto-advance to AI Analysis
    const aiAnalysisTimer = setTimeout(() => {
      dispatch({ type: 'SET_STAGE', payload: 'ai-analysis' });
    }, 8000);

    return () => {
      clearTimeout(syncTimer);
      clearTimeout(aiAnalysisTimer);
    };
  }, [state.twinCreationComplete, dispatch]);

  // Persistent attack detection during AI Analysis stage
  useEffect(() => {
    if (state.currentStage !== 'ai-analysis' || hasStartedAttacks.current) return;
    if (state.attackPool.length === 0) return;
    hasStartedAttacks.current = true;

    let currentIndex = 0;

    function showNextAttack() {
      if (currentIndex >= state.attackPool.length) return; // All attacks shown, stop

      dispatch({ type: 'SHOW_NEXT_ATTACK' });
      currentIndex++;

      // If more attacks remain, show next after a delay
      if (currentIndex < state.attackPool.length) {
        attackTimeoutRef.current = setTimeout(() => {
          showNextAttack();
        }, 3500); // 3.5s between each attack detection
      }
    }

    // Start the first attack after a brief AI analysis delay
    attackTimeoutRef.current = setTimeout(() => {
      showNextAttack();
    }, 2000);

    return () => {
      if (attackTimeoutRef.current) {
        clearTimeout(attackTimeoutRef.current);
        attackTimeoutRef.current = null;
      }
    };
  }, [state.currentStage, state.attackPool.length, dispatch]);

  // Reset refs when use case changes (system reset)
  useEffect(() => {
    if (!state.twinCreationComplete) {
      hasStartedProgression.current = false;
      hasStartedAttacks.current = false;
      if (attackTimeoutRef.current) {
        clearTimeout(attackTimeoutRef.current);
        attackTimeoutRef.current = null;
      }
    }
  }, [state.twinCreationComplete]);
}
