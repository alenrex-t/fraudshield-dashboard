
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, FileText, Building2, Calendar, AlertTriangle, CheckCircle, File, ArrowUpDown, Eye } from "lucide-react";

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
    flagged: false
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
    flagged: true
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
    flagged: false
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
    flagged: true
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
    flagged: false
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
    flagged: false
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
    flagged: true
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
    flagged: true
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
    flagged: false
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
    flagged: true
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

const Claims = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof claimsData[0] | null;
    direction: 'ascending' | 'descending';
  }>({
    key: "date",
    direction: "descending"
  });
  const [viewingClaim, setViewingClaim] = useState<null | typeof claimDetail>(null);
  
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
  
  // Filtering by tab and search term
  const filteredClaims = sortedClaims.filter(claim => {
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.patientId.toLowerCase().includes(searchTerm.toLowerCase());
      
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
  const handleViewClaim = (claimId: string) => {
    setViewingClaim(claimDetail);
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Claims</h1>
      </div>
      
      {/* Claims Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Claims Management
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search claims..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                      <th className="font-medium text-left py-3 px-4">Patient ID</th>
                      <th className="font-medium text-left py-3 px-4">
                        <Button 
                          variant="ghost" 
                          className="font-medium p-0 hover:bg-transparent"
                          onClick={() => requestSort('hospital')}
                        >
                          Hospital
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
                        <td className="py-3 px-4">{claim.patientId}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                            {claim.hospital}
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
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Patient & Provider</h3>
                  <div className="space-y-2">
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
                  </div>
                </div>
              </div>
              
              {/* Medical Information */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Medical Information</h3>
                <div className="p-3 bg-muted rounded-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Service Category:</span>
                    <span className="text-sm font-medium">{viewingClaim.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Procedure:</span>
                    <span className="text-sm font-medium">{viewingClaim.procedure}</span>
                  </div>
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
    </div>
  );
};

export default Claims;
