import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatsCard } from '@/components/ui/stats-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { RouteMap } from '@/components/maps/RouteMap';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Battery,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock driver data
const driverStats = [
  { title: "Today's Route", value: "Hubli → Bengaluru", icon: MapPin },
  { title: "Departure Time", value: "07:00 AM", icon: Clock },
  { title: "Battery Level", value: "200 km", icon: Battery },
  { title: "Charging Stop", value: "Davanagere (Zeon Charge)", icon: Zap },
];

const routeData = {
  start: { name: 'Hubli', lat: 15.3647, lng: 75.1240 },
  end: { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  chargingStations: [
    { name: 'Zeon Charge Davanagere', lat: 14.4758, lng: 75.9116, available: true },
    { name: 'Zeon Charge Tumakuru', lat: 13.3506, lng: 77.1006, available: true },
    { name: 'Zeon Charge Chitradurga', lat: 14.2344, lng: 76.4093, available: true }
  ]
};

const chargingInfo = {
  station: 'Zeon Charge Davanagere',
  slot: '11:00 - 12:00',
  location: 'Davanagere, Karnataka',
  chargerType: 'DC',
  expectedTime: '45 minutes',
  cost: '₹280',
};

export default function DriverPortal() {
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  });
  const { toast } = useToast();

  const handleStartTrip = () => {
    toast({
      title: "Trip Started",
      description: "Have a safe journey! Navigation is now active.",
    });
  };

  const handleEmergency = () => {
    toast({
      title: "Emergency Alert Sent",
      description: "Your fleet manager has been notified.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={currentUser} title="Driver Portal" />
      
      <div className="container-padding py-6">
        <PageHeader 
          title="Today's Assignment"
          description="Your route and charging schedule for today"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleEmergency}>
                <Phone className="h-4 w-4 mr-2" />
                Emergency
              </Button>
              <Button size="sm" onClick={handleStartTrip}>
                <Navigation className="h-4 w-4 mr-2" />
                Start Trip
              </Button>
            </div>
          }
        />

        {/* Driver Stats */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
        >
          {driverStats.map((stat, index) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Route Map */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-2"
          >
            <RouteMap route={routeData} assignedStationName={chargingInfo.station} />
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Vehicle Status */}
            <Card className="ev-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Battery className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Vehicle Status</h3>
                  <p className="text-sm text-muted-foreground">MH-01-AB-1234</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Range</span>
                  <span className="text-sm font-medium">250 km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status</span>
                  <StatusBadge status="success" text="Ready" />
                </div>
              </div>
            </Card>

            {/* Charging Information */}
            <Card className="ev-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Zap className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold">Charging Stop</h3>
                  <p className="text-sm text-muted-foreground">Scheduled for today</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Time Slot</label>
                  <p className="font-medium font-mono">{chargingInfo.slot}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Duration</label>
                    <p className="text-sm font-medium">{chargingInfo.expectedTime}</p>
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => {
                    // Find the station in routeData by name
                    const station = routeData.chargingStations.find(
                      s => s.name === chargingInfo.station
                    );
                    if (station) {
                      const url = `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`;
                      window.open(url, '_blank');
                    } else {
                      // fallback to address if not found
                      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(chargingInfo.location)}`;
                      window.open(url, '_blank');
                    }
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Navigate to Station
                </Button>
              </div>
            </Card>

            {/* Emergency Charger Allotment */}
            <Card className="ev-card p-6 border-blue-300/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700">Emergency Charger Allotment</h3>
                  <p className="text-sm text-muted-foreground">For urgent charging needs</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Time Slot</label>
                  <p className="font-mono font-medium">Available Now</p>
                </div>
                <Button
                  className="w-full mt-4"
                  variant="default"
                  onClick={() => {
                    // Simulate request action
                    toast({
                      title: "Emergency Charger Requested",
                      description: "Your request for an emergency charger has been sent.",
                      variant: "default"
                    });
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Request Emergency Charger
                </Button>
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card className="ev-card p-6 border-destructive/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-destructive">Emergency</h3>
                  <p className="text-sm text-muted-foreground">24/7 support available</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm">Fleet Manager: <strong>+91 98765 43210</strong></p>
                <p className="text-sm">Emergency: <strong>1800-EV-HELP</strong></p>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={handleEmergency}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Call
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}