import { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import { 
  AlertTriangle, 
  TrendingUp,
  Clock,
  Brain,
  FileText,
  ChevronRight,
  Activity,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type DetailLevel = 'summary' | 'detailed';

export default function IntelligenceDetails() {
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('summary');
  const { state } = useDashboard();
  const { alerts, metrics, devices } = state;

  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const highAlerts = alerts.filter(a => a.severity === 'high');
  const mediumAlerts = alerts.filter(a => a.severity === 'medium');

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Toggle */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setDetailLevel('summary')}
          className={cn(
            'flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
            detailLevel === 'summary' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Summary
        </button>
        <button
          onClick={() => setDetailLevel('detailed')}
          className={cn(
            'flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
            detailLevel === 'detailed' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Detailed
        </button>
      </div>

      {detailLevel === 'summary' ? (
        <SummaryView 
          metrics={metrics}
          criticalCount={criticalAlerts.length}
          highCount={highAlerts.length}
          mediumCount={mediumAlerts.length}
        />
      ) : (
        <DetailedView alerts={alerts} devices={devices} />
      )}
    </div>
  );
}

function SummaryView({ 
  metrics, 
  criticalCount, 
  highCount, 
  mediumCount 
}: { 
  metrics: any;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
}) {
  return (
    <>
      {/* Risk Score */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-card to-muted/30 border border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Overall Risk Score
          </span>
          <Shield className={cn(
            'w-5 h-5',
            metrics.overallRiskScore > 60 ? 'text-destructive' :
            metrics.overallRiskScore > 30 ? 'text-warning' : 'text-success'
          )} />
        </div>
        <div className="flex items-end gap-2">
          <span className={cn(
            'text-4xl font-bold font-mono',
            metrics.overallRiskScore > 60 ? 'text-destructive' :
            metrics.overallRiskScore > 30 ? 'text-warning' : 'text-success'
          )}>
            {metrics.overallRiskScore}
          </span>
          <span className="text-muted-foreground text-sm mb-1">/ 100</span>
        </div>
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full rounded-full transition-all',
              metrics.overallRiskScore > 60 ? 'bg-destructive' :
              metrics.overallRiskScore > 30 ? 'bg-warning' : 'bg-success'
            )}
            style={{ width: `${metrics.overallRiskScore}%` }}
          />
        </div>
      </div>

      {/* Alerts by Severity */}
      <Section title="Alerts by Severity">
        <div className="space-y-2">
          <AlertBar label="Critical" count={criticalCount} color="destructive" />
          <AlertBar label="High" count={highCount} color="warning" />
          <AlertBar label="Medium" count={mediumCount} color="accent" />
        </div>
      </Section>

      {/* Key Metrics */}
      <Section title="Performance Metrics">
        <div className="grid grid-cols-2 gap-3">
          <MetricBox 
            icon={Clock}
            label="MTTD"
            value={`${metrics.mttd}s`}
            description="Mean Time To Detect"
          />
          <MetricBox 
            icon={Activity}
            label="Sync Latency"
            value={`${metrics.avgSyncLatency}ms`}
            description="Average"
          />
        </div>
      </Section>

      {/* Incident Trend */}
      <Section title="Incident Trend (7 Days)">
        <div className="h-20 flex items-end gap-1">
          {metrics.incidentsTrend.map((day: any, i: number) => (
            <div 
              key={i}
              className="flex-1 bg-primary/20 hover:bg-primary/30 transition-colors rounded-t"
              style={{ height: `${(day.count / 10) * 100}%` }}
              title={`${day.count} incidents`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">7 days ago</span>
          <span className="text-[10px] text-muted-foreground">Today</span>
        </div>
      </Section>
    </>
  );
}

function DetailedView({ alerts, devices }: { alerts: any[]; devices: any[] }) {
  return (
    <>
      {/* Alert Timeline */}
      <Section title="Alert Timeline">
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <AlertCard key={alert.id} alert={alert} devices={devices} />
          ))}
          {alerts.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No active alerts
            </p>
          )}
        </div>
      </Section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </h5>
      {children}
    </div>
  );
}

function AlertBar({ 
  label, 
  count, 
  color 
}: { 
  label: string; 
  count: number; 
  color: 'destructive' | 'warning' | 'accent';
}) {
  const maxCount = 5;
  const width = Math.min((count / maxCount) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-16">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full rounded-full transition-all',
            color === 'destructive' ? 'bg-destructive' :
            color === 'warning' ? 'bg-warning' : 'bg-accent'
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className={cn(
        'text-xs font-mono w-6 text-right',
        count > 0 ? (
          color === 'destructive' ? 'text-destructive' :
          color === 'warning' ? 'text-warning' : 'text-accent'
        ) : 'text-muted-foreground'
      )}>
        {count}
      </span>
    </div>
  );
}

function MetricBox({ 
  icon: Icon, 
  label, 
  value, 
  description 
}: { 
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 border border-border">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-lg font-mono font-semibold text-foreground">{value}</div>
      <div className="text-[10px] text-muted-foreground">{description}</div>
    </div>
  );
}

function AlertCard({ alert, devices }: { alert: any; devices: any[] }) {
  const [expanded, setExpanded] = useState(false);
  const device = devices.find(d => d.id === alert.deviceId);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className={cn(
      'rounded-lg border overflow-hidden',
      alert.severity === 'critical' ? 'bg-destructive/5 border-destructive/30' :
      alert.severity === 'high' ? 'bg-destructive/5 border-destructive/20' :
      'bg-muted/50 border-border'
    )}>
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-start gap-3 text-left"
      >
        <AlertTriangle className={cn(
          'w-4 h-4 mt-0.5 shrink-0',
          alert.severity === 'critical' ? 'text-destructive' :
          alert.severity === 'high' ? 'text-destructive/80' : 'text-warning'
        )} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-foreground truncate">
              {alert.type}
            </span>
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded uppercase shrink-0',
              alert.severity === 'critical' ? 'bg-destructive text-destructive-foreground' :
              alert.severity === 'high' ? 'bg-destructive/80 text-destructive-foreground' :
              'bg-warning text-warning-foreground'
            )}>
              {alert.severity}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {alert.description}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatTime(alert.timestamp)}</span>
            {device && (
              <>
                <span>•</span>
                <span>{device.name}</span>
              </>
            )}
          </div>
        </div>
        <ChevronRight className={cn(
          'w-4 h-4 text-muted-foreground transition-transform shrink-0',
          expanded && 'rotate-90'
        )} />
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-0 space-y-3 border-t border-border/50">
          {/* AI Reasoning */}
          {alert.aiReasoning && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Brain className="w-3 h-3" />
                <span>AI Reasoning</span>
              </div>
              <p className="text-xs text-foreground bg-muted/50 p-2 rounded">
                {alert.aiReasoning}
              </p>
            </div>
          )}

          {/* Actions Taken */}
          {alert.actionsTaken.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <FileText className="w-3 h-3" />
                <span>Actions Taken</span>
              </div>
              <ul className="space-y-1">
                {alert.actionsTaken.map((action: string, i: number) => (
                  <li key={i} className="text-xs text-foreground flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-success" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
