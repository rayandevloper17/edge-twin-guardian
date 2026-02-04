import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { PhysicalDevice, DigitalTwin } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Physical device node - solid rectangle
function PhysicalNode({ 
  device, 
  isSelected, 
  onClick, 
  onHover,
  showLabel = true,
}: {
  device: PhysicalDevice;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hover: boolean) => void;
  showLabel?: boolean;
}) {
  const isAttack = device.status === 'attack';
  const isWarning = device.status === 'warning';

  return (
    <g
      className="cursor-pointer transition-transform"
      transform={`translate(${device.position.x}, ${device.position.y})`}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Attack glow effect */}
      {isAttack && (
        <rect
          x="-42"
          y="-27"
          width="84"
          height="54"
          rx="8"
          className="fill-destructive/30 attack-pulse"
        />
      )}
      
      {/* URGENT badge */}
      {isAttack && (
        <g transform="translate(0, -42)">
          <rect x="-28" y="-8" width="56" height="16" rx="3" className="fill-destructive" />
          <text x="0" y="4" textAnchor="middle" className="fill-white text-[9px] font-bold uppercase">
            URGENT
          </text>
        </g>
      )}
      
      {/* Main device box */}
      <rect
        x="-36"
        y="-22"
        width="72"
        height="44"
        rx="4"
        className={cn(
          'transition-all duration-200 stroke-2',
          isAttack 
            ? 'fill-destructive/20 stroke-destructive' 
            : isWarning
            ? 'fill-warning/10 stroke-warning'
            : 'fill-physical/15 stroke-physical',
          isSelected && 'stroke-[3] stroke-primary'
        )}
      />
      
      {/* Inner detail */}
      <rect
        x="-24"
        y="-12"
        width="48"
        height="24"
        rx="2"
        className={cn(
          "fill-none stroke-1",
          isAttack ? "stroke-destructive/40" : "stroke-physical/30"
        )}
      />
      
      {/* Status indicator */}
      <circle
        cx="28"
        cy="-14"
        r="4"
        className={cn(
          device.status === 'online' ? 'fill-success' :
          device.status === 'attack' ? 'fill-destructive animate-pulse' :
          device.status === 'warning' ? 'fill-warning' : 'fill-muted-foreground'
        )}
      />
      
      {/* Labels */}
      {showLabel && (
        <>
          <text y="36" textAnchor="middle" className="fill-foreground text-[10px] font-medium">
            {device.name}
          </text>
          <text y="48" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono">
            {device.ipAddress}
          </text>
        </>
      )}
    </g>
  );
}

// Digital twin node - dashed circle/ellipse to differentiate
function TwinNode({ 
  twin, 
  physicalDevice,
  isSelected, 
  onClick, 
  onHover 
}: {
  twin: DigitalTwin;
  physicalDevice: PhysicalDevice;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hover: boolean) => void;
}) {
  const isAttack = twin.status === 'attack';

  return (
    <g
      className="cursor-pointer"
      transform={`translate(${twin.position.x}, ${twin.position.y})`}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Attack glow */}
      {isAttack && (
        <ellipse
          cx="0"
          cy="0"
          rx="42"
          ry="28"
          className="fill-destructive/25 attack-pulse"
        />
      )}
      
      {/* Main twin shape - ellipse with dashed border */}
      <ellipse
        cx="0"
        cy="0"
        rx="36"
        ry="22"
        strokeDasharray="6 3"
        className={cn(
          'transition-all duration-200 stroke-2',
          isAttack 
            ? 'fill-destructive/15 stroke-destructive' 
            : 'fill-twin/15 stroke-twin',
          isSelected && 'stroke-[3] stroke-primary'
        )}
      />
      
      {/* Inner pattern */}
      <ellipse
        cx="0"
        cy="0"
        rx="22"
        ry="12"
        strokeDasharray="4 2"
        className="fill-none stroke-twin/30 stroke-1"
      />
      
      {/* Labels */}
      <text y="36" textAnchor="middle" className="fill-foreground text-[10px] font-medium">
        DT-{physicalDevice.name.split(' ')[0]}
      </text>
      <text y="48" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono">
        {physicalDevice.ipAddress}
      </text>
    </g>
  );
}

