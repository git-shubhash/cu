import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Banknote, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PaymentDialog from './PaymentDialog';

interface BillingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface BillingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBillComplete: (bill: any) => void;
}

const BillingDialog: React.FC<BillingDialogProps> = ({ open, onOpenChange, onBillComplete }) => {
  const [items, setItems] = useState<BillingItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: 1 });
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'online' | null>(null);

  const addItem = () => {
    if (!newItem.name || !newItem.price) {
      toast({
        title: "Missing Information",
        description: "Please enter item name and price",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(newItem.price);
    const item: BillingItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: price,
      quantity: newItem.quantity,
      total: price * newItem.quantity
    };

    setItems([...items, item]);
    setNewItem({ name: '', price: '', quantity: 1 });
  };

  const updateQuantity = (id: string, change: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return {
          ...item,
          quantity: newQuantity,
          total: item.price * newQuantity
        };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handlePaymentSelect = (method: 'cash' | 'online') => {
    if (items.length === 0) {
      toast({
        title: "No Items",
        description: "Please add items to the bill first",
        variant: "destructive",
      });
      return;
    }

    if (!customerName) {
      toast({
        title: "Customer Information Required",
        description: "Please enter customer name",
        variant: "destructive",
      });
      return;
    }

    setSelectedPaymentMethod(method);
    setPaymentDialogOpen(true);
  };

  const handlePaymentComplete = (paymentData: any) => {
    const bill = {
      id: `BILL-${Date.now()}`,
      customerName,
      customerPhone,
      items,
      totalAmount: getTotalAmount(),
      paymentMethod: selectedPaymentMethod,
      paymentData,
      date: new Date().toISOString(),
      status: 'Paid'
    };

    onBillComplete(bill);
    
    // Reset form
    setItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setNewItem({ name: '', price: '', quantity: 1 });
    setPaymentDialogOpen(false);
    setSelectedPaymentMethod(null);
    onOpenChange(false);

    toast({
      title: "Payment Successful",
      description: `Bill ${bill.id} has been processed successfully`,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Billing & Payments
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Customer Info & Items */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Add Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="itemName">Item Name</Label>
                      <Input
                        id="itemName"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Medicine name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="itemPrice">Price (₹)</Label>
                      <Input
                        id="itemPrice"
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <Label>Quantity</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setNewItem({ ...newItem, quantity: Math.max(1, newItem.quantity - 1) })}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">{newItem.quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setNewItem({ ...newItem, quantity: newItem.quantity + 1 })}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button onClick={addItem} className="mt-6">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Bill Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bill Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {items.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No items added yet</p>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ₹{item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-medium">₹{item.total.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount:</span>
                        <span>₹{getTotalAmount().toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => handlePaymentSelect('cash')}
                    className="w-full h-12 flex items-center gap-3"
                    variant="outline"
                  >
                    <Banknote className="h-5 w-5" />
                    Cash Payment
                  </Button>
                  
                  <Button
                    onClick={() => handlePaymentSelect('online')}
                    className="w-full h-12 flex items-center gap-3"
                    variant="outline"
                  >
                    <CreditCard className="h-5 w-5" />
                    Online Payment (Razorpay)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        paymentMethod={selectedPaymentMethod}
        amount={getTotalAmount()}
        customerName={customerName}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
};

export default BillingDialog;