
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BellRing, UserCircle, Shield, Lock, Bell, Save, RefreshCw } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    fraudAlerts: true,
    summaryReports: true,
    systemUpdates: false
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30"
  });
  
  const [aiSettings, setAiSettings] = useState({
    sensitivity: "medium",
    automaticReview: true,
    manualReviewThreshold: "60"
  });
  
  // Handle form submission
  const handleSaveSettings = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };
  
  // Reset settings to default
  const handleResetToDefault = () => {
    setNotifications({
      emailAlerts: true,
      fraudAlerts: true,
      summaryReports: true,
      systemUpdates: false
    });
    
    setSecuritySettings({
      twoFactorAuth: false,
      sessionTimeout: "30"
    });
    
    setAiSettings({
      sensitivity: "medium",
      automaticReview: true,
      manualReviewThreshold: "60"
    });
    
    toast.success("Settings reset to default values");
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="ai-settings">AI Settings</TabsTrigger>
        </TabsList>
        
        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <UserCircle className="mr-2 h-5 w-5" />
                  Account Information
                </CardTitle>
              </div>
              <CardDescription>
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    <UserCircle className="h-20 w-20 text-muted-foreground" />
                  </div>
                  <Button size="sm" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue={user?.role} readOnly disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="america_new_york">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america_new_york">America/New York</SelectItem>
                        <SelectItem value="america_chicago">America/Chicago</SelectItem>
                        <SelectItem value="america_denver">America/Denver</SelectItem>
                        <SelectItem value="america_los_angeles">America/Los Angeles</SelectItem>
                        <SelectItem value="asia_tokyo">Asia/Tokyo</SelectItem>
                        <SelectItem value="europe_london">Europe/London</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </div>
              <CardDescription>
                Manage how and when you receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important notifications via email
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, emailAlerts: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Fraud Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get immediate notifications for high-risk claims
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.fraudAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, fraudAlerts: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Summary Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive daily digest of platform activities
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.summaryReports}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, summaryReports: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">System Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about platform updates and maintenance
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, systemUpdates: checked})
                    }
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleResetToDefault}>
                  Reset to Default
                </Button>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Security Settings
                </CardTitle>
              </div>
              <CardDescription>
                Manage login, authentication, and security options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch 
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, twoFactorAuth: checked})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Select 
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => 
                      setSecuritySettings({...securitySettings, sessionTimeout: value})
                    }
                  >
                    <SelectTrigger id="session-timeout">
                      <SelectValue placeholder="Select timeout duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Login History
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleResetToDefault}>
                  Reset to Default
                </Button>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* AI Settings */}
        <TabsContent value="ai-settings" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  AI Detection Settings
                </CardTitle>
              </div>
              <CardDescription>
                Configure the fraud detection AI and automation preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-sensitivity">AI Sensitivity</Label>
                  <Select 
                    value={aiSettings.sensitivity}
                    onValueChange={(value) => 
                      setAiSettings({...aiSettings, sensitivity: value})
                    }
                  >
                    <SelectTrigger id="ai-sensitivity">
                      <SelectValue placeholder="Select sensitivity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Fewer false positives, may miss some fraud</SelectItem>
                      <SelectItem value="medium">Medium - Balanced detection (Recommended)</SelectItem>
                      <SelectItem value="high">High - Catch more fraud, more false positives</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Automatic Review Assignment</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically assign flagged claims for human review
                    </p>
                  </div>
                  <Switch 
                    checked={aiSettings.automaticReview}
                    onCheckedChange={(checked) => 
                      setAiSettings({...aiSettings, automaticReview: checked})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="manual-review-threshold">
                    Manual Review Threshold Score (%)
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      id="manual-review-threshold" 
                      type="number"
                      min="0"
                      max="100"
                      value={aiSettings.manualReviewThreshold}
                      onChange={(e) => 
                        setAiSettings({
                          ...aiSettings, 
                          manualReviewThreshold: e.target.value
                        })
                      }
                    />
                    <span className="text-sm text-muted-foreground w-20">
                      {parseInt(aiSettings.manualReviewThreshold) < 50 ? "Low" : 
                       parseInt(aiSettings.manualReviewThreshold) < 75 ? "Medium" :
                       "High"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Claims with a fraud score above this threshold will be flagged for review
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleResetToDefault}>
                  Reset to Default
                </Button>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
