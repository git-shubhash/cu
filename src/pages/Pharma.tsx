import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, LogOut, Package, AlertTriangle, TrendingUp, Receipt, CreditCard } from 'lucide-react';
import BillingDialog from '@/components/BillingDialog';

const Pharma: React.FC = () => {
  const { user, logout } = useAuth();
  const [billingDialogOpen, setBillingDialogOpen] = useState(false);
  const [recentBills, setRecentBills] = useState<any[]>([]);

  const medications = [
    { name: "Paracetamol 500mg", stock: 150, status: "In Stock", expiry: "Dec 2024", price: "₹5.50" },
    { name: "Amoxicillin 250mg", stock: 45, status: "Low Stock", expiry: "Jan 2025", price: "₹12.00" },
    { name: "Ibuprofen 400mg", stock: 0, status: "Out of Stock", expiry: "Nov 2024", price: "₹8.75" },
    { name: "Cetirizine 10mg", stock: 200, status: "In Stock", expiry: "Mar 2025", price: "₹3.25" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "bg-medical-green";
      case "Low Stock": return "bg-warning";
      case "Out of Stock": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const handleBillComplete = (bill: any) => {
    setRecentBills([bill, ...recentBills]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-medical-green/10 border border-medical-green/20">
              <Pill className="h-8 w-8 text-medical-green" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Pharmacy Department</h1>
              <p className="text-muted-foreground">Welcome back, {user?.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setBillingDialogOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-glow"
            >
              <CreditCard className="h-4 w-4" />
              New Bill
            </Button>
            <Button 
              onClick={logout} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Medicines</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-medical-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Today's Sales</p>
                  <p className="text-2xl font-bold">₹45,230</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Receipt className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Bills</p>
                  <p className="text-2xl font-bold">{recentBills.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medicine Inventory */}
          <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Medicine Inventory
              </CardTitle>
              <CardDescription>
                Current stock levels and medication details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((med, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border bg-background/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-medical-green/10 flex items-center justify-center">
                        <Pill className="h-6 w-6 text-medical-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{med.name}</h3>
                        <p className="text-sm text-muted-foreground">Stock: {med.stock} units</p>
                        <p className="text-xs text-muted-foreground">Expires: {med.expiry} • {med.price}</p>
                      </div>
                    </div>
                    
                    <Badge 
                      className={`${getStatusColor(med.status)} text-white`}
                    >
                      {med.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bills */}
          <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Recent Bills
              </CardTitle>
              <CardDescription>
                Latest billing transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentBills.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No bills generated yet</p>
                  <p className="text-sm text-muted-foreground">Click "New Bill" to create your first bill</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBills.slice(0, 5).map((bill) => (
                    <div 
                      key={bill.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-background/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Receipt className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{bill.id}</h3>
                          <p className="text-sm text-muted-foreground">Customer: {bill.customerName}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(bill.date)}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">₹{bill.totalAmount.toFixed(2)}</p>
                        <Badge 
                          className={`${bill.paymentMethod === 'cash' ? 'bg-medical-green' : 'bg-primary'} text-white`}
                        >
                          {bill.paymentMethod === 'cash' ? 'Cash' : 'Online'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <BillingDialog
        open={billingDialogOpen}
        onOpenChange={setBillingDialogOpen}
        onBillComplete={handleBillComplete}
      />
    </div>
  );
};

export default Pharma;