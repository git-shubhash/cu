import React from 'react';
import { Button } from '@/components/ui/button';
import { Pill, LogOut } from 'lucide-react';

interface PageHeaderProps {
  username: string;
  onLogout: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ username, onLogout }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
          <Pill className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pharmacy Department</h1>
          <p className="text-muted-foreground">Welcome back, {username}</p>
        </div>
      </div>
      <Button 
        onClick={onLogout} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};