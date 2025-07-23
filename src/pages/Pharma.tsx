import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Pill, 
  LogOut, 
  Package, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  QrCode,
  Scan,
  FileText,
  CreditCard,
  Globe,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Bell,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  PlusCircle,
  Pencil,
  X
} from 'lucide-react';
import QrScanner from 'react-qr-scanner';
import html2pdf from 'html2pdf.js';
import { useRef } from 'react';

const Pharma: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  // Inventory enhancements
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedQty, setNewMedQty] = useState('');
  // Remove expiry state
  // Edit modal state
  const [editMedIndex, setEditMedIndex] = useState<number | null>(null);
  const [editMedName, setEditMedName] = useState('');
  const [editMedRefill, setEditMedRefill] = useState('');
  // Delete modal state
  const [deleteMedIndex, setDeleteMedIndex] = useState<number | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'low' | 'none'>('all');
  // Edit name modal state
  const [editNameIndex, setEditNameIndex] = useState<number | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  // Mock data for inventory (remove expiry from all items)
  const inventory = [
    { name: "Amoxicillin 500mg", stock: 150, threshold: 50, price: 12.50, status: "In Stock", supplier: "PharmaCorp" },
    { name: "Paracetamol 650mg", stock: 25, threshold: 50, price: 8.75, status: "Low Stock", supplier: "MediSupply" },
    { name: "Insulin Glargine", stock: 8, threshold: 20, price: 45.00, status: "Critical", supplier: "DiabetesCare" },
    { name: "Aspirin 75mg", stock: 200, threshold: 30, price: 5.25, status: "In Stock", supplier: "CardioMed" },
  ];
  const [inventoryList, setInventoryList] = useState(inventory);

  // Add new medicine handler (no expiry)
  const handleAddMedicine = () => {
    if (!newMedName.trim() || !newMedQty.trim()) return;
    if (inventoryList.some(med => med.name.toLowerCase() === newMedName.trim().toLowerCase())) {
      alert('Medicine with this name already exists.');
      return;
    }
    setInventoryList([
      ...inventoryList,
      {
        name: newMedName.trim(),
        stock: parseInt(newMedQty, 10),
        threshold: 50,
        price: 0,
        status: parseInt(newMedQty, 10) === 0 ? 'No Stock' : (parseInt(newMedQty, 10) < 50 ? 'Low Stock' : 'In Stock'),
        supplier: '',
      },
    ]);
    setShowAddModal(false);
    setNewMedName('');
    setNewMedQty('');
  };

  // Edit modal open
  const openEditModal = (idx: number) => {
    setEditMedIndex(idx);
    setEditMedRefill('');
  };
  // Edit modal save
  const handleEditSave = () => {
    const refill = parseInt(editMedRefill, 10) || 0;
    setInventoryList(list => list.map((med, idx) => {
      if (idx !== editMedIndex) return med;
      const newStock = med.stock + refill;
      return {
        ...med,
        stock: newStock,
        status: newStock === 0 ? 'No Stock' : (newStock < 50 ? 'Low Stock' : 'In Stock'),
      };
    }));
    setEditMedIndex(null);
    setEditMedRefill('');
  };
  // Request handler
  const handleRequest = () => {
    alert('Request sent for this medicine!');
  };

  // Delete handler
  const handleDeleteMedicine = () => {
    if (deleteMedIndex === null) return;
    setInventoryList(list => list.filter((_, idx) => idx !== deleteMedIndex));
    setDeleteMedIndex(null);
    setDeleteConfirmName('');
  };

  // Edit name modal open
  const openEditNameModal = (idx: number) => {
    setEditNameIndex(idx);
    setEditNameValue(inventoryList[idx].name);
  };
  // Edit name modal save
  const handleEditNameSave = () => {
    if (!editNameValue.trim()) return;
    if (inventoryList.some((med, idx) => idx !== editNameIndex && med.name.toLowerCase() === editNameValue.trim().toLowerCase())) {
      alert('Medicine with this name already exists.');
      return;
    }
    setInventoryList(list => list.map((med, idx) => idx === editNameIndex ? { ...med, name: editNameValue.trim() } : med));
    setEditNameIndex(null);
    setEditNameValue('');
  };

  // Filtered and searched inventory
  const filteredInventory = inventoryList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    if (inventoryFilter === 'low') matchesFilter = item.status === 'Low Stock';
    if (inventoryFilter === 'none') matchesFilter = item.stock === 0 || item.status === 'No Stock';
    return matchesSearch && matchesFilter;
  });

  // Mock data for prescriptions
  const prescriptions = [
    { 
      id: "RX001", 
      patientName: "John Doe", 
      doctorName: "Dr. Smith", 
      medicines: [
        { name: "Amoxicillin 500mg", quantity: 21, dosage: "1 tab 3x/day" },
        { name: "Paracetamol 650mg", quantity: 10, dosage: "1 tab 2x/day" }
      ], 
      status: "Dispensed", 
      date: "2024-01-15",
      qrCode: "QR_RX001_PATIENT_123"
    },
    { 
      id: "RX002", 
      patientName: "Jane Wilson", 
      doctorName: "Dr. Johnson", 
      medicines: [
        { name: "Insulin Glargine", quantity: 2, dosage: "10 units at night" },
        { name: "Metformin 500mg", quantity: 30, dosage: "1 tab 2x/day" }
      ], 
      status: "Dispensed", 
      date: "2024-01-14",
      qrCode: "QR_RX002_PATIENT_456"
    },
    { 
      id: "RX003", 
      patientName: "Mike Brown", 
      doctorName: "Dr. Davis", 
      medicines: [
        { name: "Aspirin 75mg", quantity: 14, dosage: "1 tab daily" },
        { name: "Lisinopril 10mg", quantity: 14, dosage: "1 tab daily" }
      ], 
      status: "Dispensed", 
      date: "2024-01-13",
      qrCode: "QR_RX003_PATIENT_789"
    },
    // Additional test data
    {
      id: "RX004",
      patientName: "Priya Sharma",
      doctorName: "Dr. Mehta",
      medicines: [
        { name: "Paracetamol 650mg", quantity: 15, dosage: "1 tab 3x/day" },
        { name: "Ibuprofen 400mg", quantity: 10, dosage: "1 tab 2x/day" }
      ],
      status: "Pending",
      date: "2024-01-18",
      qrCode: "QR_RX004_PATIENT_321"
    },
    {
      id: "RX005",
      patientName: "Amit Patel",
      doctorName: "Dr. Rao",
      medicines: [
        { name: "Aspirin 75mg", quantity: 20, dosage: "1 tab daily" },
        { name: "Atorvastatin 10mg", quantity: 30, dosage: "1 tab at night" }
      ],
      status: "Pending",
      date: "2024-01-19",
      qrCode: "QR_RX005_PATIENT_654"
    },
    {
      id: "RX006",
      patientName: "Sara Lee",
      doctorName: "Dr. Kim",
      medicines: [
        { name: "Metformin 500mg", quantity: 60, dosage: "1 tab 2x/day" },
        { name: "Insulin Glargine", quantity: 1, dosage: "12 units at night" }
      ],
      status: "Pending",
      date: "2024-01-20",
      qrCode: "QR_RX006_PATIENT_987"
    },
    {
      id: "RX007",
      patientName: "Rohit Verma",
      doctorName: "Dr. Gupta",
      medicines: [
        { name: "Amoxicillin 500mg", quantity: 10, dosage: "1 tab 2x/day" },
        { name: "Cetirizine 10mg", quantity: 5, dosage: "1 tab at night" }
      ],
      status: "Pending",
      date: "2024-01-21",
      qrCode: "QR_RX007_PATIENT_852"
    },
    {
      id: "RX008",
      patientName: "Emily Clark",
      doctorName: "Dr. Watson",
      medicines: [
        { name: "Paracetamol 650mg", quantity: 12, dosage: "1 tab 2x/day" },
        { name: "Ibuprofen 400mg", quantity: 8, dosage: "1 tab 2x/day" }
      ],
      status: "Pending",
      date: "2024-01-22",
      qrCode: "QR_RX008_PATIENT_963"
    }
  ];
  // State for scanned/dispensed prescriptions
  const [dispensedPrescriptions, setDispensedPrescriptions] = useState<any[]>([]);
  const [viewPrescription, setViewPrescription] = useState<any | null>(null);
  // State for hidden PDF preview
  const [pdfPreviewPrescription, setPdfPreviewPrescription] = useState<any | null>(null);
  const pdfPreviewRef = useRef<HTMLDivElement>(null);

  // State for bills (make it dynamic)
  const [bills, setBills] = useState([
    { id: "BILL001", patientName: "John Doe", amount: 45.75, status: "Paid", date: "2024-01-15", paymentMethod: "Card", medicines: [], prescriptionId: "RX001" },
    { id: "BILL002", patientName: "Jane Wilson", amount: 89.50, status: "Pending", date: "2024-01-14", paymentMethod: "Pending", medicines: [], prescriptionId: "RX002" },
    { id: "BILL003", patientName: "Mike Brown", amount: 23.25, status: "Paid", date: "2024-01-13", paymentMethod: "UPI", medicines: [], prescriptionId: "RX003" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": case "Dispensed": case "Paid": return "bg-emerald-500";
      case "Low Stock": case "Pending": return "bg-amber-500";
      case "Critical": case "Overdue": return "bg-red-500";
      case "Billed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Stock": case "Dispensed": case "Paid": return <CheckCircle className="h-4 w-4" />;
      case "Low Stock": case "Pending": return <Clock className="h-4 w-4" />;
      case "Critical": case "Overdue": return <AlertTriangle className="h-4 w-4" />;
      case "Billed": return <FileText className="h-4 w-4" />;
      default: return null;
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  // Request cart state
  const [requestCart, setRequestCart] = useState<{ name: string; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [addToCartIndex, setAddToCartIndex] = useState<number | null>(null);
  const [addToCartQty, setAddToCartQty] = useState('');

  // Add to cart handler
  const handleAddToCart = (idx: number) => {
    setAddToCartIndex(idx);
    setAddToCartQty('');
  };
  const handleAddToCartConfirm = () => {
    if (addToCartIndex === null) return;
    const qty = parseInt(addToCartQty, 10);
    if (!qty || qty <= 0) return;
    const med = inventoryList[addToCartIndex];
    setRequestCart(cart => {
      const existing = cart.find(item => item.name === med.name);
      if (existing) {
        return cart.map(item => item.name === med.name ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...cart, { name: med.name, quantity: qty }];
    });
    setAddToCartIndex(null);
    setAddToCartQty('');
  };
  const handleRemoveFromCart = (name: string) => {
    setRequestCart(cart => cart.filter(item => item.name !== name));
  };
  const handleExportCart = () => {
    const csv = 'Medicine,Quantity\n' + requestCart.map(item => `${item.name},${item.quantity}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'request_cart.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleSendMail = () => {
    alert('Request mail sent! (Simulated)');
  };

  // Add export handler for all medicines
  const handleExportInventory = () => {
    const csv = 'Medicine,Stock,Status\n' + inventoryList.map(item => `${item.name},${item.stock},${item.status}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medicine_inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // QR Scanner state
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedId, setScannedId] = useState('');
  const [scanError, setScanError] = useState('');
  const [scanSuccess, setScanSuccess] = useState('');
  // Add manualPID state at the top
  const [manualPID, setManualPID] = useState('');

  // Handler for QR scan result
  const handleQRScan = (data: any) => {
    if (data && data.text) {
      // Extract ID from QR code (assume QR contains just the ID or a string with 'ID:xxxx')
      let id = data.text;
      const match = id.match(/ID[:_\- ]?(\w+)/i);
      if (match) id = match[1];
      setScannedId(id);
      setShowQRScanner(false);
      // Find prescription by ID or QR code
      const found = prescriptions.find(p => p.id.toLowerCase() === id.toLowerCase() || p.qrCode.toLowerCase() === id.toLowerCase());
      if (found && !dispensedPrescriptions.some(p => p.id === found.id)) {
        setDispensedPrescriptions(prev => [...prev, found]);
        setScanError('');
        setScanSuccess('Added successfully');
        setTimeout(() => {
          setScanSuccess('');
          setShowAddModal(false); // Close the dialog/modal if open
        }, 1000);
      } else if (!found) {
        setScanError('No patient found');
      } else {
        setScanError('');
      }
      // You can add logic here to use the ID (e.g., fetch prescription)
    }
  };
  const handleQRError = (err: any) => {
    setShowQRScanner(false);
    // Optionally show error to user
  };

  // Handler for manual PID entry
  const handleManualPIDSubmit = () => {
    if (!manualPID.trim()) return;
    setScannedId(manualPID.trim());
    // Find prescription by ID or QR code
    const found = prescriptions.find(p => p.id.toLowerCase() === manualPID.trim().toLowerCase() || p.qrCode.toLowerCase() === manualPID.trim().toLowerCase());
    if (found && !dispensedPrescriptions.some(p => p.id === found.id)) {
      setDispensedPrescriptions(prev => [...prev, found]);
      setScanError('');
      setScanSuccess('Added successfully');
      setTimeout(() => {
        setScanSuccess('');
        setShowAddModal(false);
      }, 1000);
    } else if (!found) {
      setScanError('No patient found');
    } else {
      setScanError('');
    }
  };

  // Mock doctor and clinic info
  const clinicInfo = {
    name: "CURA Hospitals",
    logo: "/hospital-header.jpg",
    address: "123 Health Ave, City, State, 123456",
    contact: "+91-9876543210",
  };
  const doctorInfo = {
    name: "Dr. John Smith, MD (Internal Medicine)",
    regNo: "REG123456",
    qualifications: "MBBS, MD (Internal Medicine)",
  };
  // For demo, add patient age/sex/weight to prescription object
  // (In real app, this would come from patient data)

  // Ref for PDF content
  const prescriptionRef = useRef<HTMLDivElement>(null);

  // Download PDF handler
  const handleDownloadPDF = () => {
    if (prescriptionRef.current && viewPrescription) {
      const safeName = `${viewPrescription.patientName.replace(/[^a-zA-Z0-9]/g, '_')}_${viewPrescription.id}`;
      html2pdf()
        .set({
          margin: [10, 10, 10, 10], // top, right, bottom, left (in mm)
          filename: `${safeName}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(prescriptionRef.current)
        .save();
    }
  };

  // Send to WhatsApp handler (demo: opens WhatsApp with a message and placeholder link)
  const handleSendWhatsApp = () => {
    const phone = '';
    const message = encodeURIComponent('Here is your prescription. Download: [PDF link here]');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  // Download PDF for a specific prescription row (using hidden React component)
  const handleDownloadPDFRow = async (prescription: any) => {
    setPdfPreviewPrescription(prescription);
    // Wait for the hidden component to render
    setTimeout(() => {
      if (pdfPreviewRef.current) {
        const safeName = `${prescription.patientName.replace(/[^a-zA-Z0-9]/g, '_')}_${prescription.id}`;
        html2pdf()
          .set({
            margin: [10, 10, 10, 10],
            filename: `${safeName}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          })
          .from(pdfPreviewRef.current)
          .save()
          .then(() => setPdfPreviewPrescription(null));
      }
    }, 100);
  };

  // Send to WhatsApp for a specific prescription row
  const handleSendWhatsAppRow = (prescription: any) => {
    // For demo, just open WhatsApp with a message and a placeholder link
    const phone = '';
    const message = encodeURIComponent('Here is your prescription. Download: [PDF link here]');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  // Dispense handler for prescription (with billing)
  const handleDispensePrescription = (prescription: any) => {
    // Calculate bill
    const billMedicines = prescription.medicines.map((med: any) => {
      const inv = inventoryList.find(i => i.name.toLowerCase() === med.name.toLowerCase());
      const unitPrice = inv ? inv.price : 0;
      const subtotal = unitPrice * (med.quantity || 1);
      return {
        name: med.name,
        quantity: med.quantity || 1,
        unitPrice,
        subtotal,
      };
    });
    const total = billMedicines.reduce((sum, m) => sum + m.subtotal, 0);
    const newBill = {
      id: `BILL${(bills.length + 1).toString().padStart(3, '0')}`,
      patientName: prescription.patientName,
      amount: total,
      status: "Pending",
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: "Pending",
      medicines: billMedicines,
      prescriptionId: prescription.id,
    };
    setBills(prev => [newBill, ...prev]);
    setActiveTab('billing');
    setViewPrescription(null);
    // Optionally, mark as dispensed
    setDispensedPrescriptions(prev => prev.map(p => p.id === prescription.id ? { ...p, status: 'Dispensed' } : p));
  };

  // Add state for prescription to delete and confirmation
  const [deletePrescriptionId, setDeletePrescriptionId] = useState<string | null>(null);

  // Handler to delete prescription
  const handleDeletePrescription = () => {
    if (!deletePrescriptionId) return;
    setDispensedPrescriptions(prev => prev.filter(p => p.id !== deletePrescriptionId));
    // Optionally, if you want to allow deleting from the original prescriptions list, you would need to make it stateful.
    setDeletePrescriptionId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src="/OIP.jpg" alt="Hospital Logo" className="h-16 w-16 object-contain rounded-2xl shadow-lg bg-white p-2 border border-gray-200" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Lab Pharma Dashboard
              </h1>
              <p className="text-slate-600">Welcome back, {user?.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="relative" onClick={() => setShowCart(true)}>
              <ShoppingCart className="h-5 w-5" />
              {requestCart.length > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{requestCart.length}</span>}
            </Button>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
            <Button onClick={logout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex w-full justify-between bg-white/80 backdrop-blur-sm border shadow-sm text-center">
            <TabsTrigger value="prescriptions" className="flex-1 flex flex-row items-center justify-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Prescriptions</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex-1 flex flex-row items-center justify-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex-1 flex flex-row items-center justify-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 flex flex-row items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Prescription Dispensing</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Scan QR & Dispense
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Scan QR Code & Dispense Medicine</DialogTitle>
                    <DialogDescription>Scan patient's QR code to retrieve prescription from database</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* QR Scanner Section */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">Step 1: Scan QR Code</Label>
                      <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                        <div className="text-center">
                          {showQRScanner ? (
                            <div className="flex flex-col items-center gap-2 w-full">
                              <QrScanner
                                delay={300}
                                onError={handleQRError}
                                onScan={handleQRScan}
                                style={{ width: '100%' }}
                              />
                              <Button variant="outline" onClick={() => setShowQRScanner(false)} className="mt-2">Cancel</Button>
                            </div>
                          ) : (
                            <>
                              <QrCode className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                              <p className="text-slate-600 mb-2">Position patient's QR code within the frame</p>
                              <Button className="bg-gradient-to-r from-blue-500 to-teal-500" onClick={() => setShowQRScanner(true)}>
                                <Scan className="h-4 w-4 mr-2" />
                                Start QR Scanner
                              </Button>
                              {scannedId && (
                                <div className="mt-2 text-green-600 text-sm">Scanned ID: {scannedId}</div>
                              )}
                              {scanSuccess && (
                                <div className="mt-2 text-green-600 text-sm">{scanSuccess}</div>
                              )}
                              {scanError && (
                                <div className="mt-2 text-red-600 text-sm">{scanError}</div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Or enter PID manually"
                          className="flex-1 text-xs h-7"
                          value={manualPID}
                          onChange={e => setManualPID(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleManualPIDSubmit(); }}
                        />
                        <Button variant="outline" size="sm" className="h-7 px-2" onClick={handleManualPIDSubmit}>
                          <Search className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Prescriptions</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input 
                        placeholder="Search dispensed prescriptions..." 
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="px-2 py-2 sm:px-4 text-left font-semibold whitespace-nowrap">PID</th>
                        <th className="px-2 py-2 sm:px-4 text-left font-semibold whitespace-nowrap">Patient</th>
                        <th className="px-2 py-2 sm:px-4 text-left font-semibold whitespace-nowrap">Doctor</th>
                        <th className="px-2 py-2 sm:px-4 text-left font-semibold whitespace-nowrap">Date</th>
                        <th className="px-2 py-2 sm:px-4 text-left font-semibold whitespace-nowrap w-12 max-w-[2.5rem]">Status</th>
                        <th className="px-2 py-2 sm:px-4 text-center font-semibold whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dispensedPrescriptions.length > 0 ? dispensedPrescriptions : prescriptions).map((prescription) => (
                        <tr key={prescription.id} className="border-b last:border-b-0 bg-white hover:bg-slate-50">
                          <td className="px-2 py-2 sm:px-4 font-medium text-slate-800 whitespace-nowrap">{prescription.id}</td>
                          <td className="px-2 py-2 sm:px-4 whitespace-nowrap">{prescription.patientName}</td>
                          <td className="px-2 py-2 sm:px-4 whitespace-nowrap">{prescription.doctorName}</td>
                          <td className="px-2 py-2 sm:px-4 whitespace-nowrap">{prescription.date}</td>
                          <td className="px-2 py-2 sm:px-4 whitespace-nowrap w-12 max-w-[2.5rem] text-center">
                            <Badge className={`${getStatusColor(prescription.status)} text-white flex items-center justify-center p-0`} style={{ fontSize: '0.9rem', minHeight: '1.25rem', width: '1.75rem', height: '1.75rem' }}>
                              {getStatusIcon(prescription.status)}
                            </Badge>
                          </td>
                          <td className="px-2 py-2 sm:px-4 text-center whitespace-nowrap">
                            <div className="flex gap-1 justify-center items-center flex-wrap">
                              {prescription.status !== 'Dispensed' && (
                                <Button size="sm" variant="outline" className="w-10 h-8" title="Dispense" onClick={() => handleDispensePrescription(prescription)}><CheckCircle className="h-4 w-4" /></Button>
                              )}
                              <Button size="sm" variant="outline" className="w-10 h-8" title="View" onClick={() => setViewPrescription(prescription)}><Eye className="h-4 w-4" /></Button>
                              <Button size="sm" variant="outline" className="w-10 h-8" title="Download PDF" onClick={() => handleDownloadPDFRow(prescription)}><Download className="h-4 w-4" /></Button>
                              <Button size="sm" variant="outline" className="w-10 h-8" title="Send to WhatsApp" onClick={() => handleSendWhatsAppRow(prescription)}><svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 6.318h-.001a9.87 9.87 0 01-4.988-1.357l-.357-.213-3.714.982.993-3.617-.232-.372a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.987c-.003 5.451-4.437 9.885-9.88 9.885zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.336.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.687a11.86 11.86 0 005.735 1.463h.005c6.554 0 11.889-5.336 11.892-11.892a11.821 11.821 0 00-3.477-8.413z"/></svg></Button>
                              <Button size="sm" variant="destructive" className="w-10 h-8" title="Delete Prescription" onClick={() => setDeletePrescriptionId(prescription.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(dispensedPrescriptions.length === 0 && prescriptions.length === 0) && (
                        <tr>
                          <td colSpan={6} className="text-center text-slate-500 py-8">No prescriptions found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-teal-500" onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </div>
            {/* Add Medicine Modal */}
            {showAddModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">Add New Medicine</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input value={newMedName} onChange={e => setNewMedName(e.target.value)} placeholder="Medicine Name" />
                    </div>
                    <div>
                      <Label>Total Quantity</Label>
                      <Input type="number" min="0" value={newMedQty} onChange={e => setNewMedQty(e.target.value)} placeholder="Total Quantity" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                    <Button onClick={handleAddMedicine}>Add</Button>
                  </div>
                </div>
              </div>
            )}
            {/* Edit Medicine Modal */}
            {editMedIndex !== null && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">Refill Medicine</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Refill Quantity</Label>
                      <Input type="number" min="0" value={editMedRefill} onChange={e => setEditMedRefill(e.target.value)} placeholder="Add Quantity" />
                    </div>
                  </div>
                  <div className="flex justify-between gap-2 mt-6">
                    <Button variant="outline" onClick={() => setEditMedIndex(null)}>Cancel</Button>
                    <Button onClick={handleEditSave}>Save</Button>
                  </div>
                </div>
              </div>
            )}
            {/* Delete Medicine Modal */}
            {deleteMedIndex !== null && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4 text-red-600">Delete Medicine</h3>
                  <p className="mb-4">To confirm deletion, type the medicine name <span className="font-semibold">{inventoryList[deleteMedIndex].name}</span> below:</p>
                  <Input value={deleteConfirmName} onChange={e => setDeleteConfirmName(e.target.value)} placeholder="Type medicine name" />
                  <div className="flex justify-between gap-2 mt-6">
                    <Button variant="outline" onClick={() => setDeleteMedIndex(null)}>Cancel</Button>
                    <Button variant="destructive" disabled={deleteConfirmName.trim().toLowerCase() !== inventoryList[deleteMedIndex].name.toLowerCase()} onClick={handleDeleteMedicine}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {/* Edit Name Modal */}
            {editNameIndex !== null && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">Edit Medicine Name</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Medicine Name</Label>
                      <Input value={editNameValue} onChange={e => setEditNameValue(e.target.value)} placeholder="Medicine Name" />
                    </div>
                  </div>
                  <div className="flex justify-between gap-2 mt-6">
                    <Button variant="outline" onClick={() => setEditNameIndex(null)}>Cancel</Button>
                    <Button onClick={handleEditNameSave}>Save</Button>
                  </div>
                </div>
              </div>
            )}
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <Input
                className="w-full md:w-1/3"
                placeholder="Search medicine by name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div className="flex gap-2">
                <Button variant={inventoryFilter === 'all' ? 'default' : 'outline'} onClick={() => setInventoryFilter('all')}>All</Button>
                <Button variant={inventoryFilter === 'low' ? 'default' : 'outline'} onClick={() => setInventoryFilter('low')}>Low Stock</Button>
                <Button variant={inventoryFilter === 'none' ? 'default' : 'outline'} onClick={() => setInventoryFilter('none')}>No Stock</Button>
              </div>
            </div>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Medicine Inventory</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportInventory}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="px-4 py-2 text-left font-semibold">Name</th>
                          <th className="px-4 py-2 text-left font-semibold">Stock</th>
                          <th className="px-4 py-2 text-left font-semibold">Status</th>
                          <th className="px-4 py-2 text-center font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInventory.map((item, idx) => (
                          <tr key={item.name} className="border-b last:border-b-0 bg-white hover:bg-slate-50">
                            <td className="px-4 py-2 font-medium text-slate-800">{item.name}</td>
                            <td className="px-4 py-2">{item.stock} <span className="text-xs text-slate-500">units</span></td>
                            <td className="px-4 py-2 text-center align-middle">
                              <Badge className={`${getStatusColor(item.status)} text-white flex items-center gap-1 px-2 py-0.5 text-xs`} style={{ fontSize: '0.75rem', minHeight: '1.25rem' }}>
                                {getStatusIcon(item.status)}
                                {item.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex gap-1 justify-center items-center">
                                <Button size="sm" variant="outline" title="Refill" onClick={() => openEditModal(idx)}>
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" title="Edit Name" onClick={() => openEditNameModal(idx)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="secondary" title="Add to Request Cart" onClick={() => handleAddToCart(idx)}>
                                  <ShoppingCart className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive" title="Delete" onClick={() => { setDeleteMedIndex(idx); setDeleteConfirmName(''); }}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredInventory.length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center text-slate-500 py-8">No medicines found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Billing & Payments</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-teal-500">
                <Plus className="h-4 w-4 mr-2" />
                New Bill
              </Button>
            </div>

            {/* Show detailed bill for the most recent bill if it has medicines */}
            {bills.length > 0 && bills[0].medicines && bills[0].medicines.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
                <CardHeader>
                  <CardTitle>Bill for {bills[0].patientName} (PID: {bills[0].prescriptionId})</CardTitle>
                  <CardDescription>Date: {bills[0].date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm mb-2">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="px-4 py-2 text-left font-semibold">Medicine</th>
                          <th className="px-4 py-2 text-right font-semibold">Quantity</th>
                          <th className="px-4 py-2 text-right font-semibold">Unit Price</th>
                          <th className="px-4 py-2 text-right font-semibold">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bills[0].medicines.map((med: any) => (
                          <tr key={med.name} className="border-b last:border-b-0 bg-white hover:bg-slate-50">
                            <td className="px-4 py-2">{med.name}</td>
                            <td className="px-4 py-2 text-right">{med.quantity}</td>
                            <td className="px-4 py-2 text-right">₹{med.unitPrice.toFixed(2)}</td>
                            <td className="px-4 py-2 text-right">₹{med.subtotal.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-right font-bold">Total</td>
                          <td className="px-4 py-2 text-right font-bold">₹{bills[0].amount.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Today's Revenue</p>
                      <p className="text-2xl font-bold">$2,847</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-emerald-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Pending Bills</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">This Month</p>
                      <p className="text-2xl font-bold">$45,230</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bills.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-4 rounded-lg border bg-slate-50/50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{bill.id}</h3>
                          <p className="text-sm text-slate-600">Patient: {bill.patientName}</p>
                          <p className="text-sm text-slate-600">Payment: {bill.paymentMethod}</p>
                          <p className="text-xs text-slate-500">Date: {bill.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-lg">${bill.amount}</p>
                          <Badge className={`${getStatusColor(bill.status)} text-white flex items-center gap-1 mt-1`}>
                            {getStatusIcon(bill.status)}
                            {bill.status}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Analytics & Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Total Prescriptions</p>
                      <p className="text-2xl font-bold text-slate-800">1,247</p>
                      <p className="text-emerald-600 text-xs">+12% this month</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Revenue</p>
                      <p className="text-2xl font-bold text-slate-800">$89,432</p>
                      <p className="text-emerald-600 text-xs">+8% this month</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Active Patients</p>
                      <p className="text-2xl font-bold text-slate-800">456</p>
                      <p className="text-emerald-600 text-xs">+15% this month</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Medicines Dispensed</p>
                      <p className="text-2xl font-bold text-slate-800">3,892</p>
                      <p className="text-emerald-600 text-xs">+22% this month</p>
                    </div>
                    <Pill className="h-8 w-8 text-teal-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Top Prescribed Medicines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Paracetamol", "Amoxicillin", "Aspirin", "Insulin", "Metformin"].map((medicine, index) => (
                      <div key={medicine} className="flex items-center justify-between">
                        <span className="text-slate-700">{medicine}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full" 
                              style={{ width: `${100 - index * 15}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-slate-600">{100 - index * 15}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Monthly Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[65, 78, 82, 89, 95, 88, 92, 98, 85, 91, 96, 100].map((height, index) => (
                      <div key={index} className="flex-1 bg-gradient-to-t from-blue-500 to-teal-500 rounded-t" style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                      <span key={month}>{month}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Add Add-to-Cart Modal */}
      {addToCartIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add to Request Cart</h3>
            <p className="mb-2">Medicine: <span className="font-semibold">{inventoryList[addToCartIndex].name}</span></p>
            <div className="mb-4">
              <Label>Quantity</Label>
              <Input type="number" min="1" value={addToCartQty} onChange={e => setAddToCartQty(e.target.value)} placeholder="Enter quantity" />
            </div>
            <div className="flex justify-between gap-2 mt-6">
              <Button variant="outline" onClick={() => setAddToCartIndex(null)}>Cancel</Button>
              <Button onClick={handleAddToCartConfirm}>Add</Button>
            </div>
          </div>
        </div>
      )}
      {/* Add Request Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Request Cart</h3>
            {requestCart.length === 0 ? (
              <div className="text-center text-slate-500 py-8">No medicines in cart.</div>
            ) : (
              <table className="min-w-full border text-sm mb-4">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-4 py-2 text-left font-semibold">Medicine</th>
                    <th className="px-4 py-2 text-left font-semibold">Quantity</th>
                    <th className="px-4 py-2 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requestCart.map(item => (
                    <tr key={item.name} className="border-b last:border-b-0 bg-white hover:bg-slate-50">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">
                        <Input type="number" min="1" value={item.quantity} onChange={e => {
                          const qty = parseInt(e.target.value, 10) || 1;
                          setRequestCart(cart => cart.map(i => i.name === item.name ? { ...i, quantity: qty } : i));
                        }} className="w-20" />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Button size="sm" variant="destructive" title="Remove" onClick={() => handleRemoveFromCart(item.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex justify-between gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowCart(false)}>Close</Button>
              <Button variant="outline" onClick={handleExportCart}><Download className="h-4 w-4 mr-1" /> Export</Button>
              <Button variant="secondary" onClick={handleSendMail}><Mail className="h-4 w-4 mr-1" /> Send Mail</Button>
            </div>
          </div>
        </div>
      )}
      {/* View Prescription Dialog - Hospital Format, A4 Style */}
      {viewPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
          <div className="relative bg-white p-3 sm:p-6 rounded-lg shadow-2xl w-full max-w-lg border flex flex-col items-center text-xs sm:text-sm">
            {/* (Download/WhatsApp actions moved to table) */}
            {/* PDF Content Start */}
            <div ref={prescriptionRef} className="w-full bg-white p-4 sm:p-8 rounded shadow mx-auto">
            {/* Header: Logo, Clinic, Doctor */}
            <div className="w-full flex flex-col items-center mb-3">
               <img src={clinicInfo.logo} alt="Hospital Header" className="max-w-xs sm:max-w-md w-full max-h-20 h-auto object-contain mb-2 mx-auto" />
            </div>
            <div className="w-full flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
              <div>
                <div className="font-semibold">Doctor: <span className="font-normal">{doctorInfo.name}</span></div>
                <div className="">{doctorInfo.qualifications}</div>
                <div className="">Reg. No.: {doctorInfo.regNo}</div>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="font-semibold">Prescription ID:</span> {viewPrescription.id}
              </div>
            </div>
            {/* Patient Details */}
            <div className="w-full border-t border-b py-2 sm:py-3 mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <div>
                <div><span className="font-semibold">Patient Name:</span> {viewPrescription.patientName}</div>
                <div><span className="font-semibold">Age/Sex:</span> 45 / M</div>
                <div><span className="font-semibold">Weight:</span> 70 kg</div>
              </div>
              <div>
                <div><span className="font-semibold">Date:</span> {viewPrescription.date}</div>
              </div>
            </div>
            {/* Rx Section */}
            <div className="w-full mb-3">
              <div className="font-semibold mb-2 text-slate-700">Rx (Prescription):</div>
              <table className="w-full border text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border px-0.5 py-0.5 text-left w-4">#</th>
                    <th className="border px-0.5 py-0.5 text-left w-32 truncate">Medicine Name</th>
                    <th className="border px-0.5 py-0.5 text-left w-12">Dose</th>
                    <th className="border px-0.5 py-0.5 text-left w-10">Qty</th>
                    <th className="border px-0.5 py-0.5 text-left w-16">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {viewPrescription.medicines?.map((med: any, idx: number) => (
                    <tr key={idx}>
                      <td className="border px-0.5 py-0.5 w-4">{idx + 1}</td>
                      <td className="border px-0.5 py-0.5 w-32 truncate" title={med.name}>{med.name}</td>
                      <td className="border px-0.5 py-0.5 w-12">{med.dose || "500mg"}</td>
                      <td className="border px-0.5 py-0.5 w-10">{med.quantity || 1}</td>
                      <td className="border px-0.5 py-0.5 w-16">{med.duration || "5 days"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Instructions */}
            <div className="w-full mb-3">
              <div className="font-semibold mb-2 text-slate-700">Instructions:</div>
              <ul className="list-disc list-inside text-slate-800 text-xs sm:text-sm">
                <li>Take after meals</li>
                <li>Drink plenty of fluids</li>
                <li>Rest as needed</li>
              </ul>
            </div>
            {/* Signature & Stamp */}
            <div className="w-full flex flex-col items-end mt-6">
              <div className="h-8 w-32 sm:w-40 border-b border-slate-400 mb-1"></div>
              <div className="text-slate-600 text-xs">Doctor’s Signature & Stamp</div>
            </div>
            {/* Dispense Button if not already dispensed */}
            {viewPrescription.status !== 'Dispensed' && (
              <div className="flex justify-end w-full mt-2">
                <Button variant="default" size="sm" onClick={() => handleDispensePrescription(viewPrescription)}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Dispense
                </Button>
              </div>
            )}
            </div>
            {/* PDF Content End */}
            {/* Close Icon Button */}
            <button
              className="absolute top-3 right-3 p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 focus:outline-none"
              onClick={() => setViewPrescription(null)}
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      {/* Hidden PDF Preview for Download */}
      {pdfPreviewPrescription && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '800px', background: 'white', zIndex: -1 }}>
          <div ref={pdfPreviewRef} className="bg-white p-0 rounded shadow mx-auto w-full pb-8">
            <div className="flex flex-col items-center mb-1">
              <img src={clinicInfo.logo} alt="Hospital Header" className="max-w-xs w-full h-auto object-contain mb-2 mx-auto" />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start mb-1 gap-1">
              <div>
                <div className="font-semibold">Doctor: <span className="font-normal">{doctorInfo.name}</span></div>
                <div className="">{doctorInfo.qualifications}</div>
                <div className="">Reg. No.: {doctorInfo.regNo}</div>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="font-semibold">Prescription ID:</span> {pdfPreviewPrescription.id}
              </div>
            </div>
            <div className="border-t border-b py-1 sm:py-2 mb-1 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
              <div>
                <div><span className="font-semibold">Patient Name:</span> {pdfPreviewPrescription.patientName}</div>
                <div><span className="font-semibold">Age/Sex:</span> 45 / M</div>
                <div><span className="font-semibold">Weight:</span> 70 kg</div>
              </div>
              <div>
                <div><span className="font-semibold">Date:</span> {pdfPreviewPrescription.date}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-1 text-slate-700">Rx (Prescription):</div>
              <table className="w-full border whitespace-nowrap" style={{ fontSize: '12px', lineHeight: 1.4 }}>
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border py-2 px-2 whitespace-nowrap text-left w-4">#</th>
                    <th className="border py-2 px-2 whitespace-nowrap text-left w-32 truncate">Medicine Name</th>
                    <th className="border py-2 px-2 whitespace-nowrap text-left w-12">Dose</th>
                    <th className="border py-2 px-2 whitespace-nowrap text-left w-10">Qty</th>
                    <th className="border py-2 px-2 whitespace-nowrap text-left w-16">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {pdfPreviewPrescription.medicines?.map((med: any, idx: number) => (
                    <tr key={idx}>
                      <td className="border py-2 px-2 whitespace-nowrap w-4">{idx + 1}</td>
                      <td className="border py-2 px-2 whitespace-nowrap w-32 truncate" title={med.name}>{med.name}</td>
                      <td className="border py-2 px-2 whitespace-nowrap w-12">{med.dose || "500mg"}</td>
                      <td className="border py-2 px-2 whitespace-nowrap w-10">{med.quantity || 1}</td>
                      <td className="border py-2 px-2 whitespace-nowrap w-16">{med.duration || "5 days"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mb-1">
              <div className="font-semibold mb-1 text-slate-700">Instructions:</div>
              <ul className="list-disc list-inside text-slate-800 text-xs">
                <li>Take after meals</li>
                <li>Drink plenty of fluids</li>
                <li>Rest as needed</li>
              </ul>
            </div>
            <div className="flex flex-col items-end mt-10">
              <div className="h-20 w-56 border-b border-slate-400 mb-4"></div>
              <div className="text-slate-600 text-xs">Doctor’s Signature & Stamp</div>
            </div>
          </div>
        </div>
      )}
      {/* Add a confirmation modal for deleting prescription: */}
      {deletePrescriptionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-red-600">Delete Prescription</h3>
            <p className="mb-4">Are you sure you want to delete this prescription?</p>
            <div className="flex justify-between gap-2 mt-6">
              <Button variant="outline" onClick={() => setDeletePrescriptionId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeletePrescription}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pharma;