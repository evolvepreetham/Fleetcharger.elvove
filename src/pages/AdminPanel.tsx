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
import { Progress } from '@/components/ui/progress';
import { 
  Building, 
  Zap, 
  TrendingUp, 
  Users,
  Plus,
  Settings,
  BarChart3,
  MapPin,
  Calendar
} from 'lucide-react';

// Mock data for admin dashboard
const adminStats = [
  { title: "Total Companies", value: 12, icon: Building, trend: { value: 15, isPositive: true } },
  { title: "Charging Stations", value: 45, icon: Zap, trend: { value: 8, isPositive: true } },
  { title: "Active Vehicles", value: 234, icon: TrendingUp, trend: { value: 12, isPositive: true } },
  { title: "Total Users", value: 89, icon: Users, trend: { value: 5, isPositive: true } },
];

const companyData = [
  {
    id: 1,
    name: 'VRL Logistics',
    vehicles: 24,
    activeRoutes: 12,
    utilizationRate: 85,
    status: 'active'
  },
  {
    id: 2,
    name: 'Delhivery',
    vehicles: 18,
    activeRoutes: 8,
    utilizationRate: 72,
    status: 'active'
  },
  {
    id: 3,
    name: 'Amazon Logistics',
    vehicles: 32,
    activeRoutes: 16,
    utilizationRate: 91,
    status: 'active'
  },
  {
    id: 4,
    name: 'Blue Dart',
    vehicles: 15,
    activeRoutes: 6,
    utilizationRate: 68,
    status: 'maintenance'
  }
];

// 1. Add Zeon stations to stationData
const stationData = [
  {
    id: 1,
    name: 'Highway Charging Hub',
    location: 'NH4, Khopoli',
    type: '-',
    slots: 8,
    company: '-',
    timeSlot: '-',
    available: 3,
    utilization: 62.5,
    status: 'operational'
  },
  {
    id: 2,
    name: 'ChargePoint Plaza',
    location: 'Mumbai Central',
    type: '-',
    slots: 12,
    company: '-',
    timeSlot: '-',
    available: 7,
    utilization: 41.7,
    status: 'operational'
  },
  {
    id: 3,
    name: 'EV Station Alpha',
    location: 'Pune IT Park',
    type: '-',
    slots: 6,
    company: '-',
    timeSlot: '-',
    available: 0,
    utilization: 100,
    status: 'maintenance'
  },
  {
    id: 4,
    name: 'Green Energy Hub',
    location: 'Bangalore Tech City',
    type: '-',
    slots: 10,
    company: '-',
    timeSlot: '-',
    available: 4,
    utilization: 60,
    status: 'operational'
  },
  // Zeon stations
  {
    id: 5,
    name: 'Zeon Charge Davanagere',
    location: 'Davanagere, Karnataka',
    type: '-',
    slots: 8,
    company: '-',
    timeSlot: '-',
    available: 5,
    utilization: 40,
    status: 'operational'
  },
  {
    id: 6,
    name: 'Zeon Charge Chitradurga',
    location: 'Chitradurga, Karnataka',
    type: '-',
    slots: 6,
    company: '-',
    timeSlot: '-',
    available: 2,
    utilization: 66,
    status: 'operational'
  },
  {
    id: 7,
    name: 'Zeon Charge Tumakuru',
    location: 'Tumakuru, Karnataka',
    type: '-',
    slots: 10,
    company: '-',
    timeSlot: '-',
    available: 7,
    utilization: 30,
    status: 'operational'
  }
];

