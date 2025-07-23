import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Dispensed": return "bg-medical-green";
    case "Preparing": return "bg-warning";
    case "Pending": return "bg-muted";
    default: return "bg-muted";
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "Urgent": return "bg-destructive";
    case "High": return "bg-warning";
    case "Normal": return "bg-primary";
    default: return "bg-muted";
  }
};

export const getStatusIcon = (status: string): React.ReactNode => {
  switch (status) {
    case "Dispensed": return <CheckCircle className="h-4 w-4" />;
    case "Preparing": return <Clock className="h-4 w-4" />;
    case "Pending": return <AlertCircle className="h-4 w-4" />;
    default: return null;
  }
};