import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, ArrowLeft, Truck } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="ev-card p-8 max-w-md mx-auto text-center">
          <div className="p-4 rounded-2xl bg-muted/50 w-fit mx-auto mb-6">
            <Truck className="h-12 w-12 text-muted-foreground" />
          </div>
          
          <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-xl font-semibold text-foreground mb-2">Route Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The page you're looking for seems to have taken a different route.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-6">
            Error code: 404 • Route: {location.pathname}
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;
