'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { useState, useEffect } from 'react'
import { Menu, X, PanelLeft } from "lucide-react"
import { cn } from '@/lib/utils'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle window resize to detect mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Only auto-close on mobile
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    // Initialize based on current width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col lg:flex-row">
          {/* Mobile Header */}
          <div className="lg:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-40">
            <h1 className="text-xl font-bold">Hotel Dashboard</h1>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md bg-zinc-800 hover:bg-zinc-700"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Sidebar Component */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          {/* Main Content - Responsive */}
          <div className={cn(
            "flex-1 transition-all duration-300",
            sidebarOpen && !isMobile ? "ml-0" : "ml-0"
          )}>
            {/* Desktop Sidebar Toggle Button */}
            <div className="hidden lg:block fixed top-4 left-4 z-50">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <PanelLeft size={20} className={cn(
                  "transition-transform",
                  sidebarOpen ? "" : "rotate-180"
                )} />
              </button>
            </div>
            
            {/* Overlay for mobile when sidebar is open */}
            {sidebarOpen && isMobile && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            <div className="p-4 sm:p-6 md:p-8 min-h-screen lg:pl-16">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
