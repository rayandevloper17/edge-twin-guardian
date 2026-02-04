import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { PhysicalDevice, DigitalTwin } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight } from 'lucide-react';

// Device node for physical layer
function PhysicalDeviceNode({ 
  device, 
  isSelected, 
  onClick, 
  onHover 
}: {
  device: PhysicalDevice;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hover: boolean) => void;
}) {
  const isAttack = device.status === 'attack';
  const isWarning = device.status === 'warning';

  return (
    <g
      className="cursor-pointer"
      transform={`translate(${device.position.x}, ${device.position.y})`}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Glow effect for attack state */}
      {isAttack && (
        <>
          <rect
            x="-50"
            y="-35"
            width="100"
            height="70"
            rx="8"
            className="fill-destructive/20 attack-pulse"
          />
          <rect
            x="-45"
            y="-30"
            width="90"
            height="60"
            rx="6"
            className="fill-destructive/10"
          />
        </>
      )}
      
      {/* URGENT badge for attack state */}
      {isAttack && (
        <g transform="translate(-15, -55)">
          <rect
            x="-25"
            y="-10"
            width="80"
            height="20"
            rx="4"
            className="fill-destructive"
          />
          <text
            x="15"
            y="4"
            textAnchor="middle"
            className="fill-white text-[10px] font-bold uppercase"
          >
            URGENT
          </text>
        </g>
      )}
      
      {/* Main device rectangle */}
      <rect
        x="-40"
        y="-25"
        width="80"
        height="50"
        rx="6"
        className={cn(
          'transition-all duration-300 stroke-2',
          isAttack 
            ? 'fill-destructive/20 stroke-destructive' 
            : isWarning
            ? 'fill-warning/10 stroke-warning'
            : 'fill-physical/10 stroke-physical',
          isSelected && 'stroke-[3] stroke-primary'
        )}
      />
      
      {/* Device icon placeholder */}
      <rect
        x="-25"
        y="-15"
        width="50"
        height="30"
        rx="3"
        className={cn(
          "fill-none stroke-1",
          isAttack ? "stroke-destructive/50" : "stroke-physical/30"
        )}
      />
      
      {/* Device name */}
      <text
        y="40"
        textAnchor="middle"
        className="fill-foreground text-[11px] font-medium"
      >
        {device.name}
      </text>
      
      {/* IP Address */}
      <text
        y="52"
        textAnchor="middle"
        className="fill-muted-foreground text-[9px] font-mono"
      >
        IP: {device.ipAddress}
      </text>
      
      {/* Status indicator */}
      <circle
        cx="32"
        cy="-17"
        r="5"
        className={cn(
          device.status === 'online' ? 'fill-success' :
          device.status === 'attack' ? 'fill-destructive animate-pulse' :
          device.status === 'warning' ? 'fill-warning' : 'fill-muted-foreground'
        )}
      />
    </g>
  );
}

// Digital twin node
function DigitalTwinNode({ 
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
      {/* Glow effect for attack state */}
      {isAttack && (
        <rect
          x="-45"
          y="-30"
          width="90"
          height="60"
          rx="6"
          className="fill-destructive/15 attack-pulse"
        />
      )}
      
      {/* Main twin rectangle - dashed border for digital */}
      <rect
        x="-40"
        y="-25"
        width="80"
        height="50"
        rx="6"
        strokeDasharray="4 2"
        className={cn(
          'transition-all duration-300 stroke-2',
          isAttack 
            ? 'fill-destructive/10 stroke-destructive' 
            : 'fill-twin/10 stroke-twin',
          isSelected && 'stroke-[3] stroke-primary'
        )}
      />
      
      {/* Digital pattern */}
      <rect
        x="-25"
        y="-15"
        width="50"
        height="30"
        rx="3"
        strokeDasharray="3 1"
        className="fill-none stroke-twin/30 stroke-1"
      />
      
      {/* Twin label */}
      <text
        y="40"
        textAnchor="middle"
        className="fill-foreground text-[10px] font-medium"
      >
        Digital Twin - {physicalDevice.name.split(' ')[0]}
      </text>
      
      {/* IP Address */}
      <text
        y="52"
        textAnchor="middle"
        className="fill-muted-foreground text-[9px] font-mono"
      >
        IP: {physicalDevice.ipAddress}
      </text>
    </g>
  );
}

