// Realistic device icons for the Digital Twin Command System
// Each device has a physical (solid) and digital twin (holographic) variant

import { DeviceStatus } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface DeviceIconProps {
  type: 'radar' | 'camera' | 'sensor' | 'gateway';
  variant: 'physical' | 'twin';
  status: DeviceStatus;
  size?: number;
  className?: string;
}

// Radar/Traffic Controller Icon
function RadarIcon({ variant, status, size = 48 }: Omit<DeviceIconProps, 'type'>) {
  const isPhysical = variant === 'physical';
  const isAttack = status === 'attack';
  const isWarning = status === 'warning';
  
  return (
    <g>
      {/* Base unit */}
      <rect
        x={-size/2 + 4}
        y={-size/4}
        width={size - 8}
        height={size/2}
        rx={isPhysical ? 2 : 4}
        className={cn(
          isPhysical ? 'fill-physical/20 stroke-physical stroke-2' : 'fill-twin/10 stroke-twin stroke-[1.5]',
          !isPhysical && 'stroke-dasharray-[4,2]'
        )}
        strokeDasharray={isPhysical ? undefined : "4 2"}
      />
      
      {/* Radar dish */}
      <ellipse
        cx={0}
        cy={-size/4 - 6}
        rx={size/3}
        ry={size/6}
        className={cn(
          isPhysical ? 'fill-physical/30 stroke-physical' : 'fill-twin/15 stroke-twin',
          'stroke-[1.5]'
        )}
        strokeDasharray={isPhysical ? undefined : "3 2"}
      />
      
      {/* Antenna */}
      <line
        x1={0}
        y1={-size/4}
        x2={0}
        y2={-size/4 - 12}
        className={cn(
          isPhysical ? 'stroke-physical' : 'stroke-twin',
          'stroke-2'
        )}
        strokeDasharray={isPhysical ? undefined : "2 2"}
      />
      
      {/* Status LED */}
      <circle
        cx={size/2 - 10}
        cy={-size/4 + 8}
        r={3}
        className={cn(
          isAttack ? 'fill-destructive animate-pulse' :
          isWarning ? 'fill-warning' : 'fill-success'
        )}
      />
      
      {/* Scan lines (physical only) */}
      {isPhysical && (
        <g className="opacity-40">
          <line x1={-size/4} y1={0} x2={size/4} y2={0} className="stroke-physical stroke-1" />
          <line x1={-size/6} y1={6} x2={size/6} y2={6} className="stroke-physical stroke-1" />
        </g>
      )}
      
      {/* Holographic glow for twin */}
      {!isPhysical && (
        <ellipse
          cx={0}
          cy={0}
          rx={size/2 + 4}
          ry={size/3}
          className="fill-none stroke-twin/30 stroke-1"
          strokeDasharray="6 4"
        />
      )}
    </g>
  );
}

// Camera/Surveillance Icon
function CameraIcon({ variant, status, size = 48 }: Omit<DeviceIconProps, 'type'>) {
  const isPhysical = variant === 'physical';
  const isAttack = status === 'attack';
  const isWarning = status === 'warning';
  
  return (
    <g>
      {/* Camera body */}
      <rect
        x={-size/3}
        y={-size/4}
        width={size/1.8}
        height={size/2.2}
        rx={isPhysical ? 3 : 6}
        className={cn(
          isPhysical ? 'fill-physical/20 stroke-physical stroke-2' : 'fill-twin/10 stroke-twin stroke-[1.5]'
        )}
        strokeDasharray={isPhysical ? undefined : "4 2"}
      />
      
      {/* Lens */}
      <circle
        cx={size/6}
        cy={0}
        r={size/5}
        className={cn(
          isPhysical ? 'fill-background stroke-physical stroke-2' : 'fill-twin/5 stroke-twin stroke-[1.5]'
        )}
        strokeDasharray={isPhysical ? undefined : "3 2"}
      />
      
      {/* Inner lens */}
      <circle
        cx={size/6}
        cy={0}
        r={size/8}
        className={cn(
          isPhysical ? 'fill-physical/40' : 'fill-twin/20'
        )}
      />
      
      {/* Mount */}
      <rect
        x={-size/3 - 6}
        y={-4}
        width={8}
        height={8}
        className={cn(
          isPhysical ? 'fill-physical/30 stroke-physical' : 'fill-twin/15 stroke-twin',
          'stroke-1'
        )}
        strokeDasharray={isPhysical ? undefined : "2 2"}
      />
      
      {/* Status LED */}
      <circle
        cx={-size/3 + 6}
        cy={-size/4 + 6}
        r={3}
        className={cn(
          isAttack ? 'fill-destructive animate-pulse' :
          isWarning ? 'fill-warning' : 'fill-success'
        )}
      />
      
      {/* Recording indicator for attack */}
      {isAttack && isPhysical && (
        <circle
          cx={size/6}
          cy={0}
          r={size/5 + 4}
          className="fill-none stroke-destructive stroke-1 animate-ping opacity-50"
        />
      )}
      
      {/* Holographic effect for twin */}
      {!isPhysical && (
        <rect
          x={-size/2}
          y={-size/3}
          width={size}
          height={size/1.5}
          rx={8}
          className="fill-none stroke-twin/20 stroke-1"
          strokeDasharray="8 4"
        />
      )}
    </g>
  );
}

