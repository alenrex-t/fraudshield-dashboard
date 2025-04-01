
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar, CartesianGrid, Tooltip, Legend } from "recharts";
import { Search, Building2, AlertTriangle, CheckCircle, ArrowUpDown } from "lucide-react";

// Mock hospitals data
const hospitalsData = [
  { 
    id: 1, 
    name: "Memorial Hospital", 
    location: "New York, NY", 
    totalClaims: 423,
    approved: 368,
    suspicious: 42, 
    rejected: 13,
    fraudRate: 3.1,
  },
  { 
    id: 2, 
    name: "Sunshine Medical Center", 
    location: "Los Angeles, CA", 
    totalClaims: 356,
    approved: 312,
    suspicious: 31, 
    rejected: 13,
    fraudRate: 3.7,
  },
  { 
    id: 3, 
    name: "City General Hospital", 
    location: "Chicago, IL", 
    totalClaims: 287,
    approved: 264,
    suspicious: 15, 
    rejected: 8,
    fraudRate: 2.8,
  },
  { 
    id: 4, 
    name: "Riverside Health", 
    location: "Houston, TX", 
    totalClaims: 329,
    approved: 293,
    suspicious: 28, 
    rejected: 8,
    fraudRate: 2.4,
  },
  { 
    id: 5, 
    name: "Mountain View Medical", 
    location: "Denver, CO", 
    totalClaims: 198,
    approved: 180,
    suspicious: 12, 
    rejected: 6,
    fraudRate: 3.0,
  },
  { 
    id: 6, 
    name: "Ocean Health System", 
    location: "Miami, FL", 
    totalClaims: 265,
    approved: 227,
    suspicious: 26, 
    rejected: 12,
    fraudRate: 4.5,
  },
  { 
    id: 7, 
    name: "Cedar Valley Hospital", 
    location: "Dallas, TX", 
    totalClaims: 221,
    approved: 203,
    suspicious: 13, 
    rejected: 5,
    fraudRate: 2.3,
  },
  { 
    id: 8, 
    name: "Oakwood Medical Center", 
    location: "Atlanta, GA", 
    totalClaims: 276,
    approved: 251,
    suspicious: 18, 
    rejected: 7,
    fraudRate: 2.5,
  },
];

const hospitalChartData = [
  { name: "Memorial", approved: 368, suspicious: 42, rejected: 13 },
  { name: "Sunshine", approved: 312, suspicious: 31, rejected: 13 },
  { name: "City Gen", approved: 264, suspicious: 15, rejected: 8 },
  { name: "Riverside", approved: 293, suspicious: 28, rejected: 8 },
  { name: "Mountain", approved: 180, suspicious: 12, rejected: 6 },
  { name: "Ocean", approved: 227, suspicious: 26, rejected: 12 },
  { name: "Cedar", approved: 203, suspicious: 13, rejected: 5 },
  { name: "Oakwood", approved: 251, suspicious: 18, rejected: 7 },
];

const Hospitals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof hospitalsData[0] | null;
    direction: 'ascending' | 'descending';
  }>({
    key: "totalClaims",
    direction: "descending"
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
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Hospitals</h1>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Hospital Claims Distribution</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardDescription>
            Distribution of claims by status for each hospital
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
            <CardTitle>Hospital List</CardTitle>
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
            Complete list of hospitals with claim statistics
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
    </div>
  );
};

export default Hospitals;
