import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Search, FileText, Building2, Calendar, AlertTriangle, CheckCircle, 
  File, ArrowUpDown, Eye, Plus, FilePlus, Car, CarFront 
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";

// Mock claims data
const claimsData = [
  {
    id: "CLM-2023456",
    patientId: "PT-10045",
    hospital: "Memorial Hospital",
    service: "General Surgery",
    amount: 3850.75,
    date: "2023-06-15",
    status: "approved",
    fraudScore: 12,
    flagged: false,
    type: "hospital"
  },
  {
    id: "CLM-2023457",
    patientId: "PT-23781",
    hospital: "Sunshine Medical Center",
    service: "Cardiology",
    amount: 5240.50,
    date: "2023-06-14",
    status: "reviewing",
    fraudScore: 54,
    flagged: true,
    type: "hospital"
  },
  {
    id: "CLM-2023458",
    patientId: "PT-87452",
    hospital: "City General Hospital",
    service: "Orthopedics",
    amount: 2875.25,
    date: "2023-06-14",
    status: "approved",
    fraudScore: 18,
    flagged: false,
    type: "hospital"
  },
  {
    id: "CLM-2023459",
    patientId: "PT-43921",
    hospital: "Riverside Health",
    service: "Emergency",
    amount: 4950.00,
    date: "2023-06-13",
    status: "rejected",
    fraudScore: 87,
    flagged: true,
    type: "hospital"
  },
  {
    id: "CLM-2023460",
    patientId: "PT-56302",
    hospital: "Mountain View Medical",
    service: "Imaging",
    amount: 1250.75,
    date: "2023-06-13",
    status: "approved",
    fraudScore: 8,
    flagged: false,
    type: "hospital"
  },
  {
    id: "CLM-2023461",
    patientId: "PT-19405",
    hospital: "Ocean Health System",
    service: "Primary Care",
    amount: 375.50,
    date: "2023-06-12",
    status: "approved",
    fraudScore: 15,
    flagged: false,
    type: "hospital"
  },
  {
    id: "CLM-2023462",
    patientId: "PT-67392",
    hospital: "Cedar Valley Hospital",
    service: "Neurology",
    amount: 4325.25,
    date: "2023-06-12",
    status: "reviewing",
    fraudScore: 62,
    flagged: true,
    type: "hospital"
  },
  {
    id: "CLM-2023463",
    patientId: "PT-82045",
    hospital: "Oakwood Medical Center",
    service: "Maternity",
    amount: 5890.00,
    date: "2023-06-11",
    status: "rejected",
    fraudScore: 76,
    flagged: true,
    type: "hospital"
  },
  {
    id: "CLM-2023464",
    patientId: "PT-30457",
    hospital: "Memorial Hospital",
    service: "Pediatrics",
    amount: 1450.25,
    date: "2023-06-11",
    status: "approved",
    fraudScore: 21,
    flagged: false,
    type: "hospital"
  },
  {
    id: "CLM-2023465",
    patientId: "PT-75982",
    hospital: "Sunshine Medical Center",
    service: "Dermatology",
    amount: 825.50,
    date: "2023-06-10",
    status: "reviewing",
    fraudScore: 35,
    flagged: true,
    type: "hospital"
  },
  // Vehicle insurance claims
  {
    id: "CLM-2023466",
    vehicleId: "VH-10045",
    provider: "AllState Insurance",
    service: "Accident Damage",
    amount: 2850.75,
    date: "2023-06-15",
    status: "approved",
    fraudScore: 10,
    flagged: false,
    type: "vehicle"
  },
  {
    id: "CLM-2023467",
    vehicleId: "VH-23781",
    provider: "Progressive",
    service: "Windshield Replacement",
    amount: 1240.50,
    date: "2023-06-14",
    status: "reviewing",
    fraudScore: 22,
    flagged: false,
    type: "vehicle"
  },
  {
    id: "CLM-2023468",
    vehicleId: "VH-87452",
    provider: "GEICO",
    service: "Total Loss",
    amount: 12875.25,
    date: "2023-06-14",
    status: "reviewing",
    fraudScore: 68,
    flagged: true,
    type: "vehicle"
  },
  {
    id: "CLM-2023469",
    vehicleId: "VH-43921",
    provider: "State Farm",
    service: "Collision Repair",
    amount: 3950.00,
    date: "2023-06-13",
    status: "rejected",
    fraudScore: 82,
    flagged: true,
    type: "vehicle"
  },
  {
    id: "CLM-2023470",
    vehicleId: "VH-56302",
    provider: "Liberty Mutual",
    service: "Theft Recovery",
    amount: 8250.75,
    date: "2023-06-12",
    status: "approved",
    fraudScore: 12,
    flagged: false,
    type: "vehicle"
  }
];

