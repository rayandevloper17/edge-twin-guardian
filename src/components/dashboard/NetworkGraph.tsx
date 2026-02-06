import { useMemo, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { PhysicalDevice, DigitalTwin } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wifi, Radio, Camera, Cpu, Server } from 'lucide-react';
import { getTheme } from '@/config/themes';

// Modern device node component
function DeviceNode({
  device,
  isSelected,
  onClick,
  onHover,
  variant = 'physical'
}: {
  device: PhysicalDevice;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hover: boolean) => void;
  variant?: 'physical' | 'twin';
}) {
  const { state } = useDashboard();
  const theme = getTheme(state.useCase);
  const isAttack = device.status === 'compromised';
  const isTwin = variant === 'twin';

  // Get icon based on device type
  const getDeviceIcon = () => {
    const iconClass = cn(
      "w-6 h-6",
      isTwin ? "stroke-[1.5]" : "stroke-2"
    );

    switch (device.deviceType) {
      case 'radar': return <Radio className={iconClass} />;
      case 'camera': return <Camera className={iconClass} />;
      case 'sensor': return <Wifi className={iconClass} />;
      case 'gateway': return <Server className={iconClass} />;
      default: return <Cpu className={iconClass} />;
    }
  };

  return (
    <g
      className="cursor-pointer"
      transform={`translate(${device.position.x}, ${device.position.y})`}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Selection/Attack glow */}
      {(isSelected || isAttack) && (
        <circle
          cx="0"
          cy="0"
          r="42"
          className={cn(
            "transition-all duration-300",
            isAttack ? "fill-destructive/20" : "fill-primary/15"
          )}
          style={isAttack ? { animation: 'pulse 2s ease-in-out infinite' } : undefined}
        />
      )}

      {/* Outer ring for selection */}
      {isSelected && (
        <circle
          cx="0"
          cy="0"
          r="38"
          className="fill-none stroke-primary/60 stroke-[1.5]"
          strokeDasharray={isTwin ? "4 4" : "none"}
        />
      )}

      {/* Main device hexagon/circle container */}
      <g className="transition-transform duration-200 hover:scale-105">
        {/* Background shape */}
        {isTwin ? (
          // Twin: Dashed circle with glow
          <>
            <circle
              cx="0"
              cy="0"
              r="32"
              className={cn(
                "fill-background/80 transition-colors",
                isAttack ? "stroke-destructive" : "stroke-twin"
              )}
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            {/* Inner glow */}
            <circle
              cx="0"
              cy="0"
              r="26"
              className={cn(
                "fill-none",
                isAttack ? "stroke-destructive/30" : "stroke-twin/20"
              )}
              strokeWidth="8"
            />
          </>
        ) : (
          // Physical: Solid hexagonal shape
          <>
            <polygon
              points="0,-34 30,-17 30,17 0,34 -30,17 -30,-17"
              className={cn(
                "transition-colors",
                isAttack ? "fill-destructive/20 stroke-destructive" : "fill-card stroke-physical"
              )}
              strokeWidth="2"
            />
            {/* Inner shape */}
            <polygon
              points="0,-26 23,-13 23,13 0,26 -23,13 -23,-13"
              className={cn(
                "fill-none",
                isAttack ? "stroke-destructive/40" : "stroke-physical/30"
              )}
              strokeWidth="1"
            />
          </>
        )}

        {/* Icon */}
        <foreignObject x="-12" y="-12" width="24" height="24">
          <div className={cn(
            "w-full h-full flex items-center justify-center",
            isAttack ? "text-destructive" : isTwin ? "text-twin" : "text-physical"
          )}>
            {getDeviceIcon()}
          </div>
        </foreignObject>
      </g>

      {/* Alert badge */}
      {isAttack && (
        <g transform="translate(0, -46)">
          <rect
            x="-36" y="-10" width="72" height="20" rx="10"
            className="fill-destructive shadow-lg"
          />
          <text
            x="0" y="4"
            textAnchor="middle"
            className="fill-white text-[8px] font-bold tracking-wide"
          >
            COMPROMISED
          </text>
        </g>
      )}

      {/* Device name */}
      <text
        y="50"
        textAnchor="middle"
        className="fill-foreground text-[10px] font-semibold"
      >
        {isTwin ? `DT-${device.name}` : device.name}
      </text>

      {/* IP Address */}
      <text
        y="63"
        textAnchor="middle"
        className="fill-muted-foreground text-[9px] font-mono"
      >
        {device.ipAddress}
      </text>
    </g>
  );
}

