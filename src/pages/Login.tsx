import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Department } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Stethoscope, Pill, FlaskConical, Scan } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState<Department | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!department) {
      toast({
        title: "Department Required",
        description: "Please select a department to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = login(username, password, department as Department);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: `Welcome to ${department} department!`,
      });
      navigate(`/${department}`);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case 'pharma':
        return <Pill className="h-5 w-5" />;
      case 'lab':
        return <FlaskConical className="h-5 w-5" />;
      case 'radiology':
        return <Scan className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundImage: 'url(/hospital.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/30" />
        {/* Branding content removed as per request */}
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Desktop Logo Above Welcome Back */}
          <div className="hidden lg:flex justify-center mb-2">
            <div className="inline-flex p-2 rounded-2xl bg-white shadow-lg border border-gray-200">
              <img 
                src="/OIP.jpg" 
                alt="MediCare Hospital" 
                className="h-16 w-16 object-contain rounded-lg" 
              />
            </div>
          </div>
          {/* Mobile Header */}
          <div className="lg:hidden text-center">
            <div className="inline-flex p-2 rounded-xl bg-white shadow-lg border border-gray-200 mb-4">
              <img 
                src="/OIP.jpg" 
                alt="MediCare Hospital" 
                className="h-16 w-16 object-contain rounded-lg" 
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">MediCare Hospital</h1>
          </div>

          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
              <p className="text-muted-foreground mt-2">Sign in to access your department</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-foreground">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-12 text-base border-2 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 text-base border-2 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium text-foreground">
                    Department
                  </Label>
                  <Select value={department} onValueChange={(value) => setDepartment(value as Department)}>
                    <SelectTrigger className="h-12 text-base border-2 focus:border-primary">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pharma">
                        <div className="flex items-center gap-3 py-1">
                          {getDepartmentIcon('pharma')}
                          <span>Pharmacy</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="lab">
                        <div className="flex items-center gap-3 py-1">
                          {getDepartmentIcon('lab')}
                          <span>Laboratory</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="radiology">
                        <div className="flex items-center gap-3 py-1">
                          {getDepartmentIcon('radiology')}
                          <span>Radiology</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="text-center">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Demo Credentials</p>
                <p className="text-sm font-mono text-foreground">
                  <span className="font-semibold">Username:</span> admin
                  <span className="mx-2">•</span>
                  <span className="font-semibold">Password:</span> password123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;