// Layer separator label
function LayerLabel({ y, label, color }: { y: number; label: string; color: string }) {
  return (
    <g transform={`translate(30, ${y})`}>
      <line x1="0" y1="0" x2="16" y2="0" className={`stroke-2 ${color}`} />
      <text x="24" y="4" className={`text-[11px] font-semibold uppercase tracking-wider ${color}`}>
        {label}
      </text>
    </g>
  );
}

export default function NetworkGraph() {
  const { state, selectDevice, selectTwin, hoverDevice, createTwins, setStage } = useDashboard();
  const { devices, twins, currentStage, selectedDeviceId, selectedTwinId, hoveredDeviceId } = state;

  // Stage-driven visibility
  const showPhysicalLayer = true; // Always visible
  const showDigitalLayer = currentStage !== 'network-discovery' && state.twinCreationComplete;
  const showMirroringLinks = showDigitalLayer && (currentStage === 'synchronization' || currentStage === 'intelligence');
  const isIntelligenceFocus = currentStage === 'intelligence';

  // Physical network connections (device-to-device)
  const physicalConnections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; key: string; isAttackPath: boolean }[] = [];
    const processed = new Set<string>();

    devices.forEach(device => {
      device.connections.forEach(connId => {
        const connKey = [device.id, connId].sort().join('-');
        if (!processed.has(connKey)) {
          const connDevice = devices.find(d => d.id === connId);
          if (connDevice) {
            const isAttackPath = device.status === 'attack' || connDevice.status === 'attack';
            lines.push({
              x1: device.position.x,
              y1: device.position.y,
              x2: connDevice.position.x,
              y2: connDevice.position.y,
              key: connKey,
              isAttackPath,
            });
            processed.add(connKey);
          }
        }
      });
    });

    return lines;
  }, [devices]);

  // Digital twin connections (twin-to-twin, mirroring physical topology)
  const twinConnections = useMemo(() => {
    if (!showDigitalLayer) return [];
    
    const lines: { x1: number; y1: number; x2: number; y2: number; key: string; isAttackPath: boolean }[] = [];
    const processed = new Set<string>();

    twins.forEach(twin => {
      const physicalDevice = devices.find(d => d.id === twin.physicalDeviceId);
      if (!physicalDevice) return;

      physicalDevice.connections.forEach(connId => {
        const connTwin = twins.find(t => t.physicalDeviceId === connId);
        if (!connTwin) return;

        const connKey = [twin.id, connTwin.id].sort().join('-');
        if (!processed.has(connKey)) {
          const isAttackPath = twin.status === 'attack' || connTwin.status === 'attack';
          lines.push({
            x1: twin.position.x,
            y1: twin.position.y,
            x2: connTwin.position.x,
            y2: connTwin.position.y,
            key: connKey,
            isAttackPath,
          });
          processed.add(connKey);
        }
      });
    });

    return lines;
  }, [twins, devices, showDigitalLayer]);

  // Mirroring links (physical to digital - vertical)
  const mirroringLinks = useMemo(() => {
    if (!showMirroringLinks) return [];
    
    return twins.map(twin => {
      const physical = devices.find(d => d.id === twin.physicalDeviceId);
      if (!physical) return null;
      return {
        x1: physical.position.x,
        y1: physical.position.y,
        x2: twin.position.x,
        y2: twin.position.y,
        key: `mirror-${twin.id}`,
        status: twin.status,
        syncLatency: twin.syncLatency,
      };
    }).filter(Boolean);
  }, [twins, devices, showMirroringLinks]);

  const handleCreateTwins = () => {
    createTwins();
  };

  const handleContinueToSync = () => {
    setStage('synchronization');
  };

  // Check if any device is under attack for system-level visual
  const hasActiveAttack = devices.some(d => d.status === 'attack');

  return (
    <div className={cn(
      "flex-1 flex flex-col relative overflow-hidden transition-colors duration-500",
      hasActiveAttack && currentStage === 'synchronization' && "bg-destructive/5"
    )}>
      {/* Grid background */}
      <div className="absolute inset-0 grid-overlay opacity-15" />
      
      {/* Perspective grid */}
      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(180deg, transparent 0%, hsl(var(--background)) 98%),
          linear-gradient(90deg, hsl(var(--primary) / 0.02) 1px, transparent 1px),
          linear-gradient(hsl(var(--primary) / 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 30px 30px, 30px 30px',
      }} />

      {/* Main SVG canvas */}
      <div className="flex-1 relative">
        <svg className="w-full h-full" viewBox="0 0 500 420" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Gradients for connections */}
            <linearGradient id="physicalLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--physical))" stopOpacity="0.2" />
              <stop offset="50%" stopColor="hsl(var(--physical))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(var(--physical))" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="twinLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--twin))" stopOpacity="0.2" />
              <stop offset="50%" stopColor="hsl(var(--twin))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(var(--twin))" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="attackLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity="0.4" />
              <stop offset="50%" stopColor="hsl(var(--destructive))" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="mirrorLine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--sync))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--sync))" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* ===== LAYER 1: PHYSICAL NETWORK (TOP) ===== */}
          <g className={cn(isIntelligenceFocus && "opacity-60")}>
            {/* Layer label */}
            <LayerLabel y={30} label="Physical Layer" color="text-physical" />
            
            {/* Physical device connections */}
            {physicalConnections.map(line => (
              <line
                key={line.key}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={line.isAttackPath ? "url(#attackLine)" : "url(#physicalLine)"}
                strokeWidth={line.isAttackPath ? 2.5 : 1.5}
                className={line.isAttackPath ? "animate-pulse" : ""}
              />
            ))}

            {/* Physical devices */}
            {devices.map(device => (
              <PhysicalNode
                key={device.id}
                device={device}
                isSelected={selectedDeviceId === device.id}
                onClick={() => selectDevice(device.id)}
                onHover={(hover) => hoverDevice(hover ? device.id : null)}
              />
            ))}
          </g>

          {/* ===== LAYER SEPARATOR ===== */}
          {showDigitalLayer && (
            <line
              x1="40"
              y1="200"
              x2="460"
              y2="200"
              strokeDasharray="8 4"
              className="stroke-border/40"
            />
          )}

          {/* ===== LAYER 2: DIGITAL TWIN NETWORK (BOTTOM) ===== */}
          {showDigitalLayer && (
            <g className={cn(isIntelligenceFocus && "opacity-60")}>
              {/* Layer label */}
              <LayerLabel y={230} label="Digital Twin Layer" color="text-twin" />
              
              {/* Twin connections */}
              {twinConnections.map(line => (
                <line
                  key={line.key}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={line.isAttackPath ? "url(#attackLine)" : "url(#twinLine)"}
                  strokeWidth={line.isAttackPath ? 2 : 1.5}
                  strokeDasharray="6 3"
                  className={line.isAttackPath ? "animate-pulse" : ""}
                />
              ))}

              {/* Digital twins */}
              {twins.map(twin => {
                const physicalDevice = devices.find(d => d.id === twin.physicalDeviceId);
                if (!physicalDevice) return null;
                return (
                  <TwinNode
                    key={twin.id}
                    twin={twin}
                    physicalDevice={physicalDevice}
                    isSelected={selectedTwinId === twin.id}
                    onClick={() => selectTwin(twin.id)}
                    onHover={(hover) => hoverDevice(hover ? twin.physicalDeviceId : null)}
                  />
                );
              })}
            </g>
          )}

          {/* ===== LAYER 3: MIRRORING LINKS (VERTICAL) ===== */}
          {mirroringLinks.map(link => link && (
            <g key={link.key}>
              <line
                x1={link.x1}
                y1={link.y1 + 22}
                x2={link.x2}
                y2={link.y2 - 22}
                stroke="url(#mirrorLine)"
                strokeWidth={link.status === 'attack' ? 2 : 1.5}
                strokeDasharray="4 4"
                className={cn(
                  link.status === 'attack' && "stroke-destructive"
                )}
                style={{
                  animation: link.status !== 'attack' ? 'dataFlow 2s linear infinite' : undefined,
                }}
              />
              {/* Sync latency indicator */}
              <text
                x={link.x1 + 8}
                y={(link.y1 + link.y2) / 2}
                className="fill-sync/70 text-[7px] font-mono"
              >
                {link.syncLatency}ms
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Stage indicator */}
      <div className="border-t border-border/30 bg-card/20 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center justify-center gap-6">
          {[
            { id: 'network-discovery', label: 'Discovery' },
            { id: 'digital-twin-creation', label: 'Mirroring' },
            { id: 'synchronization', label: 'Sync & Threat' },
            { id: 'intelligence', label: 'Intelligence' },
          ].map((stage, index, arr) => (
            <div key={stage.id} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  currentStage === stage.id ? 'bg-primary' : 'bg-muted-foreground/30'
                )} />
                <span className={cn(
                  "text-xs font-medium transition-colors",
                  currentStage === stage.id ? 'text-primary' : 'text-muted-foreground/50'
                )}>
                  {stage.label}
                </span>
              </div>
              {index < arr.length - 1 && (
                <span className="text-muted-foreground/20">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons based on stage */}
      {currentStage === 'network-discovery' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
          <Button 
            onClick={handleCreateTwins}
            className="gap-2 bg-primary/90 hover:bg-primary shadow-lg"
          >
            <ArrowRight className="w-4 h-4" />
            Create Digital Twin Network
          </Button>
        </div>
      )}

      {currentStage === 'digital-twin-creation' && state.twinCreationComplete && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
          <Button 
            onClick={handleContinueToSync}
            className="gap-2 bg-primary/90 hover:bg-primary shadow-lg"
          >
            <ArrowRight className="w-4 h-4" />
            Continue to Synchronization
          </Button>
        </div>
      )}

      {/* Hover tooltip */}
      {hoveredDeviceId && <HoverTooltip deviceId={hoveredDeviceId} />}
    </div>
  );
}

