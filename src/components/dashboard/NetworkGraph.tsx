import { useMemo, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { PhysicalDevice, DigitalTwin } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wifi, Radio, Camera, Cpu, Server, Brain } from 'lucide-react';
import { getTheme } from '@/config/themes';

// ─── Device Node ────────────────────────────────────────────────
function DeviceNode({
  device,
  isSelected,
  onClick,
  onHover,
  variant = 'physical',
  isCompromisedPath = false,
}: {
  device: PhysicalDevice;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hover: boolean) => void;
  variant?: 'physical' | 'twin';
  isCompromisedPath?: boolean;
}) {
  const { state } = useDashboard();
  const theme = getTheme(state.useCase);
  const isAttack = device.status === 'compromised';
  const isTwin = variant === 'twin';

  const getDeviceIcon = () => {
    const iconClass = cn("w-5 h-5", isTwin ? "stroke-[1.5]" : "stroke-2");
    switch (device.deviceType) {
      case 'radar': return <Radio className={iconClass} />;
      case 'camera': return <Camera className={iconClass} />;
      case 'sensor': return <Wifi className={iconClass} />;
      case 'gateway': return <Server className={iconClass} />;
      default: return <Cpu className={iconClass} />;
    }
  };

  // Node size - slightly smaller for clean spacing
  const nodeSize = 28;

  return (
    <g
      className="cursor-pointer"
      transform={`translate(${device.position.x}, ${device.position.y})`}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Selection ring */}
      {isSelected && (
        <circle
          cx="0" cy="0" r={nodeSize + 8}
          className="fill-none stroke-primary/60 stroke-[1.5] animate-pulse"
          strokeDasharray={isTwin ? "4 4" : "none"}
        />
      )}

      {/* Attack halo - ONLY on compromised devices */}
      {isAttack && (
        <circle
          cx="0" cy="0" r={nodeSize + 12}
          className="fill-destructive/10 stroke-destructive/30 stroke-1"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        />
      )}

      <g className="transition-transform duration-200 hover:scale-105">
        {isTwin ? (
          // Twin: Dashed circle
          <>
            <circle
              cx="0" cy="0" r={nodeSize}
              className={cn(
                "fill-background/80 transition-colors",
                isAttack ? "stroke-destructive" : "stroke-twin"
              )}
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <circle
              cx="0" cy="0" r={nodeSize - 6}
              className={cn(
                "fill-none",
                isAttack ? "stroke-destructive/20" : "stroke-twin/15"
              )}
              strokeWidth="6"
            />
          </>
        ) : (
          // Physical: Solid hexagonal shape
          <>
            <polygon
              points={`0,${-nodeSize} ${nodeSize * 0.87},${-nodeSize * 0.5} ${nodeSize * 0.87},${nodeSize * 0.5} 0,${nodeSize} ${-nodeSize * 0.87},${nodeSize * 0.5} ${-nodeSize * 0.87},${-nodeSize * 0.5}`}
              className={cn(
                "transition-colors",
                isAttack ? "fill-destructive/15 stroke-destructive" : "fill-card stroke-physical"
              )}
              strokeWidth="2"
            />
            <polygon
              points={`0,${-nodeSize + 6} ${(nodeSize - 6) * 0.87},${-(nodeSize - 6) * 0.5} ${(nodeSize - 6) * 0.87},${(nodeSize - 6) * 0.5} 0,${nodeSize - 6} ${-(nodeSize - 6) * 0.87},${(nodeSize - 6) * 0.5} ${-(nodeSize - 6) * 0.87},${-(nodeSize - 6) * 0.5}`}
              className={cn(
                "fill-none",
                isAttack ? "stroke-destructive/30" : "stroke-physical/25"
              )}
              strokeWidth="1"
            />
          </>
        )}

        {/* Icon */}
        <foreignObject x="-10" y="-10" width="20" height="20">
          <div className={cn(
            "w-full h-full flex items-center justify-center",
            isAttack ? "text-destructive" : isTwin ? "text-twin" : "text-physical"
          )}>
            {getDeviceIcon()}
          </div>
        </foreignObject>
      </g>

      {/* Compromised badge */}
      {isAttack && (
        <g transform="translate(0, -42)">
          <rect
            x="-40" y="-10" width="80" height="18" rx="9"
            className="fill-destructive shadow-lg"
          />
          <text
            x="0" y="3"
            textAnchor="middle"
            className="fill-white text-[7px] font-bold tracking-wider"
          >
            COMPROMISED
          </text>
        </g>
      )}

      {/* Device name - full name for twins */}
      <text
        y={nodeSize + 16}
        textAnchor="middle"
        className="fill-foreground text-[10px] font-semibold"
      >
        {isTwin ? `DT-${device.name}` : device.name}
      </text>

      {/* IP Address */}
      <text
        y={nodeSize + 28}
        textAnchor="middle"
        className="fill-muted-foreground text-[8px] font-mono"
      >
        {device.ipAddress}
      </text>

      {/* Status indicator dot */}
      <circle
        cx={nodeSize - 2}
        cy={-nodeSize + 2}
        r={4}
        className={cn(
          isAttack ? "fill-destructive animate-pulse" :
          device.status === 'suspicious' ? "fill-warning" : "fill-success"
        )}
      />
    </g>
  );
}

