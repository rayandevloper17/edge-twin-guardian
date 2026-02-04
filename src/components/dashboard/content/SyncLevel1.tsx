import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Activity,
  Shield,
  TrendingUp
} from 'lucide-react';

export default function SyncLevel1() {
  const { state } = useDashboard();
  const { twins, devices, alerts, metrics } = state;

  const healthySync = twins.filter(t => t.driftIndicator < 30).length;
  const delayedSync = twins.filter(t => t.driftIndicator >= 30 && t.driftIndicator < 60).length;
  const disconnectedSync = twins.filter(t => t.driftIndicator >= 60).length;

  const avgLatency = twins.length > 0 
    ? Math.round(twins.reduce((acc, t) => acc + t.syncLatency, 0) / twins.length) 
    : 0;

  const activeAlerts = alerts.filter(a => !a.resolved).length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Synchronization & Monitoring</h3>
        <p className="text-sm text-muted-foreground">Maintain alignment between physical devices and digital twins</p>
      </div>

      {/* Sync Status Overview */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-4 h-4 text-sync" />
            <span className="text-xs text-muted-foreground uppercase font-medium">Sync Status</span>
          </div>
          <span className={cn(
            'text-lg font-bold',
            healthySync === twins.length ? 'text-success' : 
            disconnectedSync > 0 ? 'text-destructive' : 'text-warning'
          )}>
            {healthySync === twins.length ? 'Healthy' : 
             disconnectedSync > 0 ? 'Issues' : 'Delayed'}
          </span>
        </div>
        
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase font-medium">Avg Latency</span>
          </div>
          <span className={cn(
            'text-2xl font-bold',
            avgLatency < 30 ? 'text-success' :
            avgLatency < 60 ? 'text-warning' : 'text-destructive'
          )}>
            {avgLatency}<span className="text-sm font-normal text-muted-foreground">ms</span>
          </span>
        </div>
      </div>

      {/* Data Freshness */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Data Freshness & Drift Detection
        </h4>
        <div className="space-y-2">
          <SyncRow 
            icon={CheckCircle2}
            label="Healthy" 
            count={healthySync} 
            total={twins.length} 
            color="text-success"
            bgColor="bg-success" 
          />
          <SyncRow 
            icon={Clock}
            label="Delayed" 
            count={delayedSync} 
            total={twins.length} 
            color="text-warning"
            bgColor="bg-warning" 
          />
          <SyncRow 
            icon={AlertTriangle}
            label="Disconnected" 
            count={disconnectedSync} 
            total={twins.length} 
            color="text-destructive"
            bgColor="bg-destructive" 
          />
        </div>
      </div>

      {/* Security Posture Summary */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Security Posture Summary
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className={cn(
            'p-4 rounded-xl border',
            criticalAlerts > 0 
              ? 'bg-destructive/10 border-destructive/20' 
              : 'bg-success/10 border-success/20'
          )}>
            <Shield className={cn(
              'w-6 h-6 mb-2',
              criticalAlerts > 0 ? 'text-destructive' : 'text-success'
            )} />
            <span className={cn(
              'text-2xl font-bold block',
              criticalAlerts > 0 ? 'text-destructive' : 'text-success'
            )}>
              {activeAlerts}
            </span>
            <span className="text-xs text-muted-foreground">Active Alerts</span>
          </div>
          
          <div className="p-4 rounded-xl bg-card border border-border">
            <TrendingUp className="w-6 h-6 text-primary mb-2" />
            <span className="text-2xl font-bold text-foreground block">
              {metrics.overallRiskScore}
            </span>
            <span className="text-xs text-muted-foreground">Risk Score</span>
          </div>
        </div>
      </div>

      {/* Active Monitoring */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-sync animate-pulse" />
          <span className="text-sm font-medium text-foreground">Active Monitoring Sessions</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-xl font-bold text-foreground block">{twins.length}</span>
            <span className="text-[10px] text-muted-foreground">Twins</span>
          </div>
          <div>
            <span className="text-xl font-bold text-foreground block">{devices.length}</span>
            <span className="text-[10px] text-muted-foreground">Devices</span>
          </div>
          <div>
            <span className="text-xl font-bold text-success block">{twins.length * 2}</span>
            <span className="text-[10px] text-muted-foreground">Links</span>
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div className="text-center pt-4 border-t border-border/50">
        <p className="text-sm text-sync font-medium">Select a device or twin</p>
        <p className="text-xs text-muted-foreground mt-1">
          View real-time synchronization health and threat status
        </p>
      </div>
    </div>
  );
}

function SyncRow({ 
  icon: Icon,
  label, 
  count, 
  total, 
  color,
  bgColor 
}: { 
  icon: React.ElementType;
  label: string; 
  count: number; 
  total: number; 
  color: string;
  bgColor: string; 
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
      <Icon className={cn('w-4 h-4', color)} />
      <span className="text-sm text-foreground flex-1">{label}</span>
      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all', bgColor)} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
      <span className="text-sm font-mono font-medium text-foreground w-8 text-right">{count}</span>
    </div>
  );
}
