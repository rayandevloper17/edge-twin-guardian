import { useMemo, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { PhysicalDevice, DigitalTwin } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import DeviceIcon from './DeviceIcons';
import { getTheme } from '@/config/themes';

// Physical device node with realistic icon
function PhysicalNode({ 
  device, 
  isSelected, 
  onClick, 
  onHover,
}: {
  device: PhysicalDevice;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hover: boolean) => void;
}) {
  const isAttack = device.status === 'attack';
  const { state } = useDashboard();
  const theme = getTheme(state.useCase);

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
        <ellipse
          cx="0"
          cy="0"
          rx="50"
          ry="35"
          className="fill-destructive/20 attack-pulse"
        />
      )}
      
      {/* Selection ring */}
      {isSelected && (
        <ellipse
          cx="0"
          cy="0"
          rx="46"
          ry="32"
          className="fill-none stroke-primary stroke-2"
          strokeDasharray="4 2"
        />
      )}
      
      {/* URGENT/ALERT badge */}
      {isAttack && (
        <g transform="translate(0, -46)">
          <rect x="-28" y="-8" width="56" height="16" rx="3" className="fill-destructive" />
          <text x="0" y="4" textAnchor="middle" className="fill-white text-[9px] font-bold uppercase">
            {theme.terminology.threatLabel}
          </text>
        </g>
      )}
      
      {/* Device icon */}
      <DeviceIcon 
        type={device.deviceType}
        variant="physical"
        status={device.status}
        size={52}
      />
      
      {/* Labels */}
      <text y="42" textAnchor="middle" className="fill-foreground text-[10px] font-medium">
        {device.name}
      </text>
      <text y="54" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono">
        {device.ipAddress}
      </text>
    </g>
  );
}