// Claim detail (when a claim is clicked)
const claimDetail = {
  id: "CLM-2023457",
  patientId: "PT-23781",
  patientName: "John Doe",
  patientAge: 45,
  hospital: "Sunshine Medical Center",
  service: "Cardiology",
  procedure: "Cardiac Catheterization",
  provider: "Dr. Sarah Johnson",
  amount: 5240.50,
  date: "2023-06-14",
  status: "reviewing",
  fraudScore: 54,
  flagged: true,
  type: "hospital",
  flags: [
    "Unusual billing pattern detected",
    "Provider has had multiple similar claims rejected",
    "Procedure cost above average for this region"
  ],
  timeline: [
    { date: "2023-06-14 09:23:15", event: "Claim submitted", user: "System" },
    { date: "2023-06-14 09:23:45", event: "AI analysis flagged potential issues", user: "FraudShield AI" },
    { date: "2023-06-14 11:30:12", event: "Assigned for manual review", user: "System" },
    { date: "2023-06-14 14:45:30", event: "Documentation requested", user: "Mark Wilson" }
  ]
};

// Vehicle claim detail
const vehicleClaimDetail = {
  id: "CLM-2023468",
  vehicleId: "VH-87452",
  vehicleMake: "Honda",
  vehicleModel: "Accord",
  vehicleYear: 2020,
  provider: "GEICO",
  service: "Total Loss",
  damageDetails: "Vehicle deemed total loss after severe front-end collision",
  policyNumber: "POL-74529683",
  amount: 12875.25,
  date: "2023-06-14",
  status: "reviewing",
  fraudScore: 68,
  flagged: true,
  type: "vehicle",
  flags: [
    "Recent policy changes before incident",
    "Multiple claims within short timeframe",
    "Vehicle value assessment inconsistencies"
  ],
  timeline: [
    { date: "2023-06-14 08:15:22", event: "Claim submitted", user: "System" },
    { date: "2023-06-14 08:22:35", event: "AI analysis flagged potential issues", user: "FraudShield AI" },
    { date: "2023-06-14 10:45:12", event: "Assigned for manual review", user: "System" },
    { date: "2023-06-14 13:30:50", event: "Vehicle inspection requested", user: "Alex Thompson" }
  ]
};

// Add new claim form schema
const newClaimSchema = z.object({
  patientId: z.string().min(2, {
    message: "Patient ID must be at least 2 characters.",
  }).optional(),
  patientName: z.string().min(2, {
    message: "Patient name must be at least 2 characters.",
  }).optional(),
  vehicleId: z.string().min(2, {
    message: "Vehicle ID must be at least 2 characters.",
  }).optional(),
  vehicleMake: z.string().min(2, {
    message: "Vehicle make must be at least 2 characters.",
  }).optional(),
  vehicleModel: z.string().min(2, {
    message: "Vehicle model must be at least 2 characters.",
  }).optional(),
  hospital: z.string().min(2, {
    message: "Hospital is required.",
  }).optional(),
  provider: z.string().min(2, {
    message: "Provider is required.",
  }).optional(),
  service: z.string().min(2, {
    message: "Service is required.",
  }),
  type: z.enum(["hospital", "vehicle"]),
  amount: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 
    { message: "Amount must be a positive number." }
  ),
});