function HoverTooltip({ deviceId }: { deviceId: string }) {
  const { state } = useDashboard();
  const device = state.devices.find(d => d.id === deviceId);
  const twin = state.twins.find(t => t.physicalDeviceId === deviceId);

  if (!device) return null;

  return (
    <div
      className="absolute pointer-events-none z-50 animate-fade-in"
      style={{
        left: Math.min(device.position.x + 80, 350),
        top: device.position.y,
      }}
    >
      <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-3 min-w-44">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            'w-2 h-2 rounded-full',
            device.status === 'online' ? 'bg-success' :
            device.status === 'attack' ? 'bg-destructive animate-pulse' :
            device.status === 'warning' ? 'bg-warning' : 'bg-muted-foreground'
          )} />
          <span className="text-xs font-medium capitalize">{device.status}</span>
        </div>
        
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Health:</span>
            <span className={cn(
              "font-mono",
              device.status === 'attack' ? 'text-destructive' : 
              device.status === 'warning' ? 'text-warning' : 'text-success'
            )}>
              {device.status === 'attack' ? 'Critical' : device.status === 'warning' ? 'Degraded' : 'Good'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Latency:</span>
            <span className="font-mono">{device.latency}ms</span>
          </div>
          {twin && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Drift:</span>
              <span className={cn(
                "font-mono",
                twin.driftIndicator > 50 ? 'text-destructive' : 'text-success'
              )}>
                {twin.driftIndicator.toFixed(1)}%
              </span>
            </div>
          )}
          {device.status === 'attack' && (
            <div className="mt-2 pt-2 border-t border-destructive/30">
              <span className="text-destructive font-semibold">⚠ Active Threat</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