// Stage indicator component
function StageIndicator({ currentStage }: { currentStage: string }) {
  const stages = [
    { id: 'network-discovery', label: 'Discovery', color: 'text-cyan-400' },
    { id: 'digital-twin-creation', label: 'Mirroring', color: 'text-cyan-400' },
    { id: 'synchronization', label: 'Threat', color: 'text-destructive' },
    { id: 'intelligence', label: 'Mitigation', color: 'text-success' },
  ];

  return (
    <div className="flex items-center justify-center gap-4 py-3">
      {stages.map((stage, index) => (
        <div key={stage.id} className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-medium transition-colors",
            currentStage === stage.id ? stage.color : "text-muted-foreground/50"
          )}>
            {stage.label}
          </span>
          {index < stages.length - 1 && (
            <span className="text-muted-foreground/30">—</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function NetworkGraph() {
  const { state, selectDevice, selectTwin, hoverDevice, createTwins } = useDashboard();
  const { devices, twins, currentStage, selectedDeviceId, selectedTwinId, hoveredDeviceId } = state;

  const showPhysical = true;
  const showTwins = currentStage !== 'network-discovery' && state.twinCreationComplete;
  const showSyncLines = showTwins;

  // Connection lines between physical devices
  const physicalConnections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
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
            });
            processed.add(connKey);
          }
        }
      });
    });

    return lines;
  }, [devices]);

  // Sync lines between physical and digital twins
  const syncConnections = useMemo(() => {
    if (!showSyncLines) return [];
    
    return twins.map(twin => {
      const physical = devices.find(d => d.id === twin.physicalDeviceId);
      if (!physical) return null;
      return {
        x1: physical.position.x,
        y1: physical.position.y,
        x2: twin.position.x,
        y2: twin.position.y,
        key: `sync-${twin.id}`,
        status: twin.status,
      };
    }).filter(Boolean);
  }, [twins, devices, showSyncLines]);

  const handleCreateTwins = () => {
    createTwins();
  };

  return (
    <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-overlay opacity-20" />
      
      {/* Perspective grid effect */}
      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(180deg, transparent 0%, hsl(var(--background)) 95%),
          linear-gradient(90deg, hsl(var(--primary) / 0.03) 1px, transparent 1px),
          linear-gradient(hsl(var(--primary) / 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
      }} />
      
      {/* Headers */}
      <div className="flex justify-between px-6 py-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-physical animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-physical">
            Physical Devices
          </span>
        </div>
        {showTwins && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-twin animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-twin">
              Digital Twins
            </span>
          </div>
        )}
      </div>

      {/* Network visualization */}
      <div className="flex-1 relative">
        <svg className="w-full h-full" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines for 3D effect */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="attackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--destructive))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Physical device connections */}
          {showPhysical && physicalConnections.map(line => {
            const device1 = devices.find(d => d.position.x === line.x1 && d.position.y === line.y1);
            const device2 = devices.find(d => d.position.x === line.x2 && d.position.y === line.y2);
            const isAttackLine = device1?.status === 'attack' || device2?.status === 'attack';
            
            return (
              <line
                key={line.key}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={isAttackLine ? "url(#attackGradient)" : "url(#lineGradient)"}
                strokeWidth={isAttackLine ? 2 : 1.5}
                strokeDasharray={isAttackLine ? "none" : "8 4"}
                className={isAttackLine ? "animate-pulse" : ""}
              />
            );
          })}

          {/* Sync lines between physical and twins */}
          {syncConnections.map(line => line && (
            <line
              key={line.key}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              className={cn(
                'stroke-2',
                line.status === 'attack' ? 'stroke-destructive' : 'stroke-sync/40'
              )}
              strokeDasharray="6 3"
              style={{
                animation: line.status !== 'attack' ? 'dataFlow 1.5s linear infinite' : undefined,
              }}
            />
          ))}

          {/* Physical devices */}
          {showPhysical && devices.map(device => (
            <PhysicalDeviceNode
              key={device.id}
              device={device}
              isSelected={selectedDeviceId === device.id}
              onClick={() => selectDevice(device.id)}
              onHover={(hover) => hoverDevice(hover ? device.id : null)}
            />
          ))}

          {/* Digital twins */}
          {showTwins && twins.map(twin => {
            const physicalDevice = devices.find(d => d.id === twin.physicalDeviceId);
            if (!physicalDevice) return null;
            return (
              <DigitalTwinNode
                key={twin.id}
                twin={twin}
                physicalDevice={physicalDevice}
                isSelected={selectedTwinId === twin.id}
                onClick={() => selectTwin(twin.id)}
                onHover={(hover) => hoverDevice(hover ? twin.physicalDeviceId : null)}
              />
            );
          })}
        </svg>
      </div>

      {/* Stage indicator at bottom */}
      <div className="border-t border-border/50 bg-card/30 backdrop-blur-sm relative z-10">
        <StageIndicator currentStage={currentStage} />
      </div>

      {/* Action button */}
      {(currentStage === 'network-discovery' || (currentStage === 'digital-twin-creation' && !state.twinCreationComplete)) && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
          <Button 
            onClick={handleCreateTwins}
            className="gap-2 bg-primary/90 hover:bg-primary shadow-lg"
            disabled={!selectedDeviceId && currentStage === 'network-discovery'}
          >
            {currentStage === 'network-discovery' ? (
              <>
                <Plus className="w-4 h-4" />
                Create your digital twin network
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                Continue to Synchronization
              </>
            )}
          </Button>
        </div>
      )}

      {/* Hover tooltip */}
      {hoveredDeviceId && (
        <HoverTooltip deviceId={hoveredDeviceId} />
      )}
    </div>
  );
}

function HoverTooltip({ deviceId }: { deviceId: string }) {
  const { state } = useDashboard();
  const device = state.devices.find(d => d.id === deviceId);
  const twin = state.twins.find(t => t.physicalDeviceId === deviceId);

  if (!device) return null;

  const displayData = twin || device;
  const position = device.position;

  return (
    <div
      className="absolute pointer-events-none z-50 animate-fade-in"
      style={{
        left: Math.min(position.x + 100, 450),
        top: position.y - 20,
      }}
    >
      <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-3 min-w-48">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            'w-2 h-2 rounded-full',
            displayData.status === 'online' ? 'bg-success' :
            displayData.status === 'attack' ? 'bg-destructive animate-pulse' :
            displayData.status === 'warning' ? 'bg-warning' : 'bg-muted-foreground'
          )} />
          <span className="text-xs font-medium text-foreground capitalize">{displayData.status}</span>
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Health:</span>
            <span className="text-foreground font-mono">
              {displayData.status === 'attack' ? 'Critical' : displayData.status === 'warning' ? 'Degraded' : 'Good'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Latency:</span>
            <span className="text-foreground font-mono">{device.latency}ms</span>
          </div>
          {displayData.status === 'attack' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Alert:</span>
              <span className="text-destructive font-medium">Active Threat</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