export default function AdminPanel() {
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  });

  // Move initial station data inside the component
  const initialStations = [
    {
      id: 1,
      name: 'Highway Charging Hub',
      location: 'NH4, Khopoli',
      type: '-',
      slots: 8,
      company: '-',
      timeSlot: '-',
      available: 3,
      utilization: 62.5,
      status: 'operational'
    },
    {
      id: 2,
      name: 'ChargePoint Plaza',
      location: 'Mumbai Central',
      type: '-',
      slots: 12,
      company: '-',
      timeSlot: '-',
      available: 7,
      utilization: 41.7,
      status: 'operational'
    },
    {
      id: 3,
      name: 'EV Station Alpha',
      location: 'Pune IT Park',
      type: '-',
      slots: 6,
      company: '-',
      timeSlot: '-',
      available: 0,
      utilization: 100,
      status: 'maintenance'
    },
    {
      id: 4,
      name: 'Green Energy Hub',
      location: 'Bangalore Tech City',
      type: '-',
      slots: 10,
      company: '-',
      timeSlot: '-',
      available: 4,
      utilization: 60,
      status: 'operational'
    },
    // Zeon stations
    {
      id: 5,
      name: 'Zeon Charge Davanagere',
      location: 'Davanagere, Karnataka',
      type: '-',
      slots: 8,
      company: '-',
      timeSlot: '-',
      available: 5,
      utilization: 40,
      status: 'operational'
    },
    {
      id: 6,
      name: 'Zeon Charge Chitradurga',
      location: 'Chitradurga, Karnataka',
      type: '-',
      slots: 6,
      company: '-',
      timeSlot: '-',
      available: 2,
      utilization: 66,
      status: 'operational'
    },
    {
      id: 7,
      name: 'Zeon Charge Tumakuru',
      location: 'Tumakuru, Karnataka',
      type: '-',
      slots: 10,
      company: '-',
      timeSlot: '-',
      available: 7,
      utilization: 30,
      status: 'operational'
    }
  ];
  const [stations, setStations] = useState(initialStations);
  const [addMsg, setAddMsg] = useState('');
  const [pendingRoutes, setPendingRoutes] = useState(() => {
    const stored = localStorage.getItem('pendingRoutes');
    return stored ? JSON.parse(stored) : [];
  });
  const [scheduledRoutes, setScheduledRoutes] = useState(() => {
    const stored = localStorage.getItem('scheduledRoutes');
    return stored ? JSON.parse(stored) : [];
  });

  // Sync with localStorage for demo persistence
  useEffect(() => {
    localStorage.setItem('pendingRoutes', JSON.stringify(pendingRoutes));
    localStorage.setItem('scheduledRoutes', JSON.stringify(scheduledRoutes));
  }, [pendingRoutes, scheduledRoutes]);

  // Add two trial pending routes for testing
  useEffect(() => {
    if (pendingRoutes.length === 0) {
      const trialRoutes = [
        {
          id: 1001,
          day: 'Thursday',
          driver: 'Test Driver 1',
          route: 'Hubli → Tumakuru',
          time: '09:00 - 17:00',
          vehicleId: 'KA-25-XY-9999',
          vehicleRange: '180 km',
          chargingNeeded: 'Yes',
          station: 'Pending',
          slot: 'Pending',
          status: 'pending',
          company: 'VRL Logistics',
        },
        {
          id: 1002,
          day: 'Friday',
          driver: 'Test Driver 2',
          route: 'Bengaluru → Chitradurga',
          time: '10:00 - 18:00',
          vehicleId: 'KA-25-XY-8888',
          vehicleRange: '200 km',
          chargingNeeded: 'Yes',
          station: 'Pending',
          slot: 'Pending',
          status: 'pending',
          company: 'VRL Logistics',
        }
      ];
      setPendingRoutes(trialRoutes);
    }
  // eslint-disable-next-line
  }, []);

  // Helper: Check if a station is available for a given slot
  function isStationAvailable(stationName, slot) {
    // Check both scheduledRoutes and existing schedule data
    const allScheduled = [
      ...scheduledRoutes,
      // Add existing schedule data to prevent conflicts
      {
        id: 1, day: 'Monday', station: 'Zeon Charge Davanagere', slot: '11:00 - 12:00', status: 'scheduled'
      },
      {
        id: 2, day: 'Tuesday', station: 'Zeon Charge Chitradurga', slot: '12:30 - 13:30', status: 'scheduled'
      },
      {
        id: 3, day: 'Wednesday', station: 'Zeon Charge Tumakuru', slot: '10:00 - 11:00', status: 'scheduled'
      }
    ];
    
    return !allScheduled.some(r => r.station === stationName && r.slot === slot);
  }

  // Helper: Find the best available station and slot
  function assignBestStationAndSlot(route) {
    // Assign based on vehicle range
    let preferredStation = null;
    const range = parseInt(route.vehicleRange);
    
    if (range <= 250) {
      preferredStation = stations.find(s => s.name === 'Zeon Charge Davanagere' && s.available > 0 && s.status === 'operational');
    } else if (range <= 300) {
      preferredStation = stations.find(s => s.name === 'Zeon Charge Tumakuru' && s.available > 0 && s.status === 'operational');
    }
    
    // If preferred station not available, fall back to any available station
    if (!preferredStation) {
      preferredStation = stations.find(s => s.available > 0 && s.status === 'operational');
    }
    
    if (!preferredStation) {
      return { station: 'No Available Station', slot: 'No Slot' };
    }
    
    // Try slots in 1-hour increments, avoiding conflicts
    const possibleSlots = [
      '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00',
      '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'
    ];
    
    for (const slot of possibleSlots) {
      if (isStationAvailable(preferredStation.name, slot)) {
        return { station: preferredStation.name, slot };
      }
    }
    
    // If preferred station is full, try other stations
    const otherStations = stations.filter(s => s.available > 0 && s.status === 'operational' && s.name !== preferredStation.name);
    for (const station of otherStations) {
      for (const slot of possibleSlots) {
        if (isStationAvailable(station.name, slot)) {
          return { station: station.name, slot };
        }
      }
    }
    
    return { station: preferredStation.name, slot: 'No Available Slot' };
  }

  const handleSchedule = (routeId) => {
    const route = pendingRoutes.find(r => r.id === routeId);
    const { station, slot } = assignBestStationAndSlot(route);
    setPendingRoutes(prev => prev.filter(r => r.id !== routeId));
    setScheduledRoutes(prev => [
      ...prev,
      { ...route, status: 'scheduled', station, slot }
    ]);
  };

  const getCompanyStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <StatusBadge status="success" text="Active" />;
      case 'maintenance':
        return <StatusBadge status="warning" text="Maintenance" />;
      case 'inactive':
        return <StatusBadge status="error" text="Inactive" />;
      default:
        return <StatusBadge status="info" text="Unknown" />;
    }
  };

  const getStationStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <StatusBadge status="success" text="Operational" />;
      case 'maintenance':
        return <StatusBadge status="warning" text="Maintenance" />;
      case 'offline':
        return <StatusBadge status="error" text="Offline" />;
      default:
        return <StatusBadge status="info" text="Unknown" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={currentUser} title="Admin Panel" />
      
      <div className="container-padding py-6">
        <PageHeader 
          title="System Overview"
          description="Monitor and manage the entire EV fleet charging network"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Station
              </Button>
            </div>
          }
        />

        {/* Admin Stats */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
        >
          {adminStats.map((stat, index) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="companies" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="companies">Companies</TabsTrigger>
              <TabsTrigger value="stations">Charging Stations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="system">System Health</TabsTrigger>
              <TabsTrigger value="fleet">Fleet Management</TabsTrigger>
              <TabsTrigger value="pending">Pending Routes</TabsTrigger>
            </TabsList>

            {/* Companies Tab */}
            <TabsContent value="companies" className="space-y-6">
              <Card className="ev-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Company Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor fleet performance across all companies
                    </p>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                  </Button>
                </div>

                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="table-sticky-header">
                        <TableHead>Company</TableHead>
                        <TableHead>Vehicles</TableHead>
                        <TableHead>Active Routes</TableHead>
                        <TableHead>Utilization</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companyData.map((company) => (
                        <TableRow key={company.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>{company.vehicles}</TableCell>
                          <TableCell>{company.activeRoutes}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={company.utilizationRate} className="w-16 h-2" />
                              <span className="text-sm font-medium">{company.utilizationRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getCompanyStatusBadge(company.status)}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            {/* Charging Stations Tab */}
            <TabsContent value="stations" className="space-y-6">
              <Card className="ev-card p-6">
                <button style={{background: 'yellow', color: 'black', fontWeight: 'bold', marginBottom: 8, padding: 8, border: '2px solid orange'}} onClick={() => alert('Test button works!')}>TEST BUTTON (should be clickable)</button>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Charging Station Network</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage charging infrastructure and monitor utilization
                    </p>
                  </div>
                </div>

                {/* Always show Add Station form for debugging */}
                <div className="mb-4">
                  <AddStationForm
                    onAdd={station => {
                      setStations(prev => {
                        const newStation = { ...station, id: prev.length + 1, available: station.slots, utilization: 0, status: 'operational' };
                        setAddMsg('Station added: ' + newStation.name);
                        return [...prev, newStation];
                      });
                    }}
                  />
                  {addMsg && <div className="text-green-700 font-bold mt-2">{addMsg}</div>}
                </div>
                <div className="mb-2 text-blue-700 font-bold">Total stations: {stations.length}</div>

                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="table-sticky-header">
                        <TableHead>Station Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Slots</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Time Slot</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Utilization</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stations.map((station) => (
                        <TableRow key={station.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{station.name || '-'}</TableCell>
                          <TableCell className="text-sm">{station.location || '-'}</TableCell>
                          <TableCell>{station.type || '-'}</TableCell>
                          <TableCell>{station.slots || '-'}</TableCell>
                          <TableCell>{station.company || '-'}</TableCell>
                          <TableCell>{station.timeSlot || '-'}</TableCell>
                          <TableCell>
                            <span className={station.available === 0 ? 'text-destructive font-medium' : 'text-success font-medium'}>
                              {station.available || '-'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={station.utilization || 0} 
                                className="w-16 h-2" 
                              />
                              <span className="text-sm font-medium">{station.utilization || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStationStatusBadge(station.status || '-')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <MapPin className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card className="ev-card p-8">
                <h3 className="text-lg font-semibold mb-4">Analytics Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">128</div>
                    <div className="text-muted-foreground">Charging Sessions (24h)</div>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">15</div>
                    <div className="text-muted-foreground">Routes Optimized</div>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-muted-foreground">System Uptime</div>
                  </div>
                </div>
                <div className="text-center text-muted-foreground">More analytics coming soon...</div>
              </Card>
            </TabsContent>

            {/* System Health Tab */}
            <TabsContent value="system">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="ev-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-success/10">
                      <TrendingUp className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold">System Performance</h3>
                      <p className="text-sm text-muted-foreground">All systems operational</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Response Time</span>
                      <span className="text-sm font-medium text-success">125ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database Performance</span>
                      <span className="text-sm font-medium text-success">Excellent</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Uptime</span>
                      <span className="text-sm font-medium text-success">99.9%</span>
                    </div>
                  </div>
                </Card>

                <Card className="ev-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-info/10">
                      <Calendar className="h-5 w-5 text-info" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Recent Activity</h3>
                      <p className="text-sm text-muted-foreground">Last 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium">128</span> charging sessions completed
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">3</span> new companies registered
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">15</span> routes optimized
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">2</span> stations maintenance completed
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Fleet Management Tab */}
            <TabsContent value="fleet" className="space-y-6">
              <Card className="ev-card p-6">
                <h3 className="text-lg font-semibold mb-4">Add Assignment</h3>
                <AssignmentForm />
              </Card>
            </TabsContent>

            {/* Pending Routes Tab */}
            <TabsContent value="pending" className="space-y-6">
              <Card className="ev-card p-6">
                <h3 className="text-lg font-semibold mb-4">Pending Route Approvals</h3>
                {pendingRoutes.length === 0 ? (
                  <div className="text-muted-foreground">No pending routes.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Range</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRoutes.map(route => (
                        <TableRow key={route.id}>
                          <TableCell>{route.day}</TableCell>
                          <TableCell>{route.driver}</TableCell>
                          <TableCell>{route.route}</TableCell>
                          <TableCell>{route.time}</TableCell>
                          <TableCell>{route.vehicleId}</TableCell>
                          <TableCell>{route.vehicleRange}</TableCell>
                          <TableCell><StatusBadge status="warning" text="Pending" /></TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => handleSchedule(route.id)}>
                              Schedule
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

// Add AssignmentForm component at the bottom of the file
function AssignmentForm() {
  const [driver, setDriver] = useState('');
  const [route, setRoute] = useState('');
  const [time, setTime] = useState('');
  const [range, setRange] = useState('');
  const [assignedStation, setAssignedStation] = useState(null);
  const [pending, setPending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleAssign = (e) => {
    e.preventDefault();
    // Simple logic: assign first available station
    const availableStation = stationData.find(s => s.available > 0 && s.status === 'operational');
    setAssignedStation(availableStation);
    setPending(true);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setPending(false);
  };

  if (confirmed) {
    return (
      <div className="p-4 bg-success/10 rounded-lg text-success font-semibold text-center">
        Assignment confirmed and saved!
      </div>
    );
  }

  return (
    <form onSubmit={handleAssign} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs mb-1">Driver</label>
          <input className="input" value={driver} onChange={e => setDriver(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs mb-1">Route</label>
          <input className="input" value={route} onChange={e => setRoute(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs mb-1">Time</label>
          <input className="input" value={time} onChange={e => setTime(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs mb-1">Vehicle Range</label>
          <input className="input" value={range} onChange={e => setRange(e.target.value)} required />
        </div>
      </div>
      {!pending && (
        <button type="submit" className="btn btn-primary mt-4">Assign Charging Station</button>
      )}
      {pending && assignedStation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="mb-2">Assigned Charging Station: <strong>{assignedStation.name}</strong> ({assignedStation.location})</div>
          <button type="button" className="btn btn-success" onClick={handleConfirm}>Confirm Assignment</button>
        </div>
      )}
    </form>
  );
}

// AddStationForm component
function AddStationForm({ onAdd }) {
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [slots, setSlots] = useState('');
  const [company, setCompany] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !location || !type || !slots || !company || !timeSlot) {
      setError('All fields are required!');
      return;
    }
    setError('');
    onAdd({
      name: name || '-',
      location: location || '-',
      type: type || '-',
      slots: Number(slots) || 0,
      company: company || '-',
      timeSlot: timeSlot || '-'
    });
    setName('');
    setLocation('');
    setType('');
    setSlots('');
    setCompany('');
    setTimeSlot('');
  };

  return (
    <form onSubmit={handleSubmit} tabIndex={0} style={{border: '3px solid red', background: '#fffbe6', padding: 16, marginBottom: 24}} className="mb-6 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <div>
        <label className="block text-xs mb-1">Station Name</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-xs mb-1">Location</label>
        <input className="input" value={location} onChange={e => setLocation(e.target.value)} required />
      </div>
      <div>
        <label className="block text-xs mb-1">Type of Charger</label>
        <input className="input" value={type} onChange={e => setType(e.target.value)} required />
      </div>
      <div>
        <label className="block text-xs mb-1">Slots</label>
        <input className="input" type="number" min="1" value={slots} onChange={e => setSlots(e.target.value)} required />
      </div>
      <div>
        <label className="block text-xs mb-1">Company</label>
        <input className="input" value={company} onChange={e => setCompany(e.target.value)} required />
      </div>
      <div>
        <label className="block text-xs mb-1">Time Slot Available For</label>
        <input className="input" value={timeSlot} onChange={e => setTimeSlot(e.target.value)} required />
      </div>
      <div className="flex gap-2">
        <button type="submit" tabIndex={0} className="btn btn-primary">Add</button>
      </div>
      {error && <div style={{color: 'red', fontWeight: 'bold', marginTop: 8}}>{error}</div>}
    </form>
  );
}