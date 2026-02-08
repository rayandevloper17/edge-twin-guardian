import { useEffect, useRef } from 'react';
import { useDashboard } from '@/context/DashboardContext';

/**
 * Autonomous stage progression hook.
 * 
 * After the user creates digital twins (the ONLY manual action),
 * the system automatically advances through remaining stages:
 *   Twin Creation → Synchronization → Intelligence → Cycling Attack Simulation
 * 
 * Attacks appear one at a time, linger for a few seconds, then fade.
 * The cycle repeats continuously, simulating real-time edge defense.
 */
export function useAutoProgression() {
  const { state, setStage, dispatch } = useDashboard();
  const hasStartedProgression = useRef(false);
  const hasStartedAttacks = useRef(false);
  const attackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isShowingAttack = useRef(false);

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

  // Cycling attack simulation during intelligence stage
  useEffect(() => {
    if (state.currentStage !== 'intelligence' || hasStartedAttacks.current) return;
    if (state.attackPool.length === 0) return;
    hasStartedAttacks.current = true;

    function runAttackCycle() {
      // Show next attack
      isShowingAttack.current = true;
      dispatch({ type: 'SHOW_NEXT_ATTACK' });

      // After 3-4 seconds, hide the attack
      attackTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'HIDE_ACTIVE_ATTACK' });
        isShowingAttack.current = false;

        // Brief pause (1-2 seconds) then show next attack
        attackTimeoutRef.current = setTimeout(() => {
          runAttackCycle();
        }, 1500);
      }, 3500);
    }

    // Start the first attack after a brief AI analysis delay
    attackTimeoutRef.current = setTimeout(() => {
      runAttackCycle();
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
      isShowingAttack.current = false;
      if (attackTimeoutRef.current) {
        clearTimeout(attackTimeoutRef.current);
        attackTimeoutRef.current = null;
      }
    }
  }, [state.twinCreationComplete]);
}
