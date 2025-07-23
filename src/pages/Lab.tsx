import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, LogOut, TestTube, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Lab: React.FC = () => {
  const { user, logout } = useAuth();

  const testResults = [
    { id: "LAB001", patient: "John Doe", test: "Complete Blood Count", status: "Completed", priority: "Normal", time: "09:30 AM" },
    { id: "LAB002", patient: "Jane Smith", test: "Lipid Profile", status: "In Progress", priority: "Urgent", time: "10:15 AM" },
    { id: "LAB003", patient: "Mike Johnson", test: "Liver Function Test", status: "Pending", priority: "Normal", time: "11:00 AM" },
    { id: "LAB004", patient: "Sarah Wilson", test: "Glucose Tolerance", status: "Completed", priority: "High", time: "08:45 AM" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-medical-green";
      case "In Progress": return "bg-warning";
      case "Pending": return "bg-muted";
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
      case "Pending": return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
              <FlaskConical className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Laboratory Department</h1>
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
                <TestTube className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Tests</p>
                  <p className="text-2xl font-bold">127</p>
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
                  <p className="text-2xl font-bold">89</p>
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
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Today's Test Results
            </CardTitle>
            <CardDescription>
              Current lab tests and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((test, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border bg-background/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FlaskConical className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{test.test}</h3>
                      <p className="text-sm text-muted-foreground">Patient: {test.patient} • ID: {test.id}</p>
                      <p className="text-xs text-muted-foreground">Scheduled: {test.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge 
                        className={`${getPriorityColor(test.priority)} text-white mb-2`}
                      >
                        {test.priority} Priority
                      </Badge>
                      <div>
                        <Badge 
                          className={`${getStatusColor(test.status)} text-white flex items-center gap-1`}
                        >
                          {getStatusIcon(test.status)}
                          {test.status}
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

export default Lab;