import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Receipt, Calendar, CreditCard, Banknote } from 'lucide-react';

interface Bill {
  id: string;
  items: Array<{
    id: string;
    medication: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
  paymentId?: string;
  timestamp: string;
  status: string;
}

interface RecentBillsProps {
  bills: Bill[];
}

export const RecentBills: React.FC<RecentBillsProps> = ({ bills }) => {
  if (bills.length === 0) {
    return (
      <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Bills
          </CardTitle>
          <CardDescription>
            Recent billing transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent bills found</p>
            <p className="text-sm">Bills will appear here after payment processing</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Recent Bills
        </CardTitle>
        <CardDescription>
          Recent billing transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bills.map((bill) => (
            <div 
              key={bill.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-background/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Bill #{bill.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {bill.items.length} item(s) • ₹{bill.total}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{bill.timestamp}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    {bill.paymentMethod === 'Cash' ? (
                      <Banknote className="h-4 w-4 text-green-600" />
                    ) : (
                      <CreditCard className="h-4 w-4 text-blue-600" />
                    )}
                    <Badge variant="outline">
                      {bill.paymentMethod}
                    </Badge>
                  </div>
                  <Badge className="bg-medical-green text-white">
                    {bill.status}
                  </Badge>
                  {bill.paymentId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ID: {bill.paymentId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};