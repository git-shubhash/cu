import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scan, LogOut, Monitor, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

const Radiology: React.FC = () => {
  const { user, logout } = useAuth();

  const scanResults = [
    { id: "RAD001", patient: "Emma Brown", scan: "Chest X-Ray", status: "Completed", priority: "Normal", time: "09:00 AM", machine: "X-Ray Room 1" },
    { id: "RAD002", patient: "David Lee", scan: "MRI Brain", status: "In Progress", priority: "Urgent", time: "10:30 AM", machine: "MRI Room A" },
    { id: "RAD003", patient: "Lisa Garcia", scan: "CT Abdomen", status: "Scheduled", priority: "High", time: "02:00 PM", machine: "CT Room 2" },
    { id: "RAD004", patient: "Robert Taylor", scan: "Ultrasound", status: "Completed", priority: "Normal", time: "08:15 AM", machine: "US Room 3" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-medical-green";
      case "In Progress": return "bg-warning";
      case "Scheduled": return "bg-primary";
      default: return "bg-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-destructive";
      case "High": return "bg-warning";
      case "Normal": return "bg-primary";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="h-4 w-4" />;
      case "In Progress": return <Clock className="h-4 w-4" />;
      case "Scheduled": return <Calendar className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-medical-orange/10 border border-medical-orange/20">
              <Scan className="h-8 w-8 text-medical-orange" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Radiology Department</h1>
              <p className="text-muted-foreground">Welcome back, {user?.username}</p>
            </div>
          </div>
          <Button 
            onClick={logout} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Monitor className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                  <p className="text-2xl font-bold">78</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-medical-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">18</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scan Results */}
        <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Today's Imaging Schedule
            </CardTitle>
            <CardDescription>
              Current scans and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scanResults.map((scan, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border bg-background/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-medical-orange/10 flex items-center justify-center">
                      <Scan className="h-6 w-6 text-medical-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{scan.scan}</h3>
                      <p className="text-sm text-muted-foreground">Patient: {scan.patient} • ID: {scan.id}</p>
                      <p className="text-xs text-muted-foreground">Time: {scan.time} • {scan.machine}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge 
                        className={`${getPriorityColor(scan.priority)} text-white mb-2`}
                      >
                        {scan.priority} Priority
                      </Badge>
                      <div>
                        <Badge 
                          className={`${getStatusColor(scan.status)} text-white flex items-center gap-1`}
                        >
                          {getStatusIcon(scan.status)}
                          {scan.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Radiology;