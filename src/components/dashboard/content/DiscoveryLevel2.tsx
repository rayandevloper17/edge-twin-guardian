import { PhysicalDevice, getStatusLabel } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { 
  Cpu, 
  MapPin, 
  Building, 
  Wifi, 
  Globe, 
  Clock,
  Activity,
  Signal,
  Power
} from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { getTheme } from '@/config/themes';

interface Props {
  device: PhysicalDevice;
}

export default function DiscoveryLevel2({ device }: Props) {
  const { state } = useDashboard();
  const theme = getTheme(state.useCase);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-foreground text-lg">{device.name}</h4>
          <p className="text-xs text-muted-foreground font-mono mt-1">{device.id}</p>
        </div>
        <StatusBadge status={device.status} />
      </div>

      {/* Device Identity & Metadata */}
      <Section title="Device Identity & Metadata" icon={Cpu}>
        <InfoRow label="Device ID / Name" value={device.name} />
        <InfoRow label="Device Type" value={device.deviceType} capitalize />
        <InfoRow label="Manufacturer & Model" value={`${device.manufacturer} ${device.model}`} />
        <InfoRow label="Firmware / OS Version" value={`${device.firmwareVersion} / ${device.osVersion}`} />
        <InfoRow label="Deployment Location" value={device.location} icon={MapPin} />
        <InfoRow label="Owner / Organization" value={device.owner} icon={Building} />
      </Section>

      {/* Connectivity & Network Status */}
      <Section title="Connectivity & Network Status" icon={Wifi}>
        <div className="flex items-center justify-between py-2">
          <span className="text-xs text-muted-foreground">Security Status</span>
          <span className={cn(
            'px-2 py-0.5 rounded-full text-xs font-medium uppercase',
            device.status === 'benign' ? 'bg-success/20 text-success' :
            device.status === 'compromised' ? 'bg-destructive/20 text-destructive' :
            device.status === 'suspicious' ? 'bg-warning/20 text-warning' :
            'bg-muted text-muted-foreground'
          )}>
            {getStatusLabel(device.status, theme.terminology.threatLabel)}
          </span>
        </div>
        <InfoRow label="Last Heartbeat" value={formatDate(device.lastHeartbeat)} icon={Clock} />
        <InfoRow label="Network Type" value={device.networkType} />
        
        {/* Signal Strength */}
        <div className="py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Signal className="w-3 h-3" />
              <span>Signal Strength</span>
            </div>
            <span className="text-xs font-mono text-foreground">{device.signalStrength}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full rounded-full transition-all',
                device.signalStrength > 80 ? 'bg-success' :
                device.signalStrength > 50 ? 'bg-warning' : 'bg-destructive'
              )}
              style={{ width: `${device.signalStrength}%` }}
            />
          </div>
        </div>

        {/* Latency */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="w-3 h-3" />
            <span>Latency</span>
          </div>
          <span className={cn(
            'text-xs font-mono',
            device.latency < 20 ? 'text-success' :
            device.latency < 50 ? 'text-warning' : 'text-destructive'
          )}>
            {device.latency}ms
          </span>
        </div>

        <InfoRow label="IP Address" value={device.ipAddress} mono icon={Globe} />
        <InfoRow label="MAC Address" value={device.macAddress} mono />
      </Section>

      {/* Resource Status */}
      <Section title="Resource Status" icon={Power}>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
            <span className="text-xs text-muted-foreground block mb-1">Power</span>
            <span className="text-lg font-bold text-success">Active</span>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
            <span className="text-xs text-muted-foreground block mb-1">Battery</span>
            <span className="text-lg font-bold text-foreground">N/A</span>
          </div>
        </div>
      </Section>

      {/* Discovery Activity */}
      <Section title="Discovery Activity" icon={Clock}>
        <InfoRow label="First Seen" value={formatDate(new Date(Date.now() - 86400000 * 30))} />
        <InfoRow label="Last Seen" value={formatDate(device.lastHeartbeat)} />
        <InfoRow label="Change History" value="No recent changes" />
      </Section>

      {/* Security Indicators */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Security Indicators
        </h5>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Known Device</span>
            <span className="text-success font-medium">✓ Verified</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Suspicious Behavior</span>
            <span className={cn(
              'font-medium',
              device.status === 'compromised' ? 'text-destructive' :
              device.status === 'suspicious' ? 'text-warning' : 'text-success'
            )}>
              {device.status === 'compromised' ? '⚠ Compromised' :
               device.status === 'suspicious' ? '⚠ Suspicious Activity' : 'None'}
            </span>
          </div>
        </div>
      </div>
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
      <div className="space-y-1 pl-6">{children}</div>
    </div>
  );
}

function InfoRow({ 
  icon: Icon, 
  label, 
  value, 
  mono,
  capitalize 
}: { 
  icon?: React.ElementType; 
  label: string; 
  value: string;
  mono?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {Icon && <Icon className="w-3 h-3" />}
        <span>{label}</span>
      </div>
      <span className={cn(
        'text-xs text-foreground text-right max-w-[50%] truncate',
        mono && 'font-mono',
        capitalize && 'capitalize'
      )}>
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: PhysicalDevice['status'] }) {
  const { state } = useDashboard();
  const theme = getTheme(state.useCase);

  return (
    <span className={cn(
      'px-3 py-1 rounded-full text-xs font-semibold uppercase',
      status === 'benign' && 'bg-success/20 text-success',
      status === 'compromised' && 'bg-destructive/20 text-destructive animate-pulse',
      status === 'suspicious' && 'bg-warning/20 text-warning'
    )}>
      {getStatusLabel(status, theme.terminology.threatLabel)}
    </span>
  );
}
