import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Pill } from 'lucide-react';

interface Prescription {
  id: string;
  patient: string;
  medication: string;
  status: string;
  priority: string;
  time: string;
}

interface PrescriptionItemProps {
  prescription: Prescription;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

export const PrescriptionItem: React.FC<PrescriptionItemProps> = ({
  prescription,
  getStatusColor,
  getPriorityColor,
  getStatusIcon,
}) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-background/50">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Pill className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{prescription.medication}</h3>
          <p className="text-sm text-muted-foreground">
            Patient: {prescription.patient} • ID: {prescription.id}
          </p>
          <p className="text-xs text-muted-foreground">
            Prescribed: {prescription.time}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <Badge className={`${getPriorityColor(prescription.priority)} text-white mb-2`}>
            {prescription.priority} Priority
          </Badge>
          <div>
            <Badge className={`${getStatusColor(prescription.status)} text-white flex items-center gap-1`}>
              {getStatusIcon(prescription.status)}
              {prescription.status}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};