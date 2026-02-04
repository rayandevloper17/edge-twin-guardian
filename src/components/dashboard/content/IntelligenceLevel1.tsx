import { useDashboard } from '@/context/DashboardContext';
import { getTheme } from '@/config/themes';
import { cn } from '@/lib/utils';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Activity,
  BarChart3
} from 'lucide-react';

export default function IntelligenceLevel1() {
  const { state } = useDashboard();
  const { alerts, metrics } = state;
  const theme = getTheme(state.useCase);

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved);
  const mediumAlerts = alerts.filter(a => a.severity === 'medium' && !a.resolved);
  const lowAlerts = alerts.filter(a => a.severity === 'low' && !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  // Category breakdown
  const alertsByCategory = alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{theme.terminology.intelligence}</h3>
        <p className="text-sm text-muted-foreground">{theme.terminology.intelligenceDesc}</p>
      </div>

      {/* Situational Awareness */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          Situational Awareness
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Detected Incidents */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <AlertTriangle className="w-5 h-5 text-destructive mb-2" />
            <span className="text-2xl font-bold text-foreground block">{alerts.filter(a => !a.resolved).length}</span>
            <span className="text-xs text-muted-foreground">Detected Incidents</span>
          </div>
          
          {/* Risk Score */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <TrendingUp className="w-5 h-5 text-primary mb-2" />
            <span className={cn(
              'text-2xl font-bold block',
              metrics.overallRiskScore > 70 ? 'text-destructive' :
              metrics.overallRiskScore > 40 ? 'text-warning' : 'text-success'
            )}>{metrics.overallRiskScore}</span>
            <span className="text-xs text-muted-foreground">Risk Score</span>
          </div>
          
          {/* AI Insights */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <Brain className="w-5 h-5 text-primary mb-2" />
            <span className="text-2xl font-bold text-foreground block">{Math.round(alerts.length * 0.8)}</span>
            <span className="text-xs text-muted-foreground">AI Insights</span>
          </div>
          
          {/* MTTD */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <Clock className="w-5 h-5 text-primary mb-2" />
            <span className="text-2xl font-bold text-foreground block">{metrics.mttd}<span className="text-sm font-normal">s</span></span>
            <span className="text-xs text-muted-foreground">Mean Time to Detect</span>
          </div>
        </div>
      </div>

      {/* Alerts by Severity */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Alerts by Severity
        </h4>
        <div className="space-y-2">
          <SeverityRow label="Critical" count={criticalAlerts.length} color="bg-destructive" textColor="text-destructive" />
          <SeverityRow label="Medium" count={mediumAlerts.length} color="bg-warning" textColor="text-warning" />
          <SeverityRow label="Low" count={lowAlerts.length} color="bg-primary" textColor="text-primary" />
          <SeverityRow label="Resolved" count={resolvedAlerts.length} color="bg-success" textColor="text-success" />
        </div>
      </div>

      {/* Alerts by Category */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Alerts by Category
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(alertsByCategory).map(([type, count]) => (
            <div key={type} className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <span className="text-xs text-muted-foreground capitalize block mb-1">
                {type.replace('-', ' ')}
              </span>
              <span className="text-lg font-bold text-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trend of Incidents */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Trend of Incidents (Last 7 Days)
        </h4>
        <div className="h-24 flex items-end gap-1">
          {metrics.incidentsTrend.map((item, i) => {
            const maxCount = Math.max(...metrics.incidentsTrend.map(t => t.count));
            return (
              <div 
                key={i} 
                className="flex-1 bg-primary/80 rounded-t transition-all hover:bg-primary"
                style={{ height: `${Math.max(10, (item.count / maxCount) * 100)}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span>7d ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Log Activity */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-foreground">Log Activity</span>
        </div>
        <span className="text-2xl font-bold text-foreground block">{alerts.length * 12}</span>
        <span className="text-xs text-muted-foreground">Events generated today</span>
      </div>

      {/* Instruction */}
      <div className="text-center pt-4 border-t border-border/50">
        <p className="text-sm text-primary font-medium">Full Intelligence View</p>
        <p className="text-xs text-muted-foreground mt-1">
          Detailed forensics and AI analysis available in Level 2
        </p>
      </div>
    </div>
  );
}

function SeverityRow({ 
  label, 
  count, 
  color,
  textColor 
}: { 
  label: string; 
  count: number; 
  color: string;
  textColor: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
      <div className={cn('w-3 h-3 rounded-full', color)} />
      <span className="text-sm text-foreground flex-1">{label}</span>
      <span className={cn('text-lg font-bold', textColor)}>{count}</span>
    </div>
  );
}
