import { Home, Search, Copy, RefreshCw, Brain, Info, Lock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/context/DashboardContext';
import { SystemStage } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface StageMenuItem {
  id: SystemStage;
  label: string;
  icon: React.ElementType;
  description: string;
}

const stageItems: StageMenuItem[] = [
  { 
    id: 'network-discovery', 
    label: 'Network Discovery', 
    icon: Search,
    description: 'Discover physical IoT devices',
  },
  { 
    id: 'digital-twin-creation', 
    label: 'Digital Twin Creation', 
    icon: Copy,
    description: 'Create digital replicas',
  },
  { 
    id: 'synchronization', 
    label: 'Synchronization & Monitoring', 
    icon: RefreshCw,
    description: 'Real-time mirroring & threats',
  },
  { 
    id: 'intelligence', 
    label: 'System Intelligence & Logs', 
    icon: Brain,
    description: 'AI analysis & forensics',
  },
];

export default function LeftMenu() {
  const navigate = useNavigate();
  const { state, setStage, canAccessStage } = useDashboard();

  const handleStageClick = (stage: SystemStage) => {
    if (canAccessStage(stage)) {
      setStage(stage);
    }
  };

  const getStageNumber = (stage: SystemStage): number => {
    return stageItems.findIndex(item => item.id === stage) + 1;
  };

  const isStageComplete = (stage: SystemStage): boolean => {
    const stageOrder: SystemStage[] = ['network-discovery', 'digital-twin-creation', 'synchronization', 'intelligence'];
    const currentIndex = stageOrder.indexOf(state.currentStage);
    const targetIndex = stageOrder.indexOf(stage);
    
    if (stage === 'network-discovery') return state.twinCreationComplete;
    if (stage === 'digital-twin-creation') return state.twinCreationComplete;
    return targetIndex < currentIndex;
  };

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-sidebar-foreground">System State Controller</h2>
        <p className="text-xs text-muted-foreground mt-1 capitalize">
          {state.useCase?.replace('-', ' ') || 'Select Use Case'}
        </p>
      </div>

      {/* Home Navigation */}
      <div className="px-2 pt-4">
        <button
          onClick={() => navigate('/')}
          className="menu-item w-full hover:bg-sidebar-accent text-sidebar-foreground"
        >
          <Home className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm">Home</span>
        </button>
      </div>

      <div className="my-3 mx-4 border-t border-sidebar-border" />

      {/* Stage Machine - Sequential Steps */}
      <nav className="flex-1 px-2">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          System Lifecycle
        </p>
        <ul className="space-y-1">
          {stageItems.map((item) => {
            const isActive = item.id === state.currentStage;
            const isLocked = !canAccessStage(item.id);
            const isComplete = isStageComplete(item.id);

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleStageClick(item.id)}
                  disabled={isLocked}
                  className={cn(
                    'menu-item w-full relative',
                    isActive && 'menu-item-active bg-primary/10',
                    isLocked && 'menu-item-disabled opacity-50 cursor-not-allowed',
                    !isActive && !isLocked && 'hover:bg-sidebar-accent'
                  )}
                >
                  {/* Stage number badge */}
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono shrink-0',
                    isActive ? 'bg-primary text-primary-foreground' : 
                    isComplete ? 'bg-success/20 text-success' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {isComplete && !isActive ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      getStageNumber(item.id)
                    )}
                  </span>
                  
                  {/* Label and description */}
                  <div className="flex-1 text-left min-w-0">
                    <span className={cn(
                      'text-sm block truncate',
                      isActive ? 'text-primary font-medium' : 
                      isLocked ? 'text-muted-foreground' : 'text-sidebar-foreground'
                    )}>
                      {item.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate block">
                      {item.description}
                    </span>
                  </div>

                  {/* Lock indicator */}
                  {isLocked && (
                    <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="my-3 mx-4 border-t border-sidebar-border" />

      {/* About link */}
      <div className="px-2 pb-2">
        <button
          onClick={() => navigate('/about')}
          className="menu-item w-full hover:bg-sidebar-accent text-sidebar-foreground"
        >
          <Info className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm">About</span>
        </button>
      </div>

      {/* System Status */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
        <div className="flex items-center gap-2 text-xs">
          <span className={cn(
            'w-2 h-2 rounded-full',
            state.twinCreationComplete ? 'bg-success animate-pulse' : 'bg-warning'
          )} />
          <span className="text-muted-foreground">
            {state.twinCreationComplete ? 'System Active' : 'Awaiting Twin Creation'}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
          <div className="text-muted-foreground">
            Physical: <span className="text-foreground font-mono">{state.devices.length}</span>
          </div>
          <div className="text-muted-foreground">
            Twins: <span className="text-foreground font-mono">{state.twins.length}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
