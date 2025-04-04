
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, CartesianGrid, Tooltip, Legend, Line, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, CheckCircle, FileText, Building2, BarChart3, Activity, Ambulance, Car } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupee } from "lucide-react";

// Mock data
const fraudStats = {
  today: { total: 156, legitimate: 124, suspicious: 18, fraudulent: 14 },
  weekly: { total: 782, legitimate: 630, suspicious: 94, fraudulent: 58 },
  monthly: { total: 3248, legitimate: 2709, suspicious: 341, fraudulent: 198 }
};

const monthlyData = [
  { name: "Jan", legitimate: 412, suspicious: 53, fraudulent: 28 },
  { name: "Feb", legitimate: 362, suspicious: 41, fraudulent: 21 },
  { name: "Mar", legitimate: 389, suspicious: 47, fraudulent: 25 },
  { name: "Apr", legitimate: 425, suspicious: 51, fraudulent: 32 },
  { name: "May", legitimate: 451, suspicious: 56, fraudulent: 34 },
  { name: "Jun", legitimate: 399, suspicious: 42, fraudulent: 19 },
  { name: "Jul", legitimate: 422, suspicious: 49, fraudulent: 29 },
  { name: "Aug", legitimate: 396, suspicious: 45, fraudulent: 22 },
  { name: "Sep", legitimate: 375, suspicious: 36, fraudulent: 18 },
  { name: "Oct", legitimate: 401, suspicious: 48, fraudulent: 24 },
  { name: "Nov", legitimate: 432, suspicious: 54, fraudulent: 31 },
  { name: "Dec", legitimate: 438, suspicious: 60, fraudulent: 36 }
];

const dailyData = [
  { name: "Mon", claimsProcessed: 63, detectedFrauds: 6 },
  { name: "Tue", claimsProcessed: 81, detectedFrauds: 9 },
  { name: "Wed", claimsProcessed: 72, detectedFrauds: 7 },
  { name: "Thu", claimsProcessed: 69, detectedFrauds: 5 },
  { name: "Fri", claimsProcessed: 87, detectedFrauds: 10 },
  { name: "Sat", claimsProcessed: 42, detectedFrauds: 4 },
  { name: "Sun", claimsProcessed: 35, detectedFrauds: 3 }
];

// Insurance type distribution
const insuranceTypeData = [
  { name: "Health", value: 65, color: "#3b82f6" },
  { name: "Vehicle", value: 35, color: "#10b981" },
];

// Vehicle claim types
const vehicleClaimTypesData = [
  { name: "Collision", value: 42 },
  { name: "Theft", value: 18 },
  { name: "Natural Disaster", value: 15 },
  { name: "Third Party", value: 25 }
];

// Health vs Vehicle comparison data
const claimComparisonData = [
  { month: "Jan", health: 187500, vehicle: 355000 },
  { month: "Feb", health: 210000, vehicle: 290000 },
  { month: "Mar", health: 245000, vehicle: 310000 },
  { month: "Apr", health: 198000, vehicle: 342000 },
  { month: "May", health: 228000, vehicle: 305000 },
  { month: "Jun", health: 254000, vehicle: 275000 },
];

