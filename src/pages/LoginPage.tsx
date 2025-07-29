import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Truck, 
  Zap, 
  MapPin, 
  BarChart3,
  ArrowRight 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/ev-hero-bg.jpg';

const companies = [
  { id: 'vrl', name: 'VRL Logistics', type: 'company' },
];

const demoUsers = [
  { id: 'admin', name: 'Admin User', role: 'admin', company: null },
  { id: 'manager', name: 'Fleet Manager', role: 'manager', company: 'VRL Logistics' },
  { id: 'driver', name: 'Suresh Shetty', role: 'driver', company: 'VRL Logistics' },
  { id: 'driver2', name: 'Priya Singh', role: 'driver', company: 'VRL Logistics' },
  { id: 'driver3', name: 'Amit Patel', role: 'driver', company: 'VRL Logistics' },
  { id: 'station', name: 'Station Demo', role: 'station', company: null }, // Added station demo user
];

export default function LoginPage() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = () => {
    if (!selectedUser) {
      toast({
        title: "Please select a user",
        description: "Choose a demo user to continue",
        variant: "destructive"
      });
      return;
    }

    const user = demoUsers.find(u => u.id === selectedUser);
    if (!user) return;

    // Store user info for the session
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Navigate based on role
    switch (user.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'manager':
        navigate('/company');
        break;
      case 'driver':
        navigate('/driver');
        break;
      case 'station':
        navigate('/station-dashboard'); // Route to the new dashboard
        break;
      default:
        navigate('/company');
    }

    toast({
      title: "Login successful!",
      description: `Welcome ${user.name}`,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-background/90"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Hero Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">EV Fleet Manager</h1>
                <p className="text-muted-foreground">Smart charging for logistics</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-balance leading-tight">
              Optimize your <span className="text-primary">electric fleet</span> charging schedule
            </h2>
            
            <p className="text-xl text-muted-foreground text-balance">
              Intelligent route planning and charging optimization for modern logistics companies.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="ev-card p-4"
            >
              <Zap className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold text-sm">Smart Charging</h3>
              <p className="text-xs text-muted-foreground">Optimal charging slots</p>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="ev-card p-4"
            >
              <MapPin className="h-6 w-6 text-accent mb-2" />
              <h3 className="font-semibold text-sm">Route Planning</h3>
              <p className="text-xs text-muted-foreground">Intelligent routing</p>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="ev-card p-4"
            >
              <BarChart3 className="h-6 w-6 text-warning mb-2" />
              <h3 className="font-semibold text-sm">Fleet Analytics</h3>
              <p className="text-xs text-muted-foreground">Performance insights</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8 ev-card max-w-md mx-auto">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Demo Login</h3>
                <p className="text-muted-foreground">
                  Choose your role to explore the platform
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user">Select Demo User</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user role" />
                    </SelectTrigger>
                    <SelectContent>
                      {demoUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground capitalize">
                              ({user.role})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleLogin} 
                  className="w-full" 
                  size="lg"
                  disabled={!selectedUser}
                >
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  This is a demo environment. All data is simulated.
                </p>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Powered by Evolve.3x
                </p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Host: Vercel/Netlify | Domain: evolve-3x.vercel.app
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
        </div>
      </div>
    </div>
  );
}