
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Search, FileText, Building2, Calendar, AlertTriangle, CheckCircle, File, 
  ArrowUpDown, Eye, Plus, FilePlus, IndianRupee, Car, Ambulance
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define types for our claims
type HealthClaim = {
  id: string;
  patientId: string;
  hospital: string;
  service: string;
  amount: number;
  date: string;
  status: string;
  fraudScore: number;
  flagged: boolean;
  type: "health";
  patientName?: string;
};

type VehicleClaim = {
  id: string;
  policyId: string;
  vehicleNo: string;
  vehicleModel: string;
  damageType: string;
  amount: number;
  date: string;
  status: string;
  fraudScore: number;
  flagged: boolean;
  type: "vehicle";
  policyHolder?: string;
};

type Claim = HealthClaim | VehicleClaim;

// Define types for claim details
type HealthClaimDetail = {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  hospital: string;
  service: string;
  procedure: string;
  provider: string;
  amount: number;
  date: string;
  status: string;
  fraudScore: number;
  flagged: boolean;
  type: "health";
  flags: string[];
  timeline: { date: string; event: string; user: string }[];
};

type VehicleClaimDetail = {
  id: string;
  policyId: string;
  policyHolder: string;
  vehicleNo: string;
  vehicleModel: string;
  yearOfManufacture: number;
  damageType: string;
  workshopName: string;
  amount: number;
  date: string;
  status: string;
  fraudScore: number;
  flagged: boolean;
  type: "vehicle";
  flags: string[];
  timeline: { date: string; event: string; user: string }[];
};

type ClaimDetail = HealthClaimDetail | VehicleClaimDetail;

// Mock claims data
const claimsData: Claim[] = [
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
    type: "health"
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
    type: "health"
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
    type: "health"
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
    type: "health"
  },
  {
    id: "VCL-1023456",
    policyId: "POL-57301",
    vehicleNo: "MH02AB1234",
    vehicleModel: "Honda City",
    damageType: "Collision",
    amount: 32500.00,
    date: "2023-06-15",
    status: "approved",
    fraudScore: 15,
    flagged: false,
    type: "vehicle"
  },
  {
    id: "VCL-1023457",
    policyId: "POL-68942",
    vehicleNo: "DL01CA5678",
    vehicleModel: "Maruti Swift",
    damageType: "Theft Recovery",
    amount: 75000.00,
    date: "2023-06-14",
    status: "reviewing",
    fraudScore: 62,
    flagged: true,
    type: "vehicle"
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
    type: "health"
  },
  {
    id: "VCL-1023458",
    policyId: "POL-45123",
    vehicleNo: "KA03DF9012",
    vehicleModel: "Hyundai i20",
    damageType: "Natural Disaster",
    amount: 45000.00,
    date: "2023-06-12",
    status: "reviewing",
    fraudScore: 35,
    flagged: false,
    type: "vehicle"
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
    type: "health"
  },
  {
    id: "VCL-1023459",
    policyId: "POL-23478",
    vehicleNo: "TN07GH3456",
    vehicleModel: "Toyota Fortuner",
    damageType: "Third Party",
    amount: 120000.00,
    date: "2023-06-11",
    status: "rejected",
    fraudScore: 78,
    flagged: true,
    type: "vehicle"
  }
];

// Claim detail (when a claim is clicked)
const healthClaimDetail: HealthClaimDetail = {
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
  type: "health",
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

const vehicleClaimDetail: VehicleClaimDetail = {
  id: "VCL-1023457",
  policyId: "POL-68942",
  policyHolder: "Rahul Sharma",
  vehicleNo: "DL01CA5678",
  vehicleModel: "Maruti Swift",
  yearOfManufacture: 2020,
  damageType: "Theft Recovery",
  workshopName: "AutoFix Services",
  amount: 75000.00,
  date: "2023-06-14",
  status: "reviewing",
  fraudScore: 62,
  flagged: true,
  type: "vehicle",
  flags: [
    "Vehicle value significantly higher than market average",
    "Multiple theft claims from same area in past month",
    "Repair estimate exceeds standard rates for model"
  ],
  timeline: [
    { date: "2023-06-14 08:15:22", event: "Claim submitted", user: "System" },
    { date: "2023-06-14 08:30:45", event: "AI analysis flagged potential issues", user: "FraudShield AI" },
    { date: "2023-06-14 10:45:12", event: "Assigned for manual review", user: "System" },
    { date: "2023-06-14 13:20:30", event: "Additional documentation requested", user: "Priya Patel" }
  ]
};

// Add new health claim form schema
const newHealthClaimSchema = z.object({
  patientId: z.string().min(2, {
    message: "Patient ID must be at least 2 characters.",
  }),
  patientName: z.string().min(2, {
    message: "Patient name must be at least 2 characters.",
  }),
  hospital: z.string().min(2, {
    message: "Hospital is required.",
  }),
  service: z.string().min(2, {
    message: "Service is required.",
  }),
  amount: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 
    { message: "Amount must be a positive number." }
  ),
});

