import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar, CartesianGrid, Tooltip, Legend } from "recharts";
import { Search, Building2, AlertTriangle, CheckCircle, ArrowUpDown, Hospital, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";

// Mock hospitals data for Tamil Nadu
const hospitalsData = [
  { 
    id: 1, 
    name: "Apollo Hospitals", 
    location: "Chennai, Tamil Nadu", 
    totalClaims: 468,
    approved: 405,
    suspicious: 47, 
    rejected: 16,
    fraudRate: 3.4,
  },
  { 
    id: 2, 
    name: "Fortis Healthcare", 
    location: "New Delhi, Delhi", 
    totalClaims: 392,
    approved: 346,
    suspicious: 35, 
    rejected: 11,
    fraudRate: 2.8,
  },
  { 
    id: 3, 
    name: "AIIMS", 
    location: "New Delhi, Delhi", 
    totalClaims: 521,
    approved: 486,
    suspicious: 28, 
    rejected: 7,
    fraudRate: 1.3,
  },
  { 
    id: 4, 
    name: "Kokilaben Hospital", 
    location: "Mumbai, Maharashtra", 
    totalClaims: 329,
    approved: 289,
    suspicious: 32, 
    rejected: 8,
    fraudRate: 2.4,
  },
  { 
    id: 5, 
    name: "Narayana Health", 
    location: "Bangalore, Karnataka", 
    totalClaims: 387,
    approved: 355,
    suspicious: 24, 
    rejected: 8,
    fraudRate: 2.1,
  },
  { 
    id: 6, 
    name: "Medanta Hospital", 
    location: "Gurgaon, Haryana", 
    totalClaims: 298,
    approved: 262,
    suspicious: 27, 
    rejected: 9,
    fraudRate: 3.0,
  },
  { 
    id: 7, 
    name: "Max Healthcare", 
    location: "New Delhi, Delhi", 
    totalClaims: 312,
    approved: 283,
    suspicious: 21, 
    rejected: 8,
    fraudRate: 2.6,
  },
  { 
    id: 8, 
    name: "Lilavati Hospital", 
    location: "Mumbai, Maharashtra", 
    totalClaims: 276,
    approved: 251,
    suspicious: 18, 
    rejected: 7,
    fraudRate: 2.5,
  },
  { 
    id: 9, 
    name: "Billroth Hospitals", 
    location: "Chennai, Tamil Nadu", 
    totalClaims: 352,
    approved: 326,
    suspicious: 19, 
    rejected: 7,
    fraudRate: 2.0,
  },
  { 
    id: 10, 
    name: "Meenakshi Mission Hospital", 
    location: "Madurai, Tamil Nadu", 
    totalClaims: 411,
    approved: 386,
    suspicious: 18, 
    rejected: 7,
    fraudRate: 1.7,
  },
  { 
    id: 11, 
    name: "Kauvery Hospital", 
    location: "Tiruchirappalli, Tamil Nadu", 
    totalClaims: 329,
    approved: 299,
    suspicious: 22, 
    rejected: 8,
    fraudRate: 2.4,
  },
  { 
    id: 12, 
    name: "Sri Ramachandra Medical Centre", 
    location: "Chennai, Tamil Nadu", 
    totalClaims: 385,
    approved: 352,
    suspicious: 25, 
    rejected: 8,
    fraudRate: 2.1,
  },
  { 
    id: 13, 
    name: "PSG Hospitals", 
    location: "Coimbatore, Tamil Nadu", 
    totalClaims: 304,
    approved: 278,
    suspicious: 20, 
    rejected: 6,
    fraudRate: 2.0,
  },
  { 
    id: 14, 
    name: "Ganga Medical Centre", 
    location: "Coimbatore, Tamil Nadu", 
    totalClaims: 276,
    approved: 254,
    suspicious: 16, 
    rejected: 6,
    fraudRate: 2.2,
  },
  { 
    id: 15, 
    name: "MIOT International", 
    location: "Chennai, Tamil Nadu", 
    totalClaims: 342,
    approved: 314,
    suspicious: 21, 
    rejected: 7,
    fraudRate: 2.0,
  }
];

// Update chart data to include the new hospitals
const hospitalChartData = [
  { name: "Apollo", approved: 405, suspicious: 47, rejected: 16 },
  { name: "Fortis", approved: 346, suspicious: 35, rejected: 11 },
  { name: "AIIMS", approved: 486, suspicious: 28, rejected: 7 },
  { name: "Kokilaben", approved: 289, suspicious: 32, rejected: 8 },
  { name: "Narayana", approved: 355, suspicious: 24, rejected: 8 },
  { name: "Medanta", approved: 262, suspicious: 27, rejected: 9 },
  { name: "Max", approved: 283, suspicious: 21, rejected: 8 },
  { name: "Lilavati", approved: 251, suspicious: 18, rejected: 7 },
  { name: "Billroth", approved: 326, suspicious: 19, rejected: 7 },
  { name: "Meenakshi", approved: 386, suspicious: 18, rejected: 7 },
  { name: "Kauvery", approved: 299, suspicious: 22, rejected: 8 },
  { name: "SriRamachandra", approved: 352, suspicious: 25, rejected: 8 },
  { name: "PSG", approved: 278, suspicious: 20, rejected: 6 },
];

// Add new hospital form schema
const newHospitalSchema = z.object({
  name: z.string().min(2, {
    message: "Hospital name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  totalClaims: z.string().refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, 
    { message: "Total claims must be a non-negative number." }
  ),
  fraudRate: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100, 
    { message: "Fraud rate must be between 0 and 100." }
  ),
});

const Hospitals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof hospitalsData[0] | null;
    direction: 'ascending' | 'descending';
  }>({
    key: "totalClaims",
    direction: "descending"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof newHospitalSchema>>({
    resolver: zodResolver(newHospitalSchema),
    defaultValues: {
      name: "",
      location: "",
      totalClaims: "0",
      fraudRate: "0",
    },
  });
  
  // Sorting function
  const sortedHospitals = [...hospitalsData].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  
  // Filtering function
  const filteredHospitals = sortedHospitals.filter(hospital => 
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sorting function
  const requestSort = (key: keyof typeof hospitalsData[0]) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Handle form submission for new hospital
  const handleNewHospital = (values: z.infer<typeof newHospitalSchema>) => {
    // In a real app, this would connect to your backend API
    console.log("New hospital submitted:", values);
    
    const totalClaims = parseInt(values.totalClaims);
    const fraudRate = parseFloat(values.fraudRate);
    
    // Calculate default values for approved, suspicious, and rejected claims
    const approved = Math.round(totalClaims * 0.9);
    const suspicious = Math.round(totalClaims * 0.07);
    const rejected = Math.round(totalClaims * 0.03);
    
    // Create a new hospital object with generated ID
    const newHospital = {
      id: hospitalsData.length + 1,
      name: values.name,
      location: values.location,
      totalClaims: totalClaims,
      approved: approved,
      suspicious: suspicious,
      rejected: rejected,
      fraudRate: fraudRate,
    };
    
    // In a real application, you would add this to your database
    // For now, we'll just show a success message
    toast({
      title: "Hospital Added",
      description: `${values.name} has been successfully added to the database.`,
    });
    
    setIsAddDialogOpen(false);
    form.reset();
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Indian Hospitals</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Hospital className="mr-2 h-4 w-4" />
          Add New Hospital
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Hospital Claims Distribution</CardTitle>
            <Hospital className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardDescription>
            Distribution of claims by status for each hospital in India
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={hospitalChartData} 
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" fill="#34D399" name="Approved Claims" />
                <Bar dataKey="suspicious" fill="#FBBF24" name="Suspicious Claims" />
                <Bar dataKey="rejected" fill="#F87171" name="Rejected Claims" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Hospital List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Indian Hospital List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hospitals..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            Complete list of hospitals in India with claim statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="font-medium text-left py-3 px-4">
                    <Button 
                      variant="ghost" 
                      className="font-medium p-0 hover:bg-transparent"
                      onClick={() => requestSort('name')}
                    >
                      Hospital Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="font-medium text-left py-3 px-4">Location</th>
                  <th className="font-medium text-left py-3 px-4">
                    <Button 
                      variant="ghost" 
                      className="font-medium p-0 hover:bg-transparent"
                      onClick={() => requestSort('totalClaims')}
                    >
                      Total Claims
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="font-medium text-left py-3 px-4">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Approved
                    </div>
                  </th>
                  <th className="font-medium text-left py-3 px-4">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                      Suspicious
                    </div>
                  </th>
                  <th className="font-medium text-left py-3 px-4">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                      Rejected
                    </div>
                  </th>
                  <th className="font-medium text-left py-3 px-4">
                    <Button 
                      variant="ghost" 
                      className="font-medium p-0 hover:bg-transparent"
                      onClick={() => requestSort('fraudRate')}
                    >
                      Fraud Rate
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredHospitals.map((hospital) => (
                  <tr key={hospital.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{hospital.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{hospital.location}</td>
                    <td className="py-3 px-4">{hospital.totalClaims}</td>
                    <td className="py-3 px-4 text-green-600">{hospital.approved}</td>
                    <td className="py-3 px-4 text-yellow-600">{hospital.suspicious}</td>
                    <td className="py-3 px-4 text-red-600">{hospital.rejected}</td>
                    <td className="py-3 px-4">
                      <span className={`fraud-badge ${
                        hospital.fraudRate > 4 ? "fraud-badge-red" :
                        hospital.fraudRate > 3 ? "fraud-badge-yellow" :
                        "fraud-badge-green"
                      }`}>
                        {hospital.fraudRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add New Hospital Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Hospital className="mr-2 h-5 w-5" />
              Add New Hospital
            </DialogTitle>
            <DialogDescription>
              Enter the details of the new hospital to add to the database.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNewHospital)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Hospital name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="totalClaims"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Claims</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fraudRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fraud Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Hospital</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hospitals;
