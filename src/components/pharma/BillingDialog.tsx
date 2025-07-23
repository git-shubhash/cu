import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Banknote, Receipt } from 'lucide-react';

interface BillingItem {
  id: string;
  medication: string;
  quantity: number;
  price: number;
}

interface BillingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentComplete: (bill: any) => void;
}

const mockBillingItems: BillingItem[] = [
  { id: "1", medication: "Amoxicillin 500mg", quantity: 2, price: 150 },
  { id: "2", medication: "Paracetamol 650mg", quantity: 1, price: 80 },
  { id: "3", medication: "Vitamin D3", quantity: 1, price: 200 },
];

export const BillingDialog: React.FC<BillingDialogProps> = ({
  open,
  onOpenChange,
  onPaymentComplete,
}) => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'online' | null>(null);

  const totalAmount = mockBillingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePaymentMethodSelect = (method: 'cash' | 'online') => {
    setSelectedPaymentMethod(method);
    setShowPaymentOptions(false);
  };

  const handleCashPayment = () => {
    const bill = {
      id: `BILL${Date.now()}`,
      items: mockBillingItems,
      total: totalAmount,
      paymentMethod: 'Cash',
      timestamp: new Date().toLocaleString(),
      status: 'Paid'
    };
    onPaymentComplete(bill);
    resetDialog();
  };

  const handleOnlinePayment = () => {
    // Simulate Razorpay integration
    const options = {
      key: 'rzp_test_1234567890', // Demo key
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      name: 'MediCare Hospital',
      description: 'Pharmacy Bill Payment',
      handler: function (response: any) {
        const bill = {
          id: `BILL${Date.now()}`,
          items: mockBillingItems,
          total: totalAmount,
          paymentMethod: 'Online',
          paymentId: response.razorpay_payment_id,
          timestamp: new Date().toLocaleString(),
          status: 'Paid'
        };
        onPaymentComplete(bill);
        resetDialog();
      },
      prefill: {
        name: 'Patient Name',
        email: 'patient@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3B82F6'
      }
    };

    // In a real implementation, you would load Razorpay script and use it
    // For demo purposes, we'll simulate success
    setTimeout(() => {
      const bill = {
        id: `BILL${Date.now()}`,
        items: mockBillingItems,
        total: totalAmount,
        paymentMethod: 'Online',
        paymentId: 'pay_demo_' + Date.now(),
        timestamp: new Date().toLocaleString(),
        status: 'Paid'
      };
      onPaymentComplete(bill);
      resetDialog();
    }, 2000);
  };

  const resetDialog = () => {
    setShowPaymentOptions(false);
    setSelectedPaymentMethod(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Billing & Payments
          </DialogTitle>
          <DialogDescription>
            Process payment for prescribed medications
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bill Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Bill Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockBillingItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{item.medication}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <p className="font-bold">Total Amount:</p>
                  <p className="font-bold text-lg">₹{totalAmount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          {!showPaymentOptions && !selectedPaymentMethod && (
            <Button 
              onClick={() => setShowPaymentOptions(true)}
              className="w-full"
            >
              Proceed to Payment
            </Button>
          )}

          {showPaymentOptions && (
            <div className="space-y-3">
              <p className="font-medium text-center">Select Payment Method</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => handlePaymentMethodSelect('cash')}
                >
                  <Banknote className="h-6 w-6" />
                  <span>Cash Payment</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => handlePaymentMethodSelect('online')}
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Online Payment</span>
                </Button>
              </div>
            </div>
          )}

          {/* Cash Payment Validation */}
          {selectedPaymentMethod === 'cash' && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Banknote className="h-12 w-12 text-green-600 mx-auto" />
                  <div>
                    <p className="font-semibold">Cash Payment</p>
                    <p className="text-sm text-muted-foreground">
                      Amount: ₹{totalAmount}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleCashPayment}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Validate Cash Payment
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedPaymentMethod(null)}
                      className="w-full"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Online Payment Processing */}
          {selectedPaymentMethod === 'online' && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CreditCard className="h-12 w-12 text-blue-600 mx-auto" />
                  <div>
                    <p className="font-semibold">Online Payment</p>
                    <p className="text-sm text-muted-foreground">
                      Redirecting to Razorpay Gateway...
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleOnlinePayment}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Pay ₹{totalAmount}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedPaymentMethod(null)}
                      className="w-full"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};