import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import {
  FileText,
  Brain,
  Link2,
  Clock,
  CheckCircle2,
  User,
  Server
} from 'lucide-react';

export default function IntelligenceLevel2() {
  const { state } = useDashboard();
  const { alerts, devices, twins } = state;

  const recentAlerts = [...alerts]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h4 className="font-semibold text-foreground text-lg">Intelligence & Forensics</h4>
        <p className="text-xs text-muted-foreground mt-1">Deep intelligence & explainability</p>
      </div>

      {/* Event Logs */}
      <Section title="Event Logs" icon={FileText}>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                'p-3 rounded-lg border',
                alert.severity === 'critical'
                  ? 'bg-destructive/10 border-destructive/30'
                  : alert.severity === 'medium'
                    ? 'bg-warning/10 border-warning/30'
                    : 'bg-muted/30 border-border/50'
              )}
            >
              <div className="flex items-start justify-between mb-1">
                <span className={cn(
                  'text-xs font-semibold uppercase',
                  alert.severity === 'critical' ? 'text-destructive' :
                    alert.severity === 'medium' ? 'text-warning' : 'text-primary'
                )}>
                  {alert.type.replace('-', ' ')}
                </span>
                <span className="text-[10px] text-muted-foreground">{formatDate(alert.timestamp)}</span>
              </div>
              <p className="text-xs text-foreground">{alert.description}</p>
              {alert.resolved && (
                <div className="flex items-center gap-1 mt-2 text-[10px] text-success">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Resolved</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* AI Analysis */}
      <Section title="AI Analysis" icon={Brain}>
        <div className="space-y-3">
          {/* Attack Patterns */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <span className="text-xs text-muted-foreground block mb-2">Detected Attack Patterns</span>
            <div className="flex flex-wrap gap-2">
              {['DDoS Attempt', 'Port Scanning', 'Data Exfiltration'].map((pattern, i) => (
                <span
                  key={i}
                  className={cn(
                    'px-2 py-1 rounded text-[10px] font-medium',
                    i === 0 ? 'bg-destructive/20 text-destructive' :
                      i === 1 ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
                  )}
                >
                  {pattern}
                </span>
              ))}
            </div>
          </div>

          {/* Confidence Level */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
            <span className="text-xs text-muted-foreground">AI Confidence Level</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: '87%' }} />
              </div>
              <span className="text-xs font-mono text-foreground">87%</span>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-xs text-muted-foreground block mb-2">Recommended Actions</span>
            <ul className="space-y-1 text-xs text-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                Isolate affected devices from network
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                Update firewall rules for suspicious IPs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                Enable enhanced logging on gateway devices
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Correlation */}
      <Section title="Correlation" icon={Link2}>
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <span className="text-xs text-muted-foreground block mb-2">Related Devices</span>
            <div className="flex flex-wrap gap-1">
              {devices.filter(d => d.status === 'attack' || d.status === 'warning').slice(0, 3).map(device => (
                <span key={device.id} className="px-2 py-1 rounded text-[10px] bg-destructive/10 text-destructive">
                  {device.name}
                </span>
              ))}
              {devices.filter(d => d.status === 'attack' || d.status === 'warning').length === 0 && (
                <span className="text-xs text-muted-foreground">No affected devices</span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <span className="text-xs text-muted-foreground block mb-2">Associated Digital  Twins</span>
            <div className="flex flex-wrap gap-1">
              {twins.filter(t => t.status === 'attack' || t.status === 'warning').slice(0, 3).map(twin => (
                <span key={twin.id} className="px-2 py-1 rounded text-[10px] bg-warning/10 text-warning">
                  DT-{twin.id.split('-')[1]}
                </span>
              ))}
              {twins.filter(t => t.status === 'attack' || t.status === 'warning').length === 0 && (
                <span className="text-xs text-muted-foreground">No affected twins</span>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <span className="text-xs text-muted-foreground block mb-2">Event Timeline</span>
            <div className="space-y-2">
              {recentAlerts.slice(0, 3).map((alert, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px]">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{formatDate(alert.timestamp)}</span>
                  <span className="text-foreground flex-1 truncate">{alert.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Audit & Compliance */}
      <Section title="Audit & Compliance" icon={FileText}>
        <div className="space-y-2">
          <AuditRow
            icon={User}
            label="User Actions"
            value={`${Math.floor(Math.random() * 20) + 5} today`}
          />
          <AuditRow
            icon={Server}
            label="System Decisions"
            value={`${alerts.length} automated`}
          />
          <AuditRow
            icon={FileText}
            label="Historical Records"
            value="30 days retained"
          />
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-primary" />
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h5>
      </div>
      <div className="pl-6">{children}</div>
    </div>
  );
}

function AuditRow({
  icon: Icon,
  label,
  value
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-muted/30">
      <div className="flex items-center gap-2">
        <Icon className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="text-xs font-mono text-foreground">{value}</span>
    </div>
  );
}
