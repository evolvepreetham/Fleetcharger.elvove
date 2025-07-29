import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock, 
  Zap,
  Battery,
  MapPin
} from 'lucide-react';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'charging' | 'battery' | 'location';

interface StatusBadgeProps {
  status: StatusType;
  text: string;
  className?: string;
  animated?: boolean;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    className: 'status-success',
  },
  warning: {
    icon: AlertCircle,
    className: 'status-warning',
  },
  error: {
    icon: XCircle,
    className: 'status-error',
  },
  info: {
    icon: Clock,
    className: 'status-info',
  },
  charging: {
    icon: Zap,
    className: 'status-success',
  },
  battery: {
    icon: Battery,
    className: 'status-info',
  },
  location: {
    icon: MapPin,
    className: 'status-info',
  },
};

export function StatusBadge({ status, text, className, animated = false }: StatusBadgeProps) {
  const { icon: Icon, className: statusClass } = statusConfig[status];

  const badge = (
    <div className={cn(statusClass, className)}>
      <Icon className="h-3 w-3" />
      <span>{text}</span>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {badge}
      </motion.div>
    );
  }

  return badge;
}