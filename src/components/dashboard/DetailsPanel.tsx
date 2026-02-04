import { useDashboard } from '@/context/DashboardContext';
import PhysicalDeviceDetails from './details/PhysicalDeviceDetails';
import DigitalTwinDetails from './details/DigitalTwinDetails';
import SyncDetails from './details/SyncDetails';
import IntelligenceDetails from './details/IntelligenceDetails';

export default function DetailsPanel() {
  const { state } = useDashboard();
  const { currentStage, selectedDeviceId, selectedTwinId, devices, twins } = state;

  const selectedDevice = selectedDeviceId 
    ? devices.find(d => d.id === selectedDeviceId) 
    : null;
  
  const selectedTwin = selectedTwinId 
    ? twins.find(t => t.id === selectedTwinId)
    : selectedDevice 
    ? twins.find(t => t.physicalDeviceId === selectedDevice.id)
    : null;

  const renderContent = () => {
    switch (currentStage) {
      case 'network-discovery':
        return selectedDevice 
          ? <PhysicalDeviceDetails device={selectedDevice} />
          : <EmptyState message="Select a physical device to view details" />;
      
      case 'digital-twin-creation':
        if (!state.twinCreationComplete) {
          return <EmptyState message="Create digital twins to view twin details" />;
        }
        return selectedTwin 
          ? <DigitalTwinDetails twin={selectedTwin} device={devices.find(d => d.id === selectedTwin.physicalDeviceId)!} />
          : <EmptyState message="Select a digital twin to view details" />;
      
      case 'synchronization':
        if (selectedDevice || selectedTwin) {
          const device = selectedDevice || devices.find(d => d.id === selectedTwin?.physicalDeviceId);
          const twin = selectedTwin || twins.find(t => t.physicalDeviceId === selectedDevice?.id);
          if (device && twin) {
            return <SyncDetails device={device} twin={twin} />;
          }
        }
        return <EmptyState message="Select a device or twin to view sync status" />;
      
      case 'intelligence':
        return <IntelligenceDetails />;
      
      default:
        return <EmptyState message="Select a stage from the menu" />;
    }
  };

  return (
    <aside className="w-80 bg-card border-l border-border flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Details Panel</h3>
        <p className="text-xs text-muted-foreground mt-1 capitalize">
          {currentStage.replace(/-/g, ' ')}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </aside>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <p className="text-sm text-muted-foreground text-center">{message}</p>
    </div>
  );
}
