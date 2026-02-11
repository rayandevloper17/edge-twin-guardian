import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import {
  Brain,
  Shield,
  AlertTriangle,
  Clock,
  Activity,
  Server,
  Network,
  FileText,
  ChevronDown,
  ChevronRight,
  Target,
  Zap,
  Globe,
  Lock,
} from 'lucide-react';
import { AttackEvent } from '@/types/dashboard';

interface IntelligenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TabId = 'overview' | 'attacks' | 'logs' | 'ai-decisions';

export default function IntelligenceDialog({ open, onOpenChange }: IntelligenceDialogProps) {
  const { state } = useDashboard();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'attacks', label: 'Attack Records', icon: AlertTriangle },
    { id: 'ai-decisions', label: 'AI Decisions', icon: Brain },
    { id: 'logs', label: 'System Logs', icon: FileText },
  ];

  const criticalAlerts = state.alerts.filter(a => a.severity === 'critical');
  const highAlerts = state.alerts.filter(a => a.severity === 'high');
  const compromisedDevices = state.devices.filter(d => d.status === 'compromised');
  const suspiciousDevices = state.devices.filter(d => d.status === 'suspicious');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden bg-background border-border">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                System Intelligence & Logs
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Full forensic view — attack records, AI decision evidence, and system event logs
              </DialogDescription>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 p-1 bg-muted/50 rounded-xl">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-sm border border-border'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'attacks' && state.attackHistory.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground">
                      {state.attackHistory.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <OverviewTab
              totalDevices={state.devices.length}
              totalTwins={state.twins.length}
              criticalCount={criticalAlerts.length}
              highCount={highAlerts.length}
              compromisedCount={compromisedDevices.length}
              suspiciousCount={suspiciousDevices.length}
              attackHistory={state.attackHistory}
              metrics={state.metrics}
            />
          )}
          {activeTab === 'attacks' && (
            <AttackRecordsTab attacks={state.attackHistory} devices={state.devices} />
          )}
          {activeTab === 'ai-decisions' && (
            <AIDecisionsTab attacks={state.attackHistory} devices={state.devices} />
          )}
          {activeTab === 'logs' && (
            <SystemLogsTab alerts={state.alerts} devices={state.devices} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ==============================
   OVERVIEW TAB
   ============================== */
function OverviewTab({
  totalDevices,
  totalTwins,
  criticalCount,
  highCount,
  compromisedCount,
  suspiciousCount,
  attackHistory,
  metrics,
}: {
  totalDevices: number;
  totalTwins: number;
  criticalCount: number;
  highCount: number;
  compromisedCount: number;
  suspiciousCount: number;
  attackHistory: AttackEvent[];
  metrics: any;
}) {
  const healthyDevices = totalDevices - compromisedCount - suspiciousCount;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          icon={Server}
          label="Physical Devices"
          value={totalDevices}
          subtitle="Discovered"
          color="primary"
        />
        <KPICard
          icon={Network}
          label="Digital Twins"
          value={totalTwins}
          subtitle="Active"
          color="primary"
        />
        <KPICard
          icon={AlertTriangle}
          label="Threats Detected"
          value={attackHistory.length}
          subtitle={`${criticalCount} critical`}
          color="destructive"
        />
        <KPICard
          icon={Shield}
          label="Risk Score"
          value={metrics.overallRiskScore}
          subtitle="/ 100"
          color={metrics.overallRiskScore > 60 ? 'destructive' : metrics.overallRiskScore > 30 ? 'warning' : 'success'}
        />
      </div>

      {/* Device Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Device Health Distribution
          </h3>
          <div className="space-y-3">
            <HealthBar label="Healthy" count={healthyDevices} total={totalDevices} color="success" />
            <HealthBar label="Suspicious" count={suspiciousCount} total={totalDevices} color="warning" />
            <HealthBar label="Compromised" count={compromisedCount} total={totalDevices} color="destructive" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Attack Types Detected
          </h3>
          {attackHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No attacks detected yet</p>
          ) : (
            <div className="space-y-2">
              {attackHistory.map(atk => (
                <div key={atk.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      atk.severity === 'critical' ? 'bg-destructive' :
                      atk.severity === 'high' ? 'bg-warning' : 'bg-accent'
                    )} />
                    <span className="text-sm font-medium text-foreground">{atk.label}</span>
                  </div>
                  <span className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full uppercase font-bold',
                    atk.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                    atk.severity === 'high' ? 'bg-warning/20 text-warning' : 'bg-accent/20 text-accent'
                  )}>
                    {atk.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==============================
   ATTACK RECORDS TAB
   ============================== */
function AttackRecordsTab({ attacks, devices }: { attacks: AttackEvent[]; devices: any[] }) {
  if (attacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <Shield className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Attacks Recorded</h3>
        <p className="text-sm text-muted-foreground max-w-md text-center">
          The AI analysis stage has not yet detected any threats. Attack records will appear here once the system identifies malicious traffic patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {attacks.map(attack => (
        <AttackRecordCard key={attack.id} attack={attack} devices={devices} />
      ))}
    </div>
  );
}

function AttackRecordCard({ attack, devices }: { attack: AttackEvent; devices: any[] }) {
  const [expanded, setExpanded] = useState(false);
  const device = devices.find(d => d.id === attack.targetDeviceId);

  return (
    <div className={cn(
      'rounded-xl border overflow-hidden transition-all',
      attack.severity === 'critical' ? 'border-destructive/40 bg-destructive/5' :
      attack.severity === 'high' ? 'border-warning/40 bg-warning/5' :
      'border-border bg-card'
    )}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-start gap-4 text-left hover:bg-muted/20 transition-colors"
      >
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
          attack.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
          attack.severity === 'high' ? 'bg-warning/20 text-warning' : 'bg-accent/20 text-accent'
        )}>
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-base font-semibold text-foreground">{attack.label}</h4>
            <span className={cn(
              'text-[10px] px-2 py-0.5 rounded-full uppercase font-bold',
              attack.severity === 'critical' ? 'bg-destructive text-destructive-foreground' :
              attack.severity === 'high' ? 'bg-warning text-warning-foreground' : 'bg-accent text-accent-foreground'
            )}>
              {attack.severity}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Confidence: {attack.confidence}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{attack.description}</p>
          {device && (
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {device.name}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {attack.sourceIP}
              </span>
              <span className="font-mono">Port {attack.destinationPort}/{attack.protocol}</span>
            </div>
          )}
        </div>

        {expanded ? (
          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-border/50 animate-fade-in">
          {/* Technical Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
            <DetailBox label="Attack Type" value={attack.attackType.replace('_', ' ').toUpperCase()} />
            <DetailBox label="Source IP" value={attack.sourceIP} mono />
            <DetailBox label="Dest. Port" value={`${attack.destinationPort}`} mono />
            <DetailBox label="Protocol" value={attack.protocol} />
          </div>

          {device && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <DetailBox label="Target Device" value={device.name} />
              <DetailBox label="Device IP" value={device.ipAddress} mono />
              <DetailBox label="MAC Address" value={device.macAddress} mono />
              <DetailBox label="Location" value={device.location} />
            </div>
          )}

          {/* AI Reasoning */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">AI Reasoning</span>
              <span className="ml-auto text-xs font-mono text-primary">
                {attack.confidence}% confidence
              </span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{attack.aiReasoning}</p>
          </div>

          {/* Actions Taken */}
          {attack.actionsTaken.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-foreground">Automated Response Actions</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {attack.actionsTaken.map((action, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-success/5 border border-success/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                    <span className="text-sm text-foreground">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==============================
   AI DECISIONS TAB
   ============================== */
function AIDecisionsTab({ attacks, devices }: { attacks: AttackEvent[]; devices: any[] }) {
  if (attacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <Brain className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No AI Decisions Yet</h3>
        <p className="text-sm text-muted-foreground max-w-md text-center">
          AI decision records will appear here after the system completes traffic analysis during the AI Analysis stage.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {attacks.map((attack, i) => {
        const device = devices.find(d => d.id === attack.targetDeviceId);
        return (
          <div key={attack.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {i + 1}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  Decision: {attack.label} Detection
                </h4>
                <p className="text-xs text-muted-foreground">
                  Target: {device?.name || attack.targetDeviceId} • {device?.ipAddress}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${attack.confidence}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-primary">{attack.confidence}%</span>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 mb-4">
              <p className="text-sm text-foreground/80 leading-relaxed">{attack.aiReasoning}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {attack.actionsTaken.map((action, j) => (
                <span key={j} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {action}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ==============================
   SYSTEM LOGS TAB
   ============================== */
function SystemLogsTab({ alerts, devices }: { alerts: any[]; devices: any[] }) {
  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(date));

  const allLogs = [
    ...alerts.map(a => ({
      time: a.timestamp,
      type: 'alert' as const,
      severity: a.severity,
      message: a.type,
      detail: a.description,
      device: devices.find(d => d.id === a.deviceId)?.name || a.deviceId,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  if (allLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Logs Available</h3>
        <p className="text-sm text-muted-foreground max-w-md text-center">
          System event logs will be recorded here as the system progresses through its lifecycle stages.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Log Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[100px_80px_160px_1fr] gap-0 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50 px-4 py-3 border-b border-border">
          <span>Severity</span>
          <span>Type</span>
          <span>Device</span>
          <span>Event</span>
        </div>
        <div className="divide-y divide-border">
          {allLogs.map((log, i) => (
            <div key={i} className="grid grid-cols-[100px_80px_160px_1fr] gap-0 px-4 py-3 hover:bg-muted/30 transition-colors items-start">
              <span className={cn(
                'text-[10px] px-2 py-0.5 rounded-full uppercase font-bold w-fit',
                log.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                log.severity === 'high' ? 'bg-warning/20 text-warning' :
                log.severity === 'medium' ? 'bg-accent/20 text-accent' :
                'bg-muted text-muted-foreground'
              )}>
                {log.severity}
              </span>
              <span className="text-xs text-muted-foreground">{log.type}</span>
              <span className="text-xs text-foreground font-medium">{log.device}</span>
              <div>
                <span className="text-xs text-foreground">{log.message}</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">{log.detail}</p>
                <span className="text-[10px] text-muted-foreground/70 font-mono mt-1 block">
                  {formatTime(log.time)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==============================
   SHARED UI COMPONENTS
   ============================== */
function KPICard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  subtitle: string;
  color: 'primary' | 'destructive' | 'warning' | 'success';
}) {
  const colorMap = {
    primary: 'text-primary bg-primary/10',
    destructive: 'text-destructive bg-destructive/10',
    warning: 'text-warning bg-warning/10',
    success: 'text-success bg-success/10',
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', colorMap[color])}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-2xl font-bold font-mono text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
      <div className="text-[10px] text-muted-foreground/70">{subtitle}</div>
    </div>
  );
}

function HealthBar({ label, count, total, color }: { label: string; count: number; total: number; color: 'success' | 'warning' | 'destructive' }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const colorMap = {
    success: 'bg-success',
    warning: 'bg-warning',
    destructive: 'bg-destructive',
  };
  const textMap = {
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-24">{label}</span>
      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', colorMap[color])} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn('text-xs font-mono font-bold w-8 text-right', count > 0 ? textMap[color] : 'text-muted-foreground')}>
        {count}
      </span>
    </div>
  );
}

function DetailBox({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 border border-border">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className={cn('text-sm font-medium text-foreground truncate', mono && 'font-mono text-xs')}>{value}</div>
    </div>
  );
}