const Claims = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [claimType, setClaimType] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof claimsData[0] | null;
    direction: 'ascending' | 'descending';
  }>({
    key: "date",
    direction: "descending"
  });
  const [viewingClaim, setViewingClaim] = useState<any | null>(null);
  const [isAddHospitalDialogOpen, setIsAddHospitalDialogOpen] = useState(false);
  const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);
  
  // Replace the single form with two separate forms
  const hospitalForm = useForm<z.infer<typeof newClaimSchema>>({
    resolver: zodResolver(newClaimSchema),
    defaultValues: {
      patientId: "",
      patientName: "",
      hospital: "",
      service: "",
      type: "hospital",
      amount: "",
    },
  });

  const vehicleForm = useForm<z.infer<typeof newClaimSchema>>({
    resolver: zodResolver(newClaimSchema),
    defaultValues: {
      vehicleId: "",
      vehicleMake: "",
      vehicleModel: "",
      provider: "",
      service: "",
      type: "vehicle",
      amount: "",
    },
  });

  // Watch the claim type to conditionally show form fields
  const watchClaimType = hospitalForm.watch("type");
  
  // Sorting function
  const sortedClaims = [...claimsData].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  
  // Filtering by tab, claim type, and search term
  const filteredClaims = sortedClaims.filter(claim => {
    // Filter by claim type first
    if (claimType !== "all" && claim.type !== claimType) {
      return false;
    }
    
    // Filter by search term - includes checking for vehicle fields
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.type === "hospital" && claim.hospital?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (claim.type === "vehicle" && claim.provider?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      claim.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.type === "hospital" && claim.patientId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (claim.type === "vehicle" && claim.vehicleId?.toLowerCase().includes(searchTerm.toLowerCase()));
      
    // Filter by status tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "approved") return claim.status === "approved" && matchesSearch;
    if (activeTab === "reviewing") return claim.status === "reviewing" && matchesSearch;
    if (activeTab === "rejected") return claim.status === "rejected" && matchesSearch;
    if (activeTab === "flagged") return claim.flagged && matchesSearch;
    
    return matchesSearch;
  });
  
  // Request sort
  const requestSort = (key: keyof typeof claimsData[0]) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "reviewing":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Reviewing</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get fraud score badge
  const getFraudScoreBadge = (score: number) => {
    if (score < 30) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{score}%</Badge>;
    } else if (score < 70) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{score}%</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{score}%</Badge>;
    }
  };
  
  // Handle claim click to show detail
  const handleViewClaim = (claimId: string, type: string) => {
    if (type === "vehicle") {
      setViewingClaim(vehicleClaimDetail);
    } else {
      setViewingClaim(claimDetail);
    }
  };
  
  // Handle form submission for new claim
  const handleNewClaim = (values: z.infer<typeof newClaimSchema>) => {
    // In a real app, this would connect to your backend API
    console.log("New claim submitted:", values);
    
    // Create a new claim object with generated ID and default values
    const newClaim = {
      id: `CLM-${Math.floor(Math.random() * 10000)}`,
      ...(values.type === "hospital" ? {
        patientId: values.patientId,
        hospital: values.hospital,
      } : {
        vehicleId: values.vehicleId,
        provider: values.provider,
      }),
      service: values.service,
      amount: parseFloat(values.amount),
      date: new Date().toISOString().split('T')[0],
      status: "reviewing",
      fraudScore: Math.floor(Math.random() * 30) + 10, // Random score between 10-40
      flagged: false,
      type: values.type
    };
    
    // In a real application, you would add this to your database
    // For now, we'll just show a success message
    toast({
      title: "Claim Submitted",
      description: `Claim ${newClaim.id} has been successfully submitted for review.`,
    });
    
    setIsAddHospitalDialogOpen(false);
    setIsAddVehicleDialogOpen(false);
    hospitalForm.reset();
    vehicleForm.reset();
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Claims</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddHospitalDialogOpen(true)}>
            <Building2 className="mr-2 h-4 w-4" />
            New Hospital Claim
          </Button>
          <Button onClick={() => setIsAddVehicleDialogOpen(true)}>
            <Car className="mr-2 h-4 w-4" />
            New Vehicle Claim
          </Button>
        </div>
      </div>
      
      {/* Claims Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Claims Management
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search claims..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex">
                <Button 
                  variant={claimType === "all" ? "default" : "outline"} 
                  onClick={() => setClaimType("all")}
                  className="rounded-r-none"
                >
                  All
                </Button>
                <Button 
                  variant={claimType === "hospital" ? "default" : "outline"} 
                  onClick={() => setClaimType("hospital")}
                  className="rounded-none border-l-0"
                >
                  <Building2 className="mr-1 h-4 w-4" /> Hospital
                </Button>
                <Button 
                  variant={claimType === "vehicle" ? "default" : "outline"} 
                  onClick={() => setClaimType("vehicle")}
                  className="rounded-l-none border-l-0"
                >
                  <Car className="mr-1 h-4 w-4" /> Vehicle
                </Button>
              </div>
            </div>
          </div>
          <CardDescription>
            Review and manage insurance claims
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Claims</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="flagged">Flagged</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="m-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="font-medium text-left py-3 px-4">
                        <Button 
                          variant="ghost" 
                          className="font-medium p-0 hover:bg-transparent"
                          onClick={() => requestSort('id')}
                        >
                          Claim ID
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="font-medium text-left py-3 px-4">
                        ID
                      </th>
                      <th className="font-medium text-left py-3 px-4">
                        <Button 
                          variant="ghost" 
                          className="font-medium p-0 hover:bg-transparent"
                          onClick={() => requestSort(claimType === "vehicle" ? 'provider' : 'hospital')}
                        >
                          {claimType === "vehicle" ? "Provider" : "Hospital"}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="font-medium text-left py-3 px-4">Service</th>
                      <th className="font-medium text-left py-3 px-4">
                        <Button 
                          variant="ghost" 
                          className="font-medium p-0 hover:bg-transparent"
                          onClick={() => requestSort('amount')}
                        >
                          Amount
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="font-medium text-left py-3 px-4">
                        <Button 
                          variant="ghost" 
                          className="font-medium p-0 hover:bg-transparent"
                          onClick={() => requestSort('date')}
                        >
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="font-medium text-left py-3 px-4">Status</th>
                      <th className="font-medium text-left py-3 px-4">
                        <Button 
                          variant="ghost" 
                          className="font-medium p-0 hover:bg-transparent"
                          onClick={() => requestSort('fraudScore')}
                        >
                          Fraud Score
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="font-medium text-left py-3 px-4">Type</th>
                      <th className="font-medium text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClaims.map((claim) => (
                      <tr key={claim.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">
                          <div className="flex items-center">
                            {claim.flagged && (
                              <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                            )}
                            {claim.id}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {claim.type === "hospital" ? claim.patientId : claim.vehicleId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {claim.type === "hospital" ? (
                              <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                            ) : (
                              <CarFront className="mr-2 h-4 w-4 text-muted-foreground" />
                            )}
                            {claim.type === "hospital" ? claim.hospital : claim.provider}
                          </div>
                        </td>
                        <td className="py-3 px-4">{claim.service}</td>
                        <td className="py-3 px-4">${claim.amount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {claim.date}
                          </div>
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(claim.status)}</td>
                        <td className="py-3 px-4">{getFraudScoreBadge(claim.fraudScore)}</td>
                        <td className="py-3 px-4">
                          <Badge className={
                            claim.type === "hospital" 
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100" 
                              : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          }>
                            {claim.type === "hospital" ? "Hospital" : "Vehicle"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewClaim(claim.id, claim.type)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Claim Detail Dialog */}
      <Dialog open={!!viewingClaim} onOpenChange={(open) => !open && setViewingClaim(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {viewingClaim?.type === "vehicle" ? (
                <Car className="mr-2 h-5 w-5" />
              ) : (
                <File className="mr-2 h-5 w-5" />
              )}
              Claim Details
            </DialogTitle>
            <DialogDescription>
              Detailed information and AI analysis for claim {viewingClaim?.id}
            </DialogDescription>
          </DialogHeader>
          
          {viewingClaim && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Claim Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Claim ID:</span>
                      <span className="text-sm font-medium">{viewingClaim.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Date Submitted:</span>
                      <span className="text-sm font-medium">{viewingClaim.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Amount:</span>
                      <span className="text-sm font-medium">${viewingClaim.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <span>{getStatusBadge(viewingClaim.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Fraud Score:</span>
                      <span>{getFraudScoreBadge(viewingClaim.fraudScore)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Type:</span>
                      <Badge className={
                        viewingClaim.type === "hospital" 
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100" 
                          : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                      }>
                        {viewingClaim.type === "hospital" ? "Hospital" : "Vehicle"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {viewingClaim.type === "hospital" ? "Patient & Provider" : "Vehicle & Provider"}
                  </h3>
                  <div className="space-y-2">
                    {viewingClaim.type === "hospital" ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm">Patient ID:</span>
                          <span className="text-sm font-medium">{viewingClaim.patientId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Patient Name:</span>
                          <span className="text-sm font-medium">{viewingClaim.patientName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Patient Age:</span>
                          <span className="text-sm font-medium">{viewingClaim.patientAge}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Hospital:</span>
                          <span className="text-sm font-medium">{viewingClaim.hospital}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Provider:</span>
                          <span className="text-sm font-medium">{viewingClaim.provider}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm">Vehicle ID:</span>
                          <span className="text-sm font-medium">{viewingClaim.vehicleId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Make:</span>
                          <span className="text-sm font-medium">{viewingClaim.vehicleMake}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Model:</span>
                          <span className="text-sm font-medium">{viewingClaim.vehicleModel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Year:</span>
                          <span className="text-sm font-medium">{viewingClaim.vehicleYear}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Insurance Provider:</span>
                          <span className="text-sm font-medium">{viewingClaim.provider}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Policy Number:</span>
                          <span className="text-sm font-medium">{viewingClaim.policyNumber}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Service/Damage Information */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {viewingClaim.type === "hospital" ? "Medical Information" : "Damage Information"}
                </h3>
                <div className="p-3 bg-muted rounded-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Service Category:</span>
                    <span className="text-sm font-medium">{viewingClaim.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">
                      {viewingClaim.type === "hospital" ? "Procedure:" : "Details:"}
                    </span>
                    <span className="text-sm font-medium">
                      {viewingClaim.type === "hospital" ? viewingClaim.procedure
