export const prescriptions = [
  { 
    id: "RX001", 
    patient: "Alice Johnson", 
    medication: "Amoxicillin 500mg", 
    status: "Dispensed", 
    priority: "Normal", 
    time: "09:15 AM" 
  },
  { 
    id: "RX002", 
    patient: "Bob Smith", 
    medication: "Lisinopril 10mg", 
    status: "Preparing", 
    priority: "Urgent", 
    time: "10:30 AM" 
  },
  { 
    id: "RX003", 
    patient: "Carol Davis", 
    medication: "Metformin 850mg", 
    status: "Pending", 
    priority: "High", 
    time: "11:45 AM" 
  },
  { 
    id: "RX004", 
    patient: "Daniel Wilson", 
    medication: "Atorvastatin 20mg", 
    status: "Dispensed", 
    priority: "Normal", 
    time: "08:30 AM" 
  },
];

export const statsData = [
  { icon: 'Pill', label: 'Total Prescriptions', value: '156', iconColor: 'text-primary' },
  { icon: 'CheckCircle', label: 'Dispensed', value: '98', iconColor: 'text-medical-green' },
  { icon: 'Clock', label: 'Preparing', value: '34', iconColor: 'text-warning' },
  { icon: 'AlertCircle', label: 'Pending', value: '24', iconColor: 'text-destructive' },
];