const recentAlerts = [
  { id: 1, provider: "Memorial Hospital", claimId: "CLM-2023456", risk: "high", status: "flagged", timestamp: "2 hours ago", type: "health" },
  { id: 2, provider: "AutoFix Services", claimId: "VCL-1023457", risk: "high", status: "reviewing", timestamp: "3 hours ago", type: "vehicle" },
  { id: 3, provider: "City General Hospital", claimId: "CLM-2023458", risk: "low", status: "approved", timestamp: "5 hours ago", type: "health" },
  { id: 4, provider: "Premium Auto Workshop", claimId: "VCL-1023459", risk: "high", status: "rejected", timestamp: "8 hours ago", type: "vehicle" }
];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<"today" | "weekly" | "monthly">("today");
  const [insuranceTabValue, setInsuranceTabValue] = useState("all");
  
  const stats = fraudStats[timeRange];
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Select 
            value={timeRange} 
            onValueChange={(value) => setTimeRange(value as "today" | "weekly" | "monthly")}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Insurance Type Tabs */}
      <Tabs value={insuranceTabValue} onValueChange={setInsuranceTabValue} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> All Insurance
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Ambulance className="h-4 w-4" /> Health Insurance
          </TabsTrigger>
          <TabsTrigger value="vehicle" className="flex items-center gap-2">
            <Car className="h-4 w-4" /> Vehicle Insurance
          </TabsTrigger>
        </TabsList>

        {/* Insurance Tabs Content */}
        <TabsContent value="all">
          {/* Stat cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {timeRange === "today" ? "Claims processed today" : 
                   timeRange === "weekly" ? "Claims processed this week" :
                   "Claims processed this month"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Legitimate Claims</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.legitimate}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">
                    {Math.round((stats.legitimate / stats.total) * 100)}%
                  </span> of total claims
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspicious Claims</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.suspicious}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-yellow-500 font-medium">
                    {Math.round((stats.suspicious / stats.total) * 100)}%
                  </span> of total claims
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraudulent Claims</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.fraudulent}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500 font-medium">
                    {Math.round((stats.fraudulent / stats.total) * 100)}%
                  </span> of total claims
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Insurance Type Distribution</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>
                  Percentage of claims by insurance type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={insuranceTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {insuranceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Health vs Vehicle Claims</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>
                  Comparison of claim amounts by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={claimComparisonData} 
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="health" name="Health" fill="#3b82f6" />
                      <Bar dataKey="vehicle" name="Vehicle" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Claims</CardTitle>
                <Ambulance className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(stats.total * 0.65)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  65% of total claims
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Claim</CardTitle>
                <IndianRupee className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹4,250</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">+12%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Service</CardTitle>
                <Building2 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Cardiology</div>
                <p className="text-xs text-muted-foreground mt-1">
                  22% of health claims
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraud Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.2%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500 font-medium">+0.8%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Monthly Health Claims Analysis</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>
                Number of health claims by category each month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={monthlyData} 
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="legitimate" stackId="a" fill="#34D399" name="Legitimate" />
                    <Bar dataKey="suspicious" stackId="a" fill="#FBBF24" name="Suspicious" />
                    <Bar dataKey="fraudulent" stackId="a" fill="#F87171" name="Fraudulent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicle">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vehicle Claims</CardTitle>
                <Car className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(stats.total * 0.35)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  35% of total claims
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Claim</CardTitle>
                <IndianRupee className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹68,500</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500 font-medium">+23%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Damage Type</CardTitle>
                <Car className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Collision</div>
                <p className="text-xs text-muted-foreground mt-1">
                  42% of vehicle claims
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraud Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.7%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500 font-medium">+1.2%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Vehicle Claim Types</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>
                  Distribution of vehicle claims by damage type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={vehicleClaimTypesData} 
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Percentage" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Monthly Trend</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>
                  Vehicle claim amounts over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={claimComparisonData} 
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="vehicle" stroke="#10b981" name="Vehicle Claims" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Fraud Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <CardDescription>
            Latest suspicious activity detected by the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="font-medium text-left py-3 px-4">Type</th>
                  <th className="font-medium text-left py-3 px-4">Provider</th>
                  <th className="font-medium text-left py-3 px-4">Claim ID</th>
                  <th className="font-medium text-left py-3 px-4">Risk Level</th>
                  <th className="font-medium text-left py-3 px-4">Status</th>
                  <th className="font-medium text-left py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentAlerts.map((alert) => (
                  <tr key={alert.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      {alert.type === "health" ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-50">
                          <Ambulance className="mr-1 h-3 w-3" /> Health
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-800 hover:bg-green-50">
                          <Car className="mr-1 h-3 w-3" /> Vehicle
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">{alert.provider}</td>
                    <td className="py-3 px-4 font-medium">{alert.claimId}</td>
                    <td className="py-3 px-4">
                      <span className={`fraud-badge ${
                        alert.risk === "high" ? "fraud-badge-red" :
                        alert.risk === "medium" ? "fraud-badge-yellow" :
                        "fraud-badge-green"
                      }`}>
                        {alert.risk.charAt(0).toUpperCase() + alert.risk.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`fraud-badge ${
                        alert.status === "flagged" || alert.status === "rejected" ? "fraud-badge-red" :
                        alert.status === "reviewing" ? "fraud-badge-yellow" :
                        "fraud-badge-green"
                      }`}>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{alert.timestamp}</td>
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

export default Dashboard;