// Add new vehicle claim form schema
const newVehicleClaimSchema = z.object({
  policyId: z.string().min(2, {
    message: "Policy ID must be at least 2 characters.",
  }),
  policyHolder: z.string().min(2, {
    message: "Policy holder name must be at least 2 characters.",
  }),
  vehicleNo: z.string().min(2, {
    message: "Vehicle number is required.",
  }),
  vehicleModel: z.string().min(2, {
    message: "Vehicle model is required.",
  }),
  damageType: z.string().min(2, {
    message: "Damage type is required.",
  }),
  workshopName: z.string().min(2, {
    message: "Workshop name is required.",
  }),
  amount: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 
    { message: "Amount must be a positive number." }
  ),
});

const Claims = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Claim | null;
    direction: 'ascending' | 'descending';
  }>({
    key: "date",
    direction: "descending"
  });
  const [viewingClaim, setViewingClaim] = useState<ClaimDetail | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [claimTypeToAdd, setClaimTypeToAdd] = useState<"health" | "vehicle">("health");
  const [claims, setClaims] = useState<Claim[]>([...claimsData]);
  const [insuranceFilter, setInsuranceFilter] = useState<"all" | "health" | "vehicle">("all");
  
  const healthClaimForm = useForm<z.infer<typeof newHealthClaimSchema>>({
    resolver: zodResolver(newHealthClaimSchema),
    defaultValues: {
      patientId: "",
      patientName: "",
      hospital: "",
      service: "",
      amount: "",
    },
  });
  
  const vehicleClaimForm = useForm<z.infer<typeof newVehicleClaimSchema>>({
    resolver: zodResolver(newVehicleClaimSchema),
    defaultValues: {
      policyId: "",
      policyHolder: "",
      vehicleNo: "",
      vehicleModel: "",
      damageType: "",
      workshopName: "",
      amount: "",
    },
  });
  
  // Sorting function
  const sortedClaims = [...claims].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  
  // Filtering by tab, insurance type and search term
  const filteredClaims = sortedClaims.filter(claim => {
    // Filter by search term
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.type === "health" ? 
        (claim.hospital?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         claim.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         claim.patientId?.toLowerCase().includes(searchTerm.toLowerCase()))
      :
        (claim.vehicleNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         claim.vehicleModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         claim.policyId?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    
    // Filter by insurance type
    const matchesInsuranceType = 
      insuranceFilter === "all" || claim.type === insuranceFilter;
      
    // Filter by status tab
    const matchesStatusTab = 
      activeTab === "all" ||
      (activeTab === "approved" && claim.status === "approved") ||
      (activeTab === "reviewing" && claim.status === "reviewing") ||
      (activeTab === "rejected" && claim.status === "rejected") ||
      (activeTab === "flagged" && claim.flagged);
    
    return matchesSearch && matchesInsuranceType && matchesStatusTab;
  });
  
  // Request sort
  const requestSort = (key: keyof Claim) => {
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
  const handleViewClaim = (claimId: string) => {
    // Find claim by ID
    const claim = claims.find(c => c.id === claimId);
    
    if (claim) {
      if (claim.type === "health") {
        setViewingClaim(healthClaimDetail);
      } else {
        setViewingClaim(vehicleClaimDetail);
      }
    }
  };
  
  // Handle form submission for new health claim
  const handleNewHealthClaim = (values: z.infer<typeof newHealthClaimSchema>) => {
    // Create a new claim object with generated ID and default values
    const newClaimId = `CLM-${Math.floor(Math.random() * 10000)}`;
    const newClaim: HealthClaim = {
      id: newClaimId,
      patientId: values.patientId,
      patientName: values.patientName,
      hospital: values.hospital,
      service: values.service,
      amount: parseFloat(values.amount),
      date: new Date().toISOString().split('T')[0],
      status: "reviewing",
      fraudScore: Math.floor(Math.random() * 30) + 10, // Random score between 10-40
      flagged: false,
      type: "health"
    };
    
    // Add new claim to the claims state
    setClaims(prevClaims => [newClaim, ...prevClaims]);
    
    // Switch to the reviewing tab to show the new claim
    setActiveTab("reviewing");
    setInsuranceFilter("all");
    
    toast({
      title: "Health Claim Submitted",
      description: `Claim ${newClaimId} has been successfully submitted for review.`,
    });
    
    setIsAddDialogOpen(false);
    healthClaimForm.reset();
  };
  
  // Handle form submission for new vehicle claim
  const handleNewVehicleClaim = (values: z.infer<typeof newVehicleClaimSchema>) => {
    // Create a new claim object with generated ID and default values
    const newClaimId = `VCL-${Math.floor(Math.random() * 10000)}`;
    const newClaim: VehicleClaim = {
      id: newClaimId,
      policyId: values.policyId,
      policyHolder: values.policyHolder,
      vehicleNo: values.vehicleNo,
      vehicleModel: values.vehicleModel,
      damageType: values.damageType,
      amount: parseFloat(values.amount),
      date: new Date().toISOString().split('T')[0],
      status: "reviewing",
      fraudScore: Math.floor(Math.random() * 30) + 10, // Random score between 10-40
      flagged: false,
      type: "vehicle"
    };
    
    // Add new claim to the claims state
    setClaims(prevClaims => [newClaim, ...prevClaims]);
    
    // Switch to the reviewing tab to show the new claim
    setActiveTab("reviewing");
    setInsuranceFilter("all");
    
    toast({
      title: "Vehicle Claim Submitted",
      description: `Claim ${newClaimId} has been successfully submitted for review.`,
    });
    
    setIsAddDialogOpen(false);
    vehicleClaimForm.reset();
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Claims</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <FilePlus className="mr-2 h-4 w-4" />
          Add New Claim
        </Button>
      </div>
      
      {/* Claims Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Claims Management
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search claims..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select 
                value={insuranceFilter} 
                onValueChange={(value) => setInsuranceFilter(value as "all" | "health" | "vehicle")}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Insurance Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="health">
                    <div className="flex items-center">
                      <Ambulance className="mr-2 h-4 w-4" />
                      Health
                    </div>
                  </SelectItem>
                  <SelectItem value="vehicle">
                    <div className="flex items-center">
                      <Car className="mr-2 h-4 w-4" />
                      Vehicle
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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
                      <th className="font-medium text-left py-3 px-4">Type</th>
                      <th className="font-medium text-left py-3 px-4">ID</th>
                      <th className="font-medium text-left py-3 px-4">
                        <Button 
                          variant="ghost" 
                          className="font-medium p-0 hover:bg-transparent"
                          onClick={() => requestSort('hospital')}
                        >
                          Provider
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="font-medium text-left py-3 px-4">Service/Damage</th>
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
                          {claim.type === "health" ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-50">
                              <Ambulance className="mr-1 h-3 w-3" /> Health
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-800 hover:bg-green-50">
                              <Car className="mr-1 h-3 w-3" /> Vehicle
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {claim.type === "health" ? claim.patientId : claim.policyId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {claim.type === "health" ? (
                              <>
                                <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                                {claim.hospital}
                              </>
                            ) : (
                              <>
                                <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                                {claim.vehicleModel}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {claim.type === "health" ? claim.service : claim.damageType}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <IndianRupee className="mr-1 h-3 w-3" />
                            {claim.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {claim.date}
                          </div>
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(claim.status)}</td>
                        <td className="py-3 px-4">{getFraudScoreBadge(claim.fraudScore)}</td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewClaim(claim.id)}
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
              <File className="mr-2 h-5 w-5" />
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
                      <span className="text-sm font-medium">
                        <div className="flex items-center">
                          <IndianRupee className="mr-1 h-3 w-3" />
                          {viewingClaim.amount.toFixed(2)}
                        </div>
                      </span>
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
                      <span className="text-sm">Insurance Type:</span>
                      <span className="text-sm font-medium">
                        {viewingClaim.type === "health" ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-800">
                            <Ambulance className="mr-1 h-3 w-3" /> Health
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-800">
                            <Car className="mr-1 h-3 w-3" /> Vehicle
                          </Badge>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {viewingClaim.type === "health" ? "Patient & Provider" : "Vehicle & Policyholder"}
                  </h3>
                  <div className="space-y-2">
                    {viewingClaim.type === "health" ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm">Patient ID:</span>
                          <span className="text-sm font-medium">{(viewingClaim as HealthClaimDetail).patientId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Patient Name:</span>
                          <span className="text-sm font-medium">{(viewingClaim as HealthClaimDetail).patientName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Patient Age:</span>
                          <span className="text-sm font-medium">{(viewingClaim as HealthClaimDetail).patientAge}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Hospital:</span>
                          <span className="text-sm font-medium">{(viewingClaim as HealthClaimDetail).hospital}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Provider:</span>
                          <span className="text-sm font-medium">{(viewingClaim as HealthClaimDetail).provider}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm">Policy ID:</span>
                          <span className="text-sm font-medium">{(viewingClaim as VehicleClaimDetail).policyId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Policy Holder:</span>
                          <span className="text-sm font-medium">{(viewingClaim as VehicleClaimDetail).policyHolder}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Vehicle Number:</span>
                          <span className="text-sm font-medium">{(viewingClaim as VehicleClaimDetail).vehicleNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Vehicle Model:</span>
                          <span className="text-sm font-medium">{(viewingClaim as VehicleClaimDetail).vehicleModel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Manufacture Year:</span>
                          <span className="text-sm font-medium">{(viewingClaim as VehicleClaimDetail).yearOfManufacture}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Medical/Damage Information */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {viewingClaim.type === "health" ? "Medical Information" : "Damage Information"}
                </h3>
                <div className="p-3 bg-muted rounded-md">
                  {viewingClaim.type === "health" ? (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Service Category:</span>
                        <span className="text-sm font-medium">{(viewingClaim as HealthClaimDetail).service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Procedure:</span>
                        <span className="text-sm font-medium">{(viewingClaim as HealthClaimDetail).procedure}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Damage Type:</span>
                        <span className="text-sm font-medium">{(viewingClaim as VehicleClaimDetail).damageType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Workshop:</span>
                        <span className="text-sm font-medium">{(viewingClaim as VehicleClaimDetail).workshopName}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* AI Flags */}
              {viewingClaim.flagged && (
                <div>
                  <h3 className="text-sm font-medium text-red-500 flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Fraud Detection Flags
                  </h3>
                  <div className="p-3 bg-red-50 text-red-800 rounded-md space-y-2">
                    {viewingClaim.flags.map((flag, index) => (
                      <div key={index} className="flex items-start">
                        <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
                        <span className="text-sm">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Timeline */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Activity Timeline</h3>
                <div className="space-y-3">
                  {viewingClaim.timeline.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="mr-3 relative">
                        <div className="h-3 w-3 rounded-full bg-primary mt-1.5"></div>
                        {index < viewingClaim.timeline.length - 1 && (
                          <div className="absolute left-1.5 top-4 h-full w-px bg-muted-foreground"></div>
                        )}
                      </div>
                      <div className="pb-5">
                        <div className="text-xs text-muted-foreground">{item.date}</div>
                        <div className="text-sm font-medium">{item.event}</div>
                        <div className="text-xs text-muted-foreground">By {item.user}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button variant="outline">Request More Info</Button>
                {viewingClaim.status === "reviewing" && (
                  <>
                    <Button variant="destructive">Reject Claim</Button>
                    <Button variant="default">Approve Claim</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add New Claim Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FilePlus className="mr-2 h-5 w-5" />
              Submit New Claim
            </DialogTitle>
            <DialogDescription>
              Enter the details of the new insurance claim.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={claimTypeToAdd} onValueChange={(value) => setClaimTypeToAdd(value as "health" | "vehicle")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="health" className="flex items-center gap-2">
                <Ambulance className="h-4 w-4" /> Health
              </TabsTrigger>
              <TabsTrigger value="vehicle" className="flex items-center gap-2">
                <Car className="h-4 w-4" /> Vehicle
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="health" className="mt-0">
              <Form {...healthClaimForm}>
                <form onSubmit={healthClaimForm.handleSubmit(handleNewHealthClaim)} className="space-y-4">
                  <FormField
                    control={healthClaimForm.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient ID</FormLabel>
                        <FormControl>
                          <Input placeholder="PT-12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={healthClaimForm.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={healthClaimForm.control}
                    name="hospital"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital</FormLabel>
                        <FormControl>
                          <Input placeholder="Hospital name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={healthClaimForm.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cardiology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={healthClaimForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Submit Claim</Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="vehicle" className="mt-0">
              <Form {...vehicleClaimForm}>
                <form onSubmit={vehicleClaimForm.handleSubmit(handleNewVehicleClaim)} className="space-y-4">
                  <FormField
                    control={vehicleClaimForm.control}
                    name="policyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy ID</FormLabel>
                        <FormControl>
                          <Input placeholder="POL-12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={vehicleClaimForm.control}
                    name="policyHolder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Holder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Rahul Sharma" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={vehicleClaimForm.control}
                    name="vehicleNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Number</FormLabel>
                        <FormControl>
                          <Input placeholder="MH02AB1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={vehicleClaimForm.control}
                    name="vehicleModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Model</FormLabel>
                        <FormControl>
                          <Input placeholder="Maruti Swift" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={vehicleClaimForm.control}
                    name="damageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Damage Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Collision" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={vehicleClaimForm.control}
                    name="workshopName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workshop Name</FormLabel>
                        <FormControl>
                          <Input placeholder="AutoFix Services" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={vehicleClaimForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Submit Claim</Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Claims;