// Digital twin node with holographic styling
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
          rx="50"
          ry="35"
          className="fill-destructive/15 attack-pulse"
        />
      )}
      
      {/* Selection ring */}
      {isSelected && (
        <ellipse
          cx="0"
          cy="0"
          rx="46"
          ry="32"
          className="fill-none stroke-primary stroke-2"
          strokeDasharray="4 2"
        />
      )}
      
      {/* Device icon - twin variant */}
      <DeviceIcon 
        type={twin.deviceType}
        variant="twin"
        status={twin.status}
        size={52}
      />
      
      {/* Labels */}
      <text y="42" textAnchor="middle" className="fill-foreground text-[10px] font-medium">
        DT-{physicalDevice.name.split(' ')[0]}
      </text>
      <text y="54" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono">
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
  const theme = getTheme(state.useCase);

  // Apply theme to document
  useEffect(() => {
    if (state.useCase) {
      document.documentElement.setAttribute('data-theme', state.useCase);
    }
  }, [state.useCase]);

  // Stage-driven visibility
  const showPhysicalLayer = true;
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

  // Digital twin connections
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
      {/* Grid background - theme specific */}
      <div 
        className="absolute inset-0 opacity-[var(--grid-opacity,0.08)]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--grid-color, var(--primary)) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--grid-color, var(--primary)) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: theme.visualStyle.gridPattern === 'tactical' ? '40px 40px' : '50px 50px',
        }}
      />
      
      {/* Theme-specific background gradient */}
      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(180deg, transparent 0%, hsl(var(--background)) 98%),
          radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 50%)
        `,
      }} />

      {/* Main SVG canvas */}
      <div className="flex-1 relative">
        <svg className="w-full h-full" viewBox="0 0 500 450" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Gradients for connections */}
            <linearGradient id="physicalLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--physical))" stopOpacity="0.2" />
              <stop offset="50%" stopColor="hsl(var(--physical))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--physical))" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="twinLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--twin))" stopOpacity="0.2" />
              <stop offset="50%" stopColor="hsl(var(--twin))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--twin))" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="attackLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity="0.4" />
              <stop offset="50%" stopColor="hsl(var(--destructive))" stopOpacity="0.95" />
              <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="mirrorLine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--sync))" stopOpacity="0.7" />
              <stop offset="100%" stopColor="hsl(var(--sync))" stopOpacity="0.3" />
            </linearGradient>
            
            {/* Animated flow pattern */}
            <pattern id="flowPattern" patternUnits="userSpaceOnUse" width="20" height="4">
              <rect width="10" height="4" fill="hsl(var(--sync))" opacity="0.8">
                <animate attributeName="x" from="0" to="20" dur="1s" repeatCount="indefinite" />
              </rect>
            </pattern>
          </defs>

          {/* ===== LAYER 1: PHYSICAL NETWORK (TOP) ===== */}
          <g className={cn(isIntelligenceFocus && "opacity-60")}>
            {/* Layer label */}
            <LayerLabel y={35} label="Physical Network" color="fill-physical" />
            
            {/* Physical device connections */}
            {physicalConnections.map(line => (
              <g key={line.key}>
                {/* Main connection line */}
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={line.isAttackPath ? "url(#attackLine)" : "url(#physicalLine)"}
                  strokeWidth={line.isAttackPath ? 3 : 2}
                  className={line.isAttackPath ? "animate-pulse" : ""}
                />
                {/* Traffic indicator dots for attack paths */}
                {line.isAttackPath && (
                  <circle r="3" fill="hsl(var(--destructive))">
                    <animateMotion 
                      dur="1.5s" 
                      repeatCount="indefinite"
                      path={`M${line.x1},${line.y1} L${line.x2},${line.y2}`}
                    />
                  </circle>
                )}
              </g>
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
            <g>
              <line
                x1="40"
                y1="220"
                x2="460"
                y2="220"
                strokeDasharray="8 4"
                className="stroke-border/50"
                strokeWidth="1"
              />
              <text x="250" y="216" textAnchor="middle" className="fill-muted-foreground text-[8px] uppercase tracking-widest">
                Mirror Boundary
              </text>
            </g>
          )}

          {/* ===== LAYER 2: DIGITAL TWIN NETWORK (BOTTOM) ===== */}
          {showDigitalLayer && (
            <g className={cn(isIntelligenceFocus && "opacity-60")}>
              {/* Layer label */}
              <LayerLabel y={255} label="Digital Twin Network" color="fill-twin" />
              
              {/* Twin connections - dashed to differentiate */}
              {twinConnections.map(line => (
                <line
                  key={line.key}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={line.isAttackPath ? "url(#attackLine)" : "url(#twinLine)"}
                  strokeWidth={line.isAttackPath ? 2.5 : 1.5}
                  strokeDasharray="8 4"
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
              {/* Mirroring line with animation */}
              <line
                x1={link.x1}
                y1={link.y1 + 28}
                x2={link.x2}
                y2={link.y2 - 28}
                stroke="url(#mirrorLine)"
                strokeWidth={link.status === 'attack' ? 2.5 : 2}
                strokeDasharray="6 6"
                className={cn(
                  link.status === 'attack' && "stroke-destructive"
                )}
                style={{
                  animation: link.status !== 'attack' ? 'dataFlow 2s linear infinite' : undefined,
                }}
              />
              {/* Sync pulse indicator */}
              <circle 
                r="4" 
                fill={link.status === 'attack' ? "hsl(var(--destructive))" : "hsl(var(--sync))"}
                className={link.status === 'attack' ? "animate-pulse" : ""}
              >
                <animateMotion 
                  dur="2s" 
                  repeatCount="indefinite"
                  path={`M${link.x1},${link.y1 + 28} L${link.x2},${link.y2 - 28}`}
                />
              </circle>
              {/* Sync latency indicator */}
              <text
                x={(link.x1 + link.x2) / 2 + 12}
                y={(link.y1 + link.y2) / 2}
                className="fill-sync/80 text-[8px] font-mono"
              >
                {link.syncLatency}ms
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Stage indicator */}
      <div className="border-t border-border/30 bg-card/30 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center justify-center gap-6">
          {[
            { id: 'network-discovery', label: theme.terminology.networkDiscovery.split(' ')[0] },
            { id: 'digital-twin-creation', label: 'Mirroring' },
            { id: 'synchronization', label: 'Sync' },
            { id: 'intelligence', label: theme.terminology.intelligence.split(' ')[0] },
          ].map((stage, index, arr) => (
            <div key={stage.id} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all",
                  currentStage === stage.id ? 'bg-primary shadow-lg shadow-primary/50' : 'bg-muted-foreground/30'
                )} />
                <span className={cn(
                  "text-xs font-medium transition-colors",
                  currentStage === stage.id ? 'text-primary' : 'text-muted-foreground/50'
                )}>
                  {stage.label}
                </span>
              </div>
              {index < arr.length - 1 && (
                <span className="text-muted-foreground/30">→</span>
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
            className="gap-2 bg-primary/90 hover:bg-primary shadow-lg shadow-primary/30"
          >
            <ArrowRight className="w-4 h-4" />
            {theme.terminology.twinCreation}
          </Button>
        </div>
      )}

      {currentStage === 'digital-twin-creation' && state.twinCreationComplete && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
          <Button 
            onClick={handleContinueToSync}
            className="gap-2 bg-primary/90 hover:bg-primary shadow-lg shadow-primary/30"
          >
            <ArrowRight className="w-4 h-4" />
            {theme.terminology.synchronization}
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
  const theme = getTheme(state.useCase);

  if (!device) return null;

  return (
    <div
      className="absolute pointer-events-none z-50 animate-fade-in"
      style={{
        left: Math.min(device.position.x + 80, 350),
        top: device.position.y,
      }}
    >
      <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-3 min-w-48">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            'w-2.5 h-2.5 rounded-full',
            device.status === 'online' ? 'bg-success' :
            device.status === 'attack' ? 'bg-destructive animate-pulse' :
            device.status === 'warning' ? 'bg-warning' : 'bg-muted-foreground'
          )} />
          <span className="text-xs font-semibold uppercase tracking-wide">{device.status}</span>
          {device.status === 'attack' && (
            <span className="text-[9px] font-bold text-destructive ml-auto uppercase">
              {theme.terminology.threatLabel}
            </span>
          )}
        </div>
        
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium">{device.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Network:</span>
            <span className="font-mono text-[10px]">{device.networkType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Latency:</span>
            <span className="font-mono">{device.latency}ms</span>
          </div>
          {twin && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Twin Drift:</span>
              <span className={cn(
                "font-mono",
                twin.driftIndicator > 50 ? 'text-destructive' : 'text-success'
              )}>
                {twin.driftIndicator.toFixed(1)}%
              </span>
            </div>
          )}
          {device.status === 'attack' && (
            <div className="mt-2 pt-2 border-t border-destructive/30 flex items-center gap-1">
              <span className="text-destructive font-semibold">⚠ Active Threat Detected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