// Connection line component
function ConnectionLine({
  x1, y1, x2, y2,
  isAttack = false,
  isDashed = false,
  showFlow = false
}: {
  x1: number; y1: number; x2: number; y2: number;
  isAttack?: boolean;
  isDashed?: boolean;
  showFlow?: boolean;
}) {
  const pathId = `path-${x1}-${y1}-${x2}-${y2}`;

  return (
    <g>
      {/* Main line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        className={cn(
          "transition-colors duration-300",
          isAttack ? "stroke-destructive" : isDashed ? "stroke-twin/60" : "stroke-physical/60"
        )}
        strokeWidth={isAttack ? 2.5 : 2}
        strokeDasharray={isDashed ? "8 6" : "none"}
        strokeLinecap="round"
      />

      {/* Connection dots at ends */}
      <circle cx={x1} cy={y1} r="4" className={cn(
        isAttack ? "fill-destructive" : isDashed ? "fill-twin" : "fill-physical"
      )} />
      <circle cx={x2} cy={y2} r="4" className={cn(
        isAttack ? "fill-destructive" : isDashed ? "fill-twin" : "fill-physical"
      )} />

      {/* Animated flow particle */}
      {showFlow && (
        <>
          <path id={pathId} d={`M${x1},${y1} L${x2},${y2}`} fill="none" />
          <circle
            r="3"
            className={cn(isAttack ? "fill-destructive" : "fill-sync")}
          >
            <animateMotion dur="2s" repeatCount="indefinite">
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>
        </>
      )}
    </g>
  );
}

// Mirroring link with latency indicator
function MirrorLink({
  x1, y1, x2, y2,
  latency,
  isAttack = false
}: {
  x1: number; y1: number; x2: number; y2: number;
  latency: number;
  isAttack?: boolean;
}) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const pathId = `mirror-${x1}-${y1}`;

  return (
    <g>
      {/* Vertical dashed line */}
      <line
        x1={x1} y1={y1 + 35} x2={x2} y2={y2 - 35}
        className={cn(
          "transition-colors",
          isAttack ? "stroke-destructive/80" : "stroke-sync/60"
        )}
        strokeWidth="2"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />

      {/* Top connection point */}
      <circle
        cx={x1} cy={y1 + 35} r="5"
        className={cn(
          isAttack ? "fill-destructive" : "fill-sync",
          "transition-colors"
        )}
      />

      {/* Bottom connection point */}
      <circle
        cx={x2} cy={y2 - 35} r="5"
        className={cn(
          isAttack ? "fill-destructive" : "fill-sync",
          "transition-colors"
        )}
      />

      {/* Animated sync pulse */}
      <path id={pathId} d={`M${x1},${y1 + 35} L${x2},${y2 - 35}`} fill="none" />
      <circle
        r="4"
        className={cn(
          isAttack ? "fill-destructive" : "fill-sync",
          isAttack && "animate-pulse"
        )}
      >
        <animateMotion dur="2.5s" repeatCount="indefinite">
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>

      {/* Latency badge */}
      <g transform={`translate(${midX + 16}, ${midY})`}>
        <rect x="-12" y="-8" width="36" height="16" rx="4" className="fill-background/90 stroke-border" strokeWidth="1" />
        <text
          x="6" y="4"
          textAnchor="middle"
          className={cn(
            "text-[9px] font-mono font-medium",
            isAttack ? "fill-destructive" : latency > 50 ? "fill-warning" : "fill-sync"
          )}
        >
          {latency}ms
        </text>
      </g>
    </g>
  );
}

