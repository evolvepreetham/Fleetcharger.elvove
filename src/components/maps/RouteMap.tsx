import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Navigation, 
  MapPin, 
  Zap, 
  Clock,
  Battery,
  Route
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteMapProps {
  route: {
    start: { name: string; lat: number; lng: number };
    end: { name: string; lat: number; lng: number };
    chargingStations?: { name: string; lat: number; lng: number; available: boolean }[];
  };
  className?: string;
  assignedStationName?: string; // NEW: name of the assigned charging station
}

export function RouteMap({ route, className, assignedStationName }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [route.start.lat, route.start.lng],
      zoom: 8,
      zoomControl: false,
    });

    // Add tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Create custom icons
    const startIcon = L.divIcon({
      className: 'custom-marker start-marker',
      html: '<div class="w-6 h-6 bg-primary rounded-full border-2 border-background shadow-lg flex items-center justify-center"><div class="w-2 h-2 bg-background rounded-full"></div></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const endIcon = L.divIcon({
      className: 'custom-marker end-marker',
      html: '<div class="w-6 h-6 bg-destructive rounded-full border-2 border-background shadow-lg flex items-center justify-center"><div class="w-2 h-2 bg-background rounded-full"></div></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const chargingIcon = L.divIcon({
      className: 'custom-marker charging-marker',
      html: '<div class="w-8 h-8 bg-warning rounded-full border-2 border-background shadow-lg flex items-center justify-center text-background"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path></svg></div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // NEW: Highlighted icon for assigned station
    const assignedChargingIcon = L.divIcon({
      className: 'custom-marker assigned-charging-marker',
      html: '<div class="w-8 h-8 bg-primary rounded-full border-4 border-yellow-400 shadow-lg flex items-center justify-center text-background"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path></svg></div>',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    // Add markers
    const startMarker = L.marker([route.start.lat, route.start.lng], { icon: startIcon })
      .addTo(map)
      .bindPopup(`<b>Start:</b> ${route.start.name}`);

    const endMarker = L.marker([route.end.lat, route.end.lng], { icon: endIcon })
      .addTo(map)
      .bindPopup(`<b>Destination:</b> ${route.end.name}`);

    // Add charging stations if provided
    if (route.chargingStations) {
      route.chargingStations.forEach(station => {
        const isAssigned = assignedStationName && station.name === assignedStationName;
        const marker = L.marker([station.lat, station.lng], { icon: isAssigned ? assignedChargingIcon : chargingIcon })
          .addTo(map)
          .bindPopup(`
            <b>${station.name}</b><br/>
            Status: ${station.available ? 'Available' : 'Occupied'}
            ${isAssigned ? '<br/><b>Assigned Station</b>' : ''}
          `);
      });
    }

    // Draw route line through charging stations
    type LatLngTuple = [number, number];
    const routePoints: LatLngTuple[] = [
      [route.start.lat, route.start.lng],
      ...((route.chargingStations?.map(s => [s.lat, s.lng]) as LatLngTuple[]) || []),
      [route.end.lat, route.end.lng],
    ];
    const routeLine = L.polyline(routePoints as LatLngTuple[], {
      color: 'hsl(142, 71%, 45%)',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 5',
    }).addTo(map);

    // Fit map to show all markers
    const group = new L.FeatureGroup([startMarker, endMarker, routeLine]);
    map.fitBounds(group.getBounds().pad(0.1));

    mapInstance.current = map;

    return () => {
      map.remove();
    };
  }, [route, assignedStationName]);

  const handleNavigation = () => {
    // Only use the assigned charging station as a waypoint
    let waypoints = '';
    if (assignedStationName && route.chargingStations) {
      const assigned = route.chargingStations.find(s => s.name === assignedStationName);
      if (assigned) {
        waypoints = `/${assigned.lat},${assigned.lng}`;
      }
    }
    const url = `https://www.google.com/maps/dir/${route.start.lat},${route.start.lng}${waypoints}/${route.end.lat},${route.end.lng}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="ev-card overflow-hidden">
        {/* Map Header */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Route className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Route Overview</h3>
                <p className="text-xs text-muted-foreground">
                  {route.start.name} → {route.end.name}
                </p>
              </div>
            </div>
            
            <Button 
              size="sm" 
              onClick={handleNavigation}
              className="gap-2"
            >
              <Navigation className="h-4 w-4" />
              Navigate
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div ref={mapRef} className="h-64 sm:h-80 w-full" />
          
          {/* Map Overlay Info */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
            <StatusBadge status="location" text={route.start.name} />
            <StatusBadge status="charging" text="1 Station Available" />
            <StatusBadge status="battery" text="85% Range" />
          </div>
        </div>

        {/* Route Details */}
        <div className="p-4 border-t bg-muted/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Duration
              </div>
              <p className="text-lg font-bold text-foreground">2h 45m</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Distance
              </div>
              <p className="text-lg font-bold text-foreground">185 km</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-sm font-medium text-muted-foreground">
                <Battery className="h-4 w-4" />
                Range Left
              </div>
              <p className="text-lg font-bold text-success">45%</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}