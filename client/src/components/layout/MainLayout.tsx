import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import ConnectionStatus from "../notifications/ConnectionStatus";
import { ThemeSwitch } from "../ui/theme-switch";
import { useLocation } from "wouter";
import ProfileMenu from "./ProfileMenu";
import { useState } from "react";
import { CuralinkLogo } from "../ui/CuralinkLogo";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  if (!user) {
    setLocation("/");
    return null;
  }
  
  const isDoctor = user.role === "doctor";
  
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    // Handle navigation based on tabName
    if (tabName === "dashboard") {
      setLocation("/dashboard");
    } else if (tabName === "appointments") {
      setLocation("/appointments");
    } else if (tabName === "profile") {
      setLocation("/profile");
    } else if (tabName === "video") {
      setLocation("/video-call");
    } else if (tabName === "emergency") {
      setLocation("/emergency");
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-black dark:bg-black dark:text-white">
      {/* Header */}
      <header className="bg-white border-gray-200 dark:bg-black dark:border-gray-800 shadow-lg border-b fixed top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CuralinkLogo size={32} variant="default" className="mr-3" />
              <h1 className="text-lg font-medium text-black dark:text-white">Curalink</h1>
              {isDoctor && (
                <span className="ml-3 text-xs font-medium py-1 px-3 bg-blue-900/50 text-blue-400 rounded-full border border-blue-800/50">
                  Doctor
                </span>
              )}
            </div>
            <div className="flex items-center space-x-5">
              <ThemeSwitch />
              <ConnectionStatus />
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
              <ProfileMenu />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow bg-white dark:bg-black pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
