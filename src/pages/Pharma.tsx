import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/pharma/PageHeader';
import { StatsCard } from '@/components/pharma/StatsCard';
import { PrescriptionItem } from '@/components/pharma/PrescriptionItem';
import { getStatusColor, getPriorityColor, getStatusIcon } from '@/components/pharma/utils';
import { prescriptions } from '@/components/pharma/constants';

const Pharma: React.FC = () => {
  const { user, logout } = useAuth();

  const iconMap = {
    Pill,
    CheckCircle,
    Clock,
    AlertCircle,
  };

  const statsData = [
    { icon: 'Pill', label: 'Total Prescriptions', value: '156', iconColor: 'text-primary' },
    { icon: 'CheckCircle', label: 'Dispensed', value: '98', iconColor: 'text-medical-green' },
    { icon: 'Clock', label: 'Preparing', value: '34', iconColor: 'text-warning' },
    { icon: 'AlertCircle', label: 'Pending', value: '24', iconColor: 'text-destructive' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto p-6">
        <PageHeader username={user?.username || ''} onLogout={logout} />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              icon={iconMap[stat.icon as keyof typeof iconMap]}
              label={stat.label}
              value={stat.value}
              iconColor={stat.iconColor}
            />
          ))}
        </div>

        {/* Prescriptions */}
        <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Today's Prescriptions
            </CardTitle>
            <CardDescription>
              Current prescriptions and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prescriptions.map((prescription, index) => (
                <PrescriptionItem
                  key={index}
                  prescription={prescription}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pharma;