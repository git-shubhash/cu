import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Banknote, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethod: 'cash' | 'online' | null;
  amount: number;
  customerName: string;
  onPaymentComplete: (paymentData: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  paymentMethod,
  amount,
  customerName,
  onPaymentComplete
}) => {
  const [cashReceived, setCashReceived] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCashPayment = () => {
    const received = parseFloat(cashReceived);
    
    if (!received || received < amount) {
      toast({
        title: "Invalid Amount",
        description: "Cash received must be equal to or greater than the bill amount",
        variant: "destructive",
      });
      return;
    }

    const change = received - amount;
    
    const paymentData = {
      method: 'cash',
      amountReceived: received,
      change: change,
      notes: notes,
      timestamp: new Date().toISOString()
    };

    onPaymentComplete(paymentData);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async () => {
    setIsProcessing(true);
    
    const res = await loadRazorpayScript();
    
    if (!res) {
      toast({
        title: "Payment Gateway Error",
        description: "Failed to load Razorpay. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    const options = {
      key: 'rzp_test_9999999999', // Replace with your Razorpay key
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'MediCare Hospital',
      description: 'Pharmacy Bill Payment',
      image: '/OIP.jpg',
      handler: function (response: any) {
        const paymentData = {
          method: 'online',
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          amount: amount,
          timestamp: new Date().toISOString()
        };
        
        setIsProcessing(false);
        onPaymentComplete(paymentData);
      },
      prefill: {
        name: customerName,
        email: 'customer@example.com',
        contact: '9999999999'
      },
      notes: {
        address: 'MediCare Hospital Pharmacy'
      },
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
          toast({
            title: "Payment Cancelled",
            description: "Payment was cancelled by user",
            variant: "destructive",
          });
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const getChange = () => {
    const received = parseFloat(cashReceived);
    return received > amount ? received - amount : 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {paymentMethod === 'cash' ? (
              <Banknote className="h-5 w-5" />
            ) : (
              <CreditCard className="h-5 w-5" />
            )}
            {paymentMethod === 'cash' ? 'Cash Payment' : 'Online Payment'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span>₹{amount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {paymentMethod === 'cash' ? (
            /* Cash Payment Form */
            <div className="space-y-4">
              <div>
                <Label htmlFor="cashReceived">Cash Received (₹)</Label>
                <Input
                  id="cashReceived"
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="Enter amount received"
                  step="0.01"
                />
              </div>

              {cashReceived && parseFloat(cashReceived) >= amount && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">
                        Change to return: ₹{getChange().toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about the payment"
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleCashPayment}
                className="w-full"
                disabled={!cashReceived || parseFloat(cashReceived) < amount}
              >
                Validate Cash Payment
              </Button>
            </div>
          ) : (
            /* Online Payment */
            <div className="space-y-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <CreditCard className="h-12 w-12 mx-auto text-blue-600 mb-2" />
                    <h3 className="font-semibold text-blue-900">Secure Online Payment</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Pay securely using Razorpay gateway
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleOnlinePayment}
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay ₹{amount.toFixed(2)}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Powered by Razorpay • Secure & Encrypted
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;