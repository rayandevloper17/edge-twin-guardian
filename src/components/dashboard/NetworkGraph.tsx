import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { PhysicalDevice, DigitalTwin } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, Check } from 'lucide-react';

interface DeviceNodeProps {
  device: PhysicalDevice;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hover: boolean) => void;
}

function PhysicalDeviceNode({ device, isSelected, isHovered, onClick, onHover }: DeviceNodeProps) {
  return (
    <g
      className="network-node cursor-pointer"
      transform={`translate(${device.position.x}, ${device.position.y})`}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Outer glow for attack state */}
      {device.status === 'attack' && (
        <rect
          x="-35"
          y="-25"
          width="70"
          height="50"
          rx="8"
          className="fill-destructive/20 attack-pulse"
        />
      )}
      
      {/* Main shape - Rectangle for physical */}
      <rect
        x="-30"
        y="-20"
        width="60"
        height="40"
        rx="6"
        className={cn(
          'transition-all duration-300',
          device.status === 'attack' 
            ? 'fill-destructive/30 stroke-destructive stroke-2' 
            : device.status === 'warning'
            ? 'fill-warning/20 stroke-warning stroke-2'
            : 'fill-physical/10 stroke-physical stroke-2',
          isSelected && 'stroke-[3]',
          isHovered && 'brightness-125'
        )}
      />
      
      {/* Selection checkmark */}
      {isSelected && (
        <g transform="translate(20, -15)">
          <circle r="8" className="fill-primary" />
          <Check className="text-primary-foreground" x="-4" y="-4" width="8" height="8" />
        </g>
      )}
      
      {/* Device label */}
      <text
        y="35"
        textAnchor="middle"
        className="fill-foreground text-[10px] font-medium"
      >
        {device.name.length > 15 ? device.name.slice(0, 15) + '...' : device.name}
      </text>
      
      {/* Status indicator */}
      <circle
        cx="25"
        cy="15"
        r="4"
        className={cn(
          device.status === 'online' ? 'fill-success' :
          device.status === 'attack' ? 'fill-destructive animate-pulse' :
          device.status === 'warning' ? 'fill-warning' : 'fill-muted-foreground'
        )}
      />
    </g>
  );
}

interface TwinNodeProps {
  twin: DigitalTwin;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hover: boolean) => void;
}

function DigitalTwinNode({ twin, isSelected, isHovered, onClick, onHover }: TwinNodeProps) {
  return (
    <g
      className="network-node cursor-pointer"
      transform={`translate(${twin.position.x}, ${twin.position.y})`}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Outer glow for attack state */}
      {twin.status === 'attack' && (
        <circle
          r="28"
          className="fill-destructive/20 attack-pulse"
        />
      )}
      
      {/* Main shape - Circle for digital twin */}
      <circle
        r="22"
        className={cn(
          'transition-all duration-300',
          twin.status === 'attack' 
            ? 'fill-destructive/30 stroke-destructive stroke-2' 
            : twin.status === 'warning'
            ? 'fill-warning/20 stroke-warning stroke-2'
            : 'fill-twin/10 stroke-twin stroke-2',
          isSelected && 'stroke-[3]',
          isHovered && 'brightness-125'
        )}
      />
      
      {/* Inner pattern - digital look */}
      <circle r="12" className="fill-none stroke-twin/30 stroke-1" strokeDasharray="4 2" />
      
      {/* Selection indicator */}
      {isSelected && (
        <g transform="translate(15, -15)">
          <circle r="8" className="fill-twin" />
          <Check className="text-primary-foreground" x="-4" y="-4" width="8" height="8" />
        </g>
      )}
      
      {/* Twin label */}
      <text
        y="40"
        textAnchor="middle"
        className="fill-foreground text-[10px] font-medium"
      >
        Twin
      </text>
      
      {/* Status indicator */}
      <circle
        cx="18"
        cy="18"
        r="4"
        className={cn(
          twin.status === 'online' ? 'fill-success' :
          twin.status === 'attack' ? 'fill-destructive animate-pulse' :
          twin.status === 'warning' ? 'fill-warning' : 'fill-muted-foreground'
        )}
      />
    </g>
  );
}

export default function NetworkGraph() {
  const { state, selectDevice, selectTwin, hoverDevice, createTwins } = useDashboard();
  const { devices, twins, currentStage, selectedDeviceId, selectedTwinId, hoveredDeviceId } = state;

  const showPhysical = currentStage !== 'digital-twin-creation' || !state.twinCreationComplete;
  const showTwins = currentStage !== 'network-discovery' && state.twinCreationComplete;
  const showSyncLines = (currentStage === 'synchronization' || currentStage === 'intelligence') && state.twinCreationComplete;

  // Calculate connection lines between physical devices
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

  // Calculate sync lines between physical and digital twins
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

  const getHeaderText = () => {
    switch (currentStage) {
      case 'network-discovery':
        return 'Select the physical IoT device';
      case 'digital-twin-creation':
        return state.twinCreationComplete 
          ? 'Digital twins created successfully' 
          : 'Select the digital IoT device';
      case 'synchronization':
        return 'Monitoring synchronization status';
      case 'intelligence':
        return 'System intelligence active';
      default:
        return '';
    }
  };

  const handleCreateTwins = () => {
    createTwins();
  };

  return (
    <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm relative z-10">
        <p className="text-sm text-muted-foreground font-medium">{getHeaderText()}</p>
      </div>

      {/* Network visualization */}
      <div className="flex-1 relative">
        <svg className="w-full h-full" viewBox="0 0 700 600">
          {/* Physical device connections */}
          {showPhysical && physicalConnections.map(line => (
            <line
              key={line.key}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              className="stroke-physical/30 stroke-1"
              strokeDasharray="4 4"
            />
          ))}

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
                line.status === 'attack' ? 'stroke-destructive' :
                line.status === 'warning' ? 'stroke-warning' : 'stroke-sync/50'
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
              isHovered={hoveredDeviceId === device.id}
              onClick={() => selectDevice(device.id)}
              onHover={(hover) => hoverDevice(hover ? device.id : null)}
            />
          ))}

          {/* Digital twins */}
          {showTwins && twins.map(twin => (
            <DigitalTwinNode
              key={twin.id}
              twin={twin}
              isSelected={selectedTwinId === twin.id}
              isHovered={hoveredDeviceId === twin.physicalDeviceId}
              onClick={() => selectTwin(twin.id)}
              onHover={(hover) => hoverDevice(hover ? twin.physicalDeviceId : null)}
            />
          ))}

          {/* Label for sections */}
          {showPhysical && (
            <text x="50" y="30" className="fill-physical text-xs font-medium uppercase tracking-wider">
              Physical Network
            </text>
          )}
          {showTwins && (
            <text x="50" y="260" className="fill-twin text-xs font-medium uppercase tracking-wider">
              Digital Twin Network
            </text>
          )}
        </svg>
      </div>

      {/* Bottom action bar */}
      {(currentStage === 'network-discovery' || (currentStage === 'digital-twin-creation' && !state.twinCreationComplete)) && (
        <div className="px-6 py-4 border-t border-border bg-card/50 backdrop-blur-sm relative z-10">
          <Button 
            onClick={handleCreateTwins}
            className="gap-2"
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
        left: position.x + 80,
        top: position.y - 20,
      }}
    >
      <div className="bg-popover border border-border rounded-lg shadow-xl p-3 min-w-48">
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
