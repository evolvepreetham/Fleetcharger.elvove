import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatsCard } from '@/components/ui/stats-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Truck, 
  Users, 
  Zap, 
  MapPin,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

// Mock data
const stats = [
  { title: "Active Vehicles", value: 24, icon: Truck, trend: { value: 12, isPositive: true } },
  { title: "Available Drivers", value: 18, icon: Users, trend: { value: 5, isPositive: true } },
  { title: "Charging Sessions", value: 8, icon: Zap, trend: { value: 3, isPositive: false } },
  { title: "Active Routes", value: 12, icon: MapPin, trend: { value: 8, isPositive: true } },
];

const scheduleData = [
  {
    id: 1,
    day: 'Monday',
    driver: 'Suresh Shetty',
    route: 'Hubli → Bengaluru',
    time: '07:00 - 15:00',
    chargingNeeded: 'Yes',
    station: 'Zeon Charge Davanagere',
    slot: '11:00 - 12:00',
    status: 'scheduled',
    vehicleId: 'KA-25-XY-7890',
    vehicleRange: '200 km',
    company: 'VRL Logistics'
  },
  {
    id: 2,
    day: 'Tuesday',
    driver: 'Priya Singh',
    route: 'Hubli → Mysuru',
    time: '08:00 - 16:00',
    chargingNeeded: 'Yes',
    station: 'Zeon Charge Chitradurga',
    slot: '12:30 - 13:30',
    status: 'scheduled',
    vehicleId: 'KA-25-XY-7891',
    vehicleRange: '200 km',
    company: 'VRL Logistics'
  },
  {
    id: 3,
    day: 'Wednesday',
    driver: 'Amit Patel',
    route: 'Bengaluru → Belagavi',
    time: '06:00 - 14:00',
    chargingNeeded: 'Yes',
    station: 'Zeon Charge Tumakuru',
    slot: '10:00 - 11:00',
    status: 'scheduled',
    vehicleId: 'KA-25-XY-7892',
    vehicleRange: '200 km',
    company: 'VRL Logistics'
  }
];