// ─── Connection Line ─────────────────────────────────────────────
function ConnectionLine({
  x1, y1, x2, y2,
  isAttack = false,
  isDashed = false,
  showFlow = false,
  muted = false,
}: {
  x1: number; y1: number; x2: number; y2: number;
  isAttack?: boolean;
  isDashed?: boolean;
  showFlow?: boolean;
  muted?: boolean;
}) {
  const pathId = `path-${x1}-${y1}-${x2}-${y2}`;

  return (
    <g className={cn(muted && "opacity-30")}>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        className={cn(
          "transition-colors duration-300",
          isAttack ? "stroke-destructive" : isDashed ? "stroke-twin/50" : "stroke-physical/50"
        )}
        strokeWidth={isAttack ? 2.5 : 1.5}
        strokeDasharray={isDashed ? "8 6" : "none"}
        strokeLinecap="round"
      />

      {/* Connection dots at ends */}
      <circle cx={x1} cy={y1} r="3" className={cn(
        isAttack ? "fill-destructive" : isDashed ? "fill-twin/60" : "fill-physical/60"
      )} />
      <circle cx={x2} cy={y2} r="3" className={cn(
        isAttack ? "fill-destructive" : isDashed ? "fill-twin/60" : "fill-physical/60"
      )} />

      {/* Animated flow particle - only for attack paths */}
      {showFlow && isAttack && (
        <>
          <path id={pathId} d={`M${x1},${y1} L${x2},${y2}`} fill="none" />
          <circle r="3" className="fill-destructive">
            <animateMotion dur="2s" repeatCount="indefinite">
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>
        </>
      )}
    </g>
  );
}

// ─── Mirror Link (Vertical Only) ─────────────────────────────────
function MirrorLink({
  x, y1, y2,
  latency,
  isAttack = false,
  muted = false,
}: {
  x: number; y1: number; y2: number;
  latency: number;
  isAttack?: boolean;
  muted?: boolean;
}) {
  const midY = (y1 + y2) / 2;
  const pathId = `mirror-${x}-${y1}`;

  return (
    <g className={cn(muted && "opacity-30")}>
      {/* Strictly vertical dashed line */}
      <line
        x1={x} y1={y1 + 32} x2={x} y2={y2 - 32}
        className={cn(
          "transition-colors",
          isAttack ? "stroke-destructive/70" : "stroke-sync/50"
        )}
        strokeWidth="1.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />

      {/* Top connection point */}
      <circle
        cx={x} cy={y1 + 32} r="4"
        className={cn(
          isAttack ? "fill-destructive" : "fill-sync",
          "transition-colors"
        )}
      />

      {/* Bottom connection point */}
      <circle
        cx={x} cy={y2 - 32} r="4"
        className={cn(
          isAttack ? "fill-destructive" : "fill-sync",
          "transition-colors"
        )}
      />

      {/* Animated sync pulse */}
      <path id={pathId} d={`M${x},${y1 + 32} L${x},${y2 - 32}`} fill="none" />
      <circle
        r="3"
        className={cn(
          isAttack ? "fill-destructive" : "fill-sync",
          isAttack && "animate-pulse"
        )}
      >
        <animateMotion dur="2.5s" repeatCount="indefinite">
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>

      {/* Latency badge - offset to the right */}
      <g transform={`translate(${x + 14}, ${midY})`}>
        <rect x="-10" y="-8" width="32" height="16" rx="4" className="fill-background/90 stroke-border/50" strokeWidth="1" />
        <text
          x="6" y="4"
          textAnchor="middle"
          className={cn(
            "text-[8px] font-mono font-medium",
            isAttack ? "fill-destructive" : latency > 50 ? "fill-warning" : "fill-sync"
          )}
        >
          {latency}ms
        </text>
      </g>
    </g>
  );
}

