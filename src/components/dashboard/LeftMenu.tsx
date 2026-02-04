import { Home, Search, Copy, RefreshCw, Brain, Info, Lock, CheckCircle, Shield, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/context/DashboardContext';
import { SystemStage } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { getTheme } from '@/config/themes';

interface StageMenuItem {
  id: SystemStage;
  getLabel: (theme: ReturnType<typeof getTheme>) => string;
  getDescription: (theme: ReturnType<typeof getTheme>) => string;
  icon: React.ElementType;
}

const stageItems: StageMenuItem[] = [
  { 
    id: 'network-discovery', 
    getLabel: (t) => t.terminology.networkDiscovery,
    getDescription: (t) => t.terminology.networkDiscoveryDesc,
    icon: Search,
  },
  { 
    id: 'digital-twin-creation', 
    getLabel: (t) => t.terminology.twinCreation,
    getDescription: (t) => t.terminology.twinCreationDesc,
    icon: Copy,
  },
  { 
    id: 'synchronization', 
    getLabel: (t) => t.terminology.synchronization,
    getDescription: (t) => t.terminology.synchronizationDesc,
    icon: RefreshCw,
  },
  { 
    id: 'intelligence', 
    getLabel: (t) => t.terminology.intelligence,
    getDescription: (t) => t.terminology.intelligenceDesc,
    icon: Brain,
  },
];

export default function LeftMenu() {
  const navigate = useNavigate();
  const { state, setStage, canAccessStage } = useDashboard();
  const theme = getTheme(state.useCase);

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

  // Theme-specific icon
  const ThemeIcon = state.useCase === 'military' ? Shield : Building2;

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header with theme identity */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            state.useCase === 'military' 
              ? "bg-destructive/10 text-destructive" 
              : "bg-primary/10 text-primary"
          )}>
            <ThemeIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-sidebar-foreground">{theme.name}</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {theme.description}
            </p>
          </div>
        </div>
      </div>

      {/* Home Navigation */}
      <div className="px-2 pt-4">
        <button
          onClick={() => navigate('/')}
          className="menu-item w-full hover:bg-sidebar-accent text-sidebar-foreground"
        >
          <Home className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm">Command Center</span>
        </button>
      </div>

      <div className="my-3 mx-4 border-t border-sidebar-border" />

      {/* Stage Machine - Sequential Steps with theme terminology */}
      <nav className="flex-1 px-2">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {theme.terminology.systemStatus}
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
                  
                  {/* Label and description - theme-specific */}
                  <div className="flex-1 text-left min-w-0">
                    <span className={cn(
                      'text-sm block truncate',
                      isActive ? 'text-primary font-medium' : 
                      isLocked ? 'text-muted-foreground' : 'text-sidebar-foreground'
                    )}>
                      {item.getLabel(theme)}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate block">
                      {item.getDescription(theme)}
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

      {/* Device Summary - theme aware */}
      <div className="px-4 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Network Assets
        </p>
        <div className="space-y-1.5">
          {state.devices.map(device => (
            <div 
              key={device.id}
              className="flex items-center gap-2 text-[11px] py-1 px-2 rounded bg-sidebar-accent/30"
            >
              <span className={cn(
                'w-1.5 h-1.5 rounded-full',
                device.status === 'online' ? 'bg-success' :
                device.status === 'attack' ? 'bg-destructive animate-pulse' :
                device.status === 'warning' ? 'bg-warning' : 'bg-muted-foreground'
              )} />
              <span className="text-sidebar-foreground truncate flex-1">{device.name}</span>
              <span className="text-muted-foreground font-mono text-[9px]">{device.ipAddress.split('.').slice(-1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About link */}
      <div className="px-2 pb-2">
        <button
          onClick={() => navigate('/about')}
          className="menu-item w-full hover:bg-sidebar-accent text-sidebar-foreground"
        >
          <Info className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm">About System</span>
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
            {state.twinCreationComplete 
              ? (state.useCase === 'military' ? 'OPERATIONAL' : 'System Active')
              : 'Awaiting Twin Creation'
            }
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
          <div className="text-muted-foreground">
            Physical: <span className="text-foreground font-mono">{state.devices.length}</span>
          </div>
          <div className="text-muted-foreground">
            Twins: <span className="text-foreground font-mono">{state.twins.length}</span>
          </div>
          {state.alerts.filter(a => !a.resolved && a.severity === 'critical').length > 0 && (
            <div className="col-span-2 text-destructive font-semibold">
              ⚠ {state.alerts.filter(a => !a.resolved && a.severity === 'critical').length} Critical {theme.terminology.threatLabel}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