export default function CompanyPortal() {
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  });

  const [selectedWeek, setSelectedWeek] = useState('current');
  const [selectedDriver, setSelectedDriver] = useState('all');
  const [schedule, setSchedule] = useState(scheduleData);
  const [newRoute, setNewRoute] = useState({
    day: '',
    driver: '',
    route: '',
    time: '',
    vehicleId: '',
    vehicleRange: '',
    chargingNeeded: 'Yes',
    station: 'Pending',
    slot: 'Pending',
    status: 'pending',
    company: 'VRL Logistics',
  });
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [pendingNotification, setPendingNotification] = useState(false);

  // Add useEffect to sync scheduled routes from localStorage
  useEffect(() => {
    const scheduledRoutes = JSON.parse(localStorage.getItem('scheduledRoutes') || '[]');
    setSchedule(prev => {
      // Merge scheduled routes that are not already in prev
      const existingIds = new Set(prev.map(r => r.id));
      const merged = [...prev];
      scheduledRoutes.forEach(r => {
        if (!existingIds.has(r.id)) merged.push(r);
        else {
          // If already exists, update status/station/slot if changed
          const idx = merged.findIndex(x => x.id === r.id);
          if (idx !== -1) merged[idx] = { ...merged[idx], ...r };
        }
      });
      return merged;
    });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <StatusBadge status="success" text="Scheduled" />;
      case 'sufficient':
        return <StatusBadge status="info" text="Range OK" />;
      case 'critical':
        return <StatusBadge status="error" text="Critical" />;
      default:
        return <StatusBadge status="warning" text="Pending" />;
    }
  };

  const handleAddRoute = () => {
    const newPendingRoute = { ...newRoute, id: schedule.length + 1, status: 'pending', station: 'Pending', slot: 'Pending' };
    setSchedule(prev => [
      ...prev,
      newPendingRoute
    ]);
    // Sync to localStorage for admin
    const pendingRoutes = JSON.parse(localStorage.getItem('pendingRoutes') || '[]');
    localStorage.setItem('pendingRoutes', JSON.stringify([...pendingRoutes, newPendingRoute]));
    setShowAddRoute(false);
    setPendingNotification(true); // Simulate notification to admin
    setNewRoute({
      day: '', driver: '', route: '', time: '', vehicleId: '', vehicleRange: '', chargingNeeded: 'Yes', station: 'Pending', slot: 'Pending', status: 'pending', company: 'VRL Logistics'
    });
  };

  // Add delete route function
  const handleDeleteRoute = (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      setSchedule(prev => prev.filter(r => r.id !== routeId));
      
      // Remove from pendingRoutes localStorage
      const pendingRoutes = JSON.parse(localStorage.getItem('pendingRoutes') || '[]');
      const updatedPending = pendingRoutes.filter(r => r.id !== routeId);
      localStorage.setItem('pendingRoutes', JSON.stringify(updatedPending));
      
      // Remove from scheduledRoutes localStorage
      const scheduledRoutes = JSON.parse(localStorage.getItem('scheduledRoutes') || '[]');
      const updatedScheduled = scheduledRoutes.filter(r => r.id !== routeId);
      localStorage.setItem('scheduledRoutes', JSON.stringify(updatedScheduled));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={currentUser} />
      
      <div className="container-padding py-6">
        <PageHeader 
          title="Fleet Dashboard"
          description="Monitor and manage your electric vehicle fleet"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          }
        />

        {/* Stats Overview */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="schedule" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
              <TabsTrigger value="fleet">Fleet Status</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="stations">Charging Stations</TabsTrigger>
            </TabsList>

            {/* Weekly Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <Card className="ev-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Weekly Schedule</h3>
                    <p className="text-sm text-muted-foreground">
                      Optimize charging and route assignments
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                      <SelectTrigger className="w-32">
                        <Calendar className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">This Week</SelectItem>
                        <SelectItem value="next">Next Week</SelectItem>
                        <SelectItem value="prev">Last Week</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                      <SelectTrigger className="w-36">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Drivers</SelectItem>
                        <SelectItem value="rajesh">Rajesh Kumar</SelectItem>
                        <SelectItem value="priya">Priya Singh</SelectItem>
                        <SelectItem value="amit">Amit Patel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={() => setShowAddRoute(true)} size="sm" className="mb-4">Add New Route</Button>
                {showAddRoute && (
                  <Card className="p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input placeholder="Day" value={newRoute.day} onChange={e => setNewRoute({ ...newRoute, day: e.target.value })} className="input" />
                      <input placeholder="Driver" value={newRoute.driver} onChange={e => setNewRoute({ ...newRoute, driver: e.target.value })} className="input" />
                      <input placeholder="Route" value={newRoute.route} onChange={e => setNewRoute({ ...newRoute, route: e.target.value })} className="input" />
                      <input placeholder="Time" value={newRoute.time} onChange={e => setNewRoute({ ...newRoute, time: e.target.value })} className="input" />
                      <input placeholder="Vehicle ID" value={newRoute.vehicleId} onChange={e => setNewRoute({ ...newRoute, vehicleId: e.target.value })} className="input" />
                      <input placeholder="Vehicle Range" value={newRoute.vehicleRange} onChange={e => setNewRoute({ ...newRoute, vehicleRange: e.target.value })} className="input" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleAddRoute} size="sm">Submit</Button>
                      <Button onClick={() => setShowAddRoute(false)} size="sm" variant="outline">Cancel</Button>
                      <Button onClick={() => setNewRoute({
                        day: 'Monday',
                        driver: 'Test Driver',
                        route: 'Hubli → Bengaluru',
                        time: '09:00 - 17:00',
                        vehicleId: 'KA-25-XY-7777',
                        vehicleRange: '200 km',
                        chargingNeeded: 'Yes',
                        station: 'Pending',
                        slot: 'Pending',
                        status: 'pending',
                        company: 'VRL Logistics',
                      })} size="sm" variant="secondary">Test Add</Button>
                    </div>
                  </Card>
                )}
                {pendingNotification && (
                  <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-2">New route pending admin approval!</div>
                )}

                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="table-sticky-header">
                        <TableHead>Day</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Charging</TableHead>
                        <TableHead>Station</TableHead>
                        <TableHead>Slot</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedule.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{item.day}</TableCell>
                          <TableCell>{item.driver}</TableCell>
                          <TableCell className="font-mono text-sm">{item.route}</TableCell>
                          <TableCell className="text-sm">{item.time}</TableCell>
                          <TableCell className="font-mono text-xs">{item.vehicleId}</TableCell>
                          <TableCell>
                            <span className={item.chargingNeeded === 'Yes' ? 'text-warning font-medium' : 'text-muted-foreground'}>
                              {item.chargingNeeded}
                            </span>
                          </TableCell>
                          <TableCell>
                            {item.station === 'Pending' ? (
                              <span className="text-destructive">Pending</span>
                            ) : item.station === '-' ? (
                              <span className="text-muted-foreground">-</span>
                            ) : (
                              <span className="text-sm">{item.station}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.slot === 'Pending' ? (
                              <span className="text-destructive">Pending</span>
                            ) : item.slot === '-' ? (
                              <span className="text-muted-foreground">-</span>
                            ) : (
                              <span className="text-sm font-mono">{item.slot}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(item.status)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteRoute(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            {/* Placeholder tabs */}
            <TabsContent value="fleet">
              <Card className="ev-card p-8 text-center">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Fleet Status</h3>
                <p className="text-muted-foreground">Fleet management features coming soon</p>
              </Card>
            </TabsContent>

            <TabsContent value="drivers">
              <Card className="ev-card p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Driver Management</h3>
                <p className="text-muted-foreground">Driver portal features coming soon</p>
              </Card>
            </TabsContent>

            <TabsContent value="stations">
              <Card className="ev-card p-8 text-center">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Charging Stations</h3>
                <p className="text-muted-foreground">Station management features coming soon</p>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}