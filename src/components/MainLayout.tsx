
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Building2, Settings, LogOut, Menu, X, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const NavItem = ({ to, icon: Icon, label, isActive, isCollapsed }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon size={20} />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/claims", label: "Claims", icon: FileText },
    { path: "/hospitals", label: "Hospitals", icon: Building2 },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-sidebar fixed top-0 left-0 h-full z-50 border-r transition-all duration-300 ease-in-out flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <div className="relative">
              <Shield className="h-6 w-6 text-primary" />
              <span className="absolute text-primary font-bold text-xs" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>i</span>
            </div>
            {!collapsed && <span className="text-lg font-bold">SMART i</span>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </Button>
        </div>
        
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.path}
              isCollapsed={collapsed}
            />
          ))}
        </nav>
        
        <div className="p-4 border-t">
          {!collapsed ? (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
              <Button 
                variant="ghost" 
                className="flex items-center justify-start mt-2 px-3 gap-2" 
                onClick={logout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="w-full h-10"
            >
              <LogOut size={18} />
            </Button>
          )}
        </div>
      </aside>
      
      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        collapsed ? "ml-16" : "ml-64"
      )}>
        <div className="container py-6 px-4 sm:px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