// ─── Layer Label ─────────────────────────────────────────────────
function LayerLabel({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        className={cn("text-[11px] font-bold uppercase tracking-[0.2em]", color)}
        style={{ letterSpacing: '0.15em' }}
      >
        {label}
      </text>
    </g>
  );
}

// ─── Main Network Graph ──────────────────────────────────────────
export default function NetworkGraph() {
  const { state, selectDevice, selectTwin, hoverDevice, createTwins, setStage } = useDashboard();
  const { devices, twins, currentStage, selectedDeviceId, selectedTwinId, hoveredDeviceId } = state;
  const theme = getTheme(state.useCase);

  // Apply theme
  useEffect(() => {
    if (state.useCase) {
      document.documentElement.setAttribute('data-theme', state.useCase);
    }
  }, [state.useCase]);

  // Stage-driven visibility
  const showPhysicalLayer = true;
  const showDigitalLayer = currentStage !== 'network-discovery' && state.twinCreationComplete;
  const showMirroringLinks = showDigitalLayer && (currentStage === 'synchronization' || currentStage === 'intelligence');
  // Attack visuals are now stage-driven — only visible during intelligence

  // Identify compromised device IDs for threat isolation
  const compromisedIds = useMemo(() => new Set(
    devices.filter(d => d.status === 'compromised').map(d => d.id)
  ), [devices]);

  const hasActiveAttack = compromisedIds.size > 0;

  // Determine if a connection involves a compromised device (threat path)
  const isAttackPath = (id1: string, id2: string) => {
    return compromisedIds.has(id1) || compromisedIds.has(id2);
  };

  // Check if a device is directly connected to a compromised device
  const isDirectlyConnectedToThreat = (deviceId: string) => {
    if (compromisedIds.has(deviceId)) return true;
    const device = devices.find(d => d.id === deviceId);
    return device?.connections.some(connId => compromisedIds.has(connId)) ?? false;
  };

  // Physical network connections (hub-and-spoke, no crossing)
  const physicalConnections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; key: string; isAttackPath: boolean }[] = [];
    const processed = new Set<string>();

    devices.forEach(device => {
      device.connections.forEach(connId => {
        const connKey = [device.id, connId].sort().join('-');
        if (!processed.has(connKey)) {
          const connDevice = devices.find(d => d.id === connId);
          if (connDevice) {
            lines.push({
              x1: device.position.x,
              y1: device.position.y,
              x2: connDevice.position.x,
              y2: connDevice.position.y,
              key: connKey,
              isAttackPath: isAttackPath(device.id, connId),
            });
            processed.add(connKey);
          }
        }
      });
    });

    return lines;
  }, [devices, compromisedIds]);

  // Digital twin connections (mirrors physical topology)
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
          lines.push({
            x1: twin.position.x,
            y1: twin.position.y,
            x2: connTwin.position.x,
            y2: connTwin.position.y,
            key: connKey,
            isAttackPath: isAttackPath(twin.physicalDeviceId, connTwin.physicalDeviceId ?? ''),
          });
          processed.add(connKey);
        }
      });
    });

    return lines;
  }, [twins, devices, showDigitalLayer, compromisedIds]);

  // Mirroring links - strictly vertical
  const mirroringLinks = useMemo(() => {
    if (!showMirroringLinks) return [];

    return twins.map(twin => {
      const physical = devices.find(d => d.id === twin.physicalDeviceId);
      if (!physical) return null;
      return {
        x: physical.position.x, // Same X = strictly vertical
        y1: physical.position.y,
        y2: twin.position.y,
        key: `mirror-${twin.id}`,
        status: twin.status,
        syncLatency: twin.syncLatency,
        isDirectThreat: compromisedIds.has(physical.id),
      };
    }).filter(Boolean);
  }, [twins, devices, showMirroringLinks, compromisedIds]);

  // Adaptive viewBox: taller when twins are visible
  const viewBoxHeight = showDigitalLayer ? 520 : 260;

  return (
    <div className={cn(
      "flex-1 flex flex-col relative overflow-hidden transition-colors duration-500",
      hasActiveAttack && "bg-destructive/[0.02]"
    )}>
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.04) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 50%, transparent 0%, hsl(var(--background)) 100%)`,
        }}
      />

      {/* Main visualization container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-5xl" style={{ aspectRatio: `800/${viewBoxHeight}` }}>
          <svg
            className="w-full h-full"
            viewBox={`0 0 800 ${viewBoxHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* ===== PHYSICAL NETWORK LAYER (TOP) ===== */}
            <g>
              <LayerLabel x={50} y={40} label="Physical Network" color="fill-physical" />

              {/* Physical connections */}
              {physicalConnections.map(line => (
                <ConnectionLine
                  key={line.key}
                  x1={line.x1} y1={line.y1}
                  x2={line.x2} y2={line.y2}
                  isAttack={line.isAttackPath}
                  showFlow={line.isAttackPath}
                  muted={hasActiveAttack && !line.isAttackPath}
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
                  x1="50" y1="245" x2="750" y2="245"
                  className="stroke-border/40"
                  strokeWidth="1"
                  strokeDasharray="12 8"
                />
                <rect x="325" y="233" width="150" height="24" rx="12" className="fill-background stroke-border/50" strokeWidth="1" />
                <text
                  x="400" y="249"
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px] uppercase tracking-[0.15em] font-medium"
                >
                  Mirror Boundary
                </text>
              </g>
            )}

            {/* ===== MIRRORING LINKS (STRICTLY VERTICAL) ===== */}
            {mirroringLinks.map(link => link && (
              <MirrorLink
                key={link.key}
                x={link.x}
                y1={link.y1}
                y2={link.y2}
                latency={link.syncLatency}
                isAttack={link.status === 'compromised'}
                muted={hasActiveAttack && !link.isDirectThreat}
              />
            ))}

            {/* ===== DIGITAL TWIN LAYER (BOTTOM) ===== */}
            {showDigitalLayer && (
              <g>
                <LayerLabel x={50} y={290} label="Digital Twin Network" color="fill-twin" />

                {/* Twin connections */}
                {twinConnections.map(line => (
                  <ConnectionLine
                    key={line.key}
                    x1={line.x1} y1={line.y1}
                    x2={line.x2} y2={line.y2}
                    isAttack={line.isAttackPath}
                    isDashed={true}
                    showFlow={line.isAttackPath}
                    muted={hasActiveAttack && !line.isAttackPath}
                  />
                ))}

                {/* Digital twins */}
                {twins.map(twin => {
                  const physicalDevice = devices.find(d => d.id === twin.physicalDeviceId);
                  if (!physicalDevice) return null;

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
            Create Digital Twins
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

      {currentStage === 'synchronization' && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
          <Button
            onClick={() => setStage('intelligence')}
            size="lg"
            className="gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-shadow"
          >
            <Brain className="w-4 h-4" />
            Start AI Analysis
          </Button>
        </div>
      )}

      {/* Hover tooltip */}
      {hoveredDeviceId && <HoverTooltip deviceId={hoveredDeviceId} />}
    </div>
  );
}

// ─── Hover Tooltip ───────────────────────────────────────────────
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
              {device.status === 'compromised' ? 'Compromised' : device.status === 'benign' ? 'Benign' : 'Suspicious'}
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