// Sensor Icon
function SensorIcon({ variant, status, size = 48 }: Omit<DeviceIconProps, 'type'>) {
  const isPhysical = variant === 'physical';
  const isAttack = status === 'attack';
  const isWarning = status === 'warning';
  
  return (
    <g>
      {/* Sensor body - hexagonal shape */}
      <polygon
        points={`0,${-size/2.5} ${size/3},${-size/5} ${size/3},${size/5} 0,${size/2.5} ${-size/3},${size/5} ${-size/3},${-size/5}`}
        className={cn(
          isPhysical ? 'fill-physical/20 stroke-physical stroke-2' : 'fill-twin/10 stroke-twin stroke-[1.5]'
        )}
        strokeDasharray={isPhysical ? undefined : "4 2"}
      />
      
      {/* Inner sensor element */}
      <circle
        cx={0}
        cy={0}
        r={size/5}
        className={cn(
          isPhysical ? 'fill-physical/30 stroke-physical' : 'fill-twin/15 stroke-twin',
          'stroke-1'
        )}
        strokeDasharray={isPhysical ? undefined : "2 2"}
      />
      
      {/* Sensor waves */}
      <circle
        cx={0}
        cy={0}
        r={size/8}
        className={cn(
          isPhysical ? 'fill-physical/50' : 'fill-twin/30'
        )}
      />
      
      {/* Status LED */}
      <circle
        cx={0}
        cy={-size/3}
        r={3}
        className={cn(
          isAttack ? 'fill-destructive animate-pulse' :
          isWarning ? 'fill-warning' : 'fill-success'
        )}
      />
      
      {/* Detection waves (physical) */}
      {isPhysical && (
        <g className="opacity-30">
          <circle cx={0} cy={0} r={size/3} className="fill-none stroke-physical stroke-1" strokeDasharray="2 4" />
          <circle cx={0} cy={0} r={size/2.2} className="fill-none stroke-physical stroke-1" strokeDasharray="2 6" />
        </g>
      )}
      
      {/* Holographic rings for twin */}
      {!isPhysical && (
        <>
          <circle cx={0} cy={0} r={size/2.5} className="fill-none stroke-twin/30 stroke-1" strokeDasharray="4 4" />
          <circle cx={0} cy={0} r={size/1.8} className="fill-none stroke-twin/20 stroke-1" strokeDasharray="6 6" />
        </>
      )}
    </g>
  );
}

// Gateway Icon
function GatewayIcon({ variant, status, size = 48 }: Omit<DeviceIconProps, 'type'>) {
  const isPhysical = variant === 'physical';
  const isAttack = status === 'attack';
  const isWarning = status === 'warning';
  
  return (
    <g>
      {/* Main chassis */}
      <rect
        x={-size/2.5}
        y={-size/3}
        width={size/1.25}
        height={size/1.5}
        rx={isPhysical ? 4 : 8}
        className={cn(
          isPhysical ? 'fill-physical/20 stroke-physical stroke-2' : 'fill-twin/10 stroke-twin stroke-[1.5]'
        )}
        strokeDasharray={isPhysical ? undefined : "4 2"}
      />
      
      {/* Rack lines */}
      {[0, 1, 2].map(i => (
        <line
          key={i}
          x1={-size/3}
          y1={-size/5 + i * 10}
          x2={size/3}
          y2={-size/5 + i * 10}
          className={cn(
            isPhysical ? 'stroke-physical/40' : 'stroke-twin/30',
            'stroke-1'
          )}
          strokeDasharray={isPhysical ? undefined : "4 2"}
        />
      ))}
      
      {/* Network ports */}
      {[-1, 0, 1].map(i => (
        <rect
          key={i}
          x={-4 + i * 12}
          y={size/5}
          width={6}
          height={4}
          className={cn(
            isPhysical ? 'fill-physical/60' : 'fill-twin/40'
          )}
        />
      ))}
      
      {/* Status LEDs row */}
      <g transform="translate(0, -size/4)">
        <circle cx={-8} cy={0} r={2} className="fill-success" />
        <circle cx={0} cy={0} r={2} className={isAttack ? 'fill-destructive animate-pulse' : 'fill-success'} />
        <circle cx={8} cy={0} r={2} className={isWarning ? 'fill-warning' : 'fill-success'} />
      </g>
      
      {/* Data flow indicator */}
      {isPhysical && (
        <rect
          x={-size/3}
          y={-4}
          width={size/1.5}
          height={8}
          rx={2}
          className={cn(
            isAttack ? 'fill-destructive/30' : 'fill-physical/20'
          )}
        />
      )}
      
      {/* Holographic field for twin */}
      {!isPhysical && (
        <rect
          x={-size/2}
          y={-size/2.5}
          width={size}
          height={size/1.2}
          rx={10}
          className="fill-none stroke-twin/25 stroke-1"
          strokeDasharray="8 4"
        />
      )}
    </g>
  );
}

// Main export - renders appropriate device icon
export default function DeviceIcon({ type, variant, status, size = 48, className }: DeviceIconProps) {
  const iconProps = { variant, status, size };
  
  return (
    <g className={className}>
      {type === 'radar' && <RadarIcon {...iconProps} />}
      {type === 'camera' && <CameraIcon {...iconProps} />}
      {type === 'sensor' && <SensorIcon {...iconProps} />}
      {type === 'gateway' && <GatewayIcon {...iconProps} />}
    </g>
  );
}