// Layer label component
function LayerLabel({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        className={cn("text-[13px] font-bold uppercase tracking-[0.2em]", color)}
        style={{ letterSpacing: '0.15em' }}
      >
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

  // Physical network connections
  const physicalConnections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; key: string; isAttackPath: boolean }[] = [];
    const processed = new Set<string>();

    devices.forEach(device => {
      device.connections.forEach(connId => {
        const connKey = [device.id, connId].sort().join('-');
        if (!processed.has(connKey)) {
          const connDevice = devices.find(d => d.id === connId);
          if (connDevice) {
            const isAttackPath = device.status === 'compromised' || connDevice.status === 'compromised';
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

  // Digital  twin connections
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
          const isAttackPath = twin.status === 'compromised' || connTwin.status === 'compromised';
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

  // Mirroring links
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

  const hasActiveAttack = devices.some(d => d.status === 'compromised');

  return (
    <div className={cn(
      "flex-1 flex flex-col relative overflow-hidden transition-colors duration-500",
      hasActiveAttack && currentStage === 'synchronization' && "bg-destructive/[0.02]"
    )}>
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.05) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 50%, transparent 0%, hsl(var(--background)) 100%)
          `,
        }}
      />

      {/* Main visualization container - centered */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-full max-w-4xl aspect-[16/10]">
          <svg
            className="w-full h-full"
            viewBox="0 0 800 500"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* ===== PHYSICAL NETWORK LAYER (TOP) ===== */}
            <g className={cn(isIntelligenceFocus && "opacity-50 transition-opacity")}>
              {/* Layer label */}
              <LayerLabel x={50} y={45} label="Physical Network" color="fill-physical" />

              {/* Physical connections */}
              {physicalConnections.map(line => (
                <ConnectionLine
                  key={line.key}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  isAttack={line.isAttackPath}
                  showFlow={line.isAttackPath}
                />
              ))}

              {/* Physical devices */}
              {devices.map(device => (
                <DeviceNode
                  key={device.id}
                  device={device}
                  isSelected={selectedDeviceId === device.id}
                  onClick={() => selectDevice(device.id)}
                  onHover={(hover) => hoverDevice(hover ? device.id : null)}
                  variant="physical"
                />
              ))}
            </g>

            {/* ===== MIRROR BOUNDARY ===== */}
            {showDigitalLayer && (
              <g>
                <line
                  x1="50" y1="250" x2="750" y2="250"
                  className="stroke-border/40"
                  strokeWidth="1"
                  strokeDasharray="12 8"
                />
                <rect x="330" y="238" width="140" height="24" rx="12" className="fill-background stroke-border/50" strokeWidth="1" />
                <text
                  x="400" y="254"
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px] uppercase tracking-[0.15em] font-medium"
                >
                  Mirror Boundary
                </text>
              </g>
            )}

            {/* ===== MIRRORING LINKS ===== */}
            {mirroringLinks.map(link => link && (
              <MirrorLink
                key={link.key}
                x1={link.x1}
                y1={link.y1}
                x2={link.x2}
                y2={link.y2}
                latency={link.syncLatency}
                isAttack={link.status === 'compromised'}
              />
            ))}

            {/* ===== Digital  TWIN LAYER (BOTTOM) ===== */}
            {showDigitalLayer && (
              <g className={cn(isIntelligenceFocus && "opacity-50 transition-opacity")}>
                {/* Layer label */}
                <LayerLabel x={50} y={295} label="Digital  Twin Network" color="fill-twin" />

                {/* Twin connections */}
                {twinConnections.map(line => (
                  <ConnectionLine
                    key={line.key}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    isAttack={line.isAttackPath}
                    isDashed={true}
                    showFlow={line.isAttackPath}
                  />
                ))}

                {/* Digital  twins */}
                {twins.map(twin => {
                  const physicalDevice = devices.find(d => d.id === twin.physicalDeviceId);
                  if (!physicalDevice) return null;

                  // Create a device-like object for the twin
                  const twinAsDevice = {
                    ...physicalDevice,
                    id: twin.id,
                    position: twin.position,
                    status: twin.status,
                  };

                  return (
                    <DeviceNode
                      key={twin.id}
                      device={twinAsDevice}
                      isSelected={selectedTwinId === twin.id}
                      onClick={() => selectTwin(twin.id)}
                      onHover={(hover) => hoverDevice(hover ? twin.physicalDeviceId : null)}
                      variant="twin"
                    />
                  );
                })}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Stage progress bar */}
      <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {[
              { id: 'network-discovery', label: 'Discovery' },
              { id: 'Digital -twin-creation', label: 'Twin Creation' },
              { id: 'synchronization', label: 'Synchronization' },
              { id: 'intelligence', label: 'Intelligence' },
            ].map((stage, index, arr) => (
              <div key={stage.id} className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    currentStage === stage.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  <span className={cn(
                    "text-sm font-medium transition-colors hidden sm:block",
                    currentStage === stage.id ? "text-primary" : "text-muted-foreground"
                  )}>
                    {stage.label}
                  </span>
                </div>
                {index < arr.length - 1 && (
                  <div className="flex-1 h-0.5 bg-border rounded-full max-w-16" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {currentStage === 'network-discovery' && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
          <Button
            onClick={() => createTwins()}
            size="lg"
            className="gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-shadow"
          >
            <ArrowRight className="w-4 h-4" />
            Create Digital  Twins
          </Button>
        </div>
      )}

      {currentStage === 'Digital -twin-creation' && state.twinCreationComplete && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
          <Button
            onClick={() => setStage('synchronization')}
            size="lg"
            className="gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-shadow"
          >
            <ArrowRight className="w-4 h-4" />
            Start Synchronization
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
      className="fixed pointer-events-none z-50 animate-fade-in"
      style={{
        left: `calc(50% + ${device.position.x - 400}px)`,
        top: `calc(50% + ${device.position.y - 250}px - 80px)`,
      }}
    >
      <div className="bg-popover/95 backdrop-blur-md border border-border rounded-xl shadow-2xl p-4 min-w-52">
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            device.status === 'compromised' ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
          )}>
            {device.deviceType === 'gateway' ? <Server className="w-5 h-5" /> :
              device.deviceType === 'camera' ? <Camera className="w-5 h-5" /> :
                device.deviceType === 'sensor' ? <Wifi className="w-5 h-5" /> :
                  <Radio className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">{device.name}</h4>
            <p className="text-[10px] text-muted-foreground font-mono">{device.ipAddress}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase",
              device.status === 'benign' ? "bg-success/20 text-success" :
                device.status === 'compromised' ? "bg-destructive/20 text-destructive" :
                  "bg-warning/20 text-warning"
            )}>
              {device.status === 'compromised' ? theme.terminology.threatLabel : device.status === 'benign' ? 'Benign' : 'Suspicious'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Latency</span>
            <span className="font-mono">{device.latency}ms</span>
          </div>
          {twin && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Twin Drift</span>
              <span className={cn(
                "font-mono",
                twin.driftIndicator > 50 ? "text-warning" : "text-success"
              )}>
                {twin.driftIndicator.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
