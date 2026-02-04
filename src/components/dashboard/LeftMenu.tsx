import { Home, Search, Copy, RefreshCw, Brain, Info, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/context/DashboardContext';
import { SystemStage } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: SystemStage | 'home' | 'about';
  label: string;
  icon: React.ElementType;
  stage?: SystemStage;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'network-discovery', label: 'Network Discovery', icon: Search, stage: 'network-discovery' },
  { id: 'digital-twin-creation', label: 'Digital Twin Creation', icon: Copy, stage: 'digital-twin-creation' },
  { id: 'synchronization', label: 'Synchronization & Monitoring', icon: RefreshCw, stage: 'synchronization' },
  { id: 'intelligence', label: 'System Intelligence & Logs', icon: Brain, stage: 'intelligence' },
  { id: 'about', label: 'About', icon: Info },
];

export default function LeftMenu() {
  const navigate = useNavigate();
  const { state, setStage, canAccessStage } = useDashboard();

  const handleMenuClick = (item: MenuItem) => {
    if (item.id === 'home') {
      navigate('/');
      return;
    }
    if (item.id === 'about') {
      navigate('/about');
      return;
    }
    if (item.stage && canAccessStage(item.stage)) {
      setStage(item.stage);
    }
  };

  const getStageNumber = (stage: SystemStage): number => {
    const order: SystemStage[] = ['network-discovery', 'digital-twin-creation', 'synchronization', 'intelligence'];
    return order.indexOf(stage) + 1;
  };

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Logo/Title */}
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-sidebar-foreground">Digital Twin Dashboard</h2>
        <p className="text-xs text-muted-foreground mt-1 capitalize">
          {state.useCase?.replace('-', ' ') || 'Select Use Case'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = item.stage === state.currentStage;
            const isLocked = item.stage && !canAccessStage(item.stage);
            const isNavItem = item.id === 'home' || item.id === 'about';

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  disabled={isLocked}
                  className={cn(
                    'menu-item w-full',
                    isActive && 'menu-item-active',
                    isLocked && 'menu-item-disabled',
                    !isActive && !isLocked && 'hover:bg-sidebar-accent text-sidebar-foreground'
                  )}
                >
                  <div className="relative">
                    <item.icon className={cn(
                      'w-5 h-5',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    {isLocked && (
                      <Lock className="w-3 h-3 absolute -top-1 -right-1 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <span className={cn(
                      'text-sm',
                      isActive ? 'text-primary font-medium' : isLocked ? 'text-muted-foreground' : ''
                    )}>
                      {item.label}
                    </span>
                  </div>

                  {item.stage && (
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono',
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      {getStageNumber(item.stage)}
                    </span>
                  )}
                </button>
                
                {/* Separator after Home */}
                {item.id === 'home' && (
                  <div className="my-3 border-t border-sidebar-border mx-2" />
                )}
                
                {/* Separator before About */}
                {item.id === 'intelligence' && (
                  <div className="my-3 border-t border-sidebar-border mx-2" />
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={cn(
            'w-2 h-2 rounded-full',
            state.twinCreationComplete ? 'bg-success' : 'bg-warning'
          )} />
          <span>
            {state.twinCreationComplete ? 'Twins Active' : 'Awaiting Twin Creation'}
          </span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {state.devices.length} devices • {state.twins.length} twins
        </div>
      </div>
    </aside>
  );
}
