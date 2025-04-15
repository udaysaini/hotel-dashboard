'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { 
  ClipboardList, 
  Calendar, 
  Users, 
  BarChart4,
  Coffee,
  CheckSquare,
} from "lucide-react"
import { useEffect, useState } from 'react'

const navItems = [
  { name: 'Tasks', path: '/', icon: ClipboardList },
  { name: 'Task Hub', path: '/tasks', icon: CheckSquare },
  { name: 'Shifts', path: '/shifts', icon: Calendar },
  { name: 'Occupancy', path: '/occupancy', icon: Users },
  { name: 'Guest Orders', path: '/orders', icon: Coffee },
  { name: 'Analytics', path: '/analytics', icon: BarChart4 },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile/tablet
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Set initial value
    checkIsMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Handle link click - only close on mobile/tablet
  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        "bg-zinc-900 border-r border-zinc-800 transition-all duration-300 overflow-hidden z-30",
        isOpen
          ? "fixed lg:relative inset-y-0 left-0 w-64 translate-x-0"
          : "fixed lg:relative inset-y-0 left-0 w-64 -translate-x-full lg:translate-x-full lg:w-0"
      )}
    >
      {/* Desktop Logo - Hidden on Mobile */}
      <div className="p-6 hidden lg:block">
        <h1 className="text-xl font-bold">Hotel Dashboard</h1>
      </div>
      
      {/* Close button for mobile only */}
      <div className="absolute top-4 right-4 lg:hidden">
        <button 
          onClick={onClose}
          className="p-1 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 lg:mt-6 pt-10 lg:pt-0">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors",
                    pathname === item.path 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                  onClick={handleLinkClick}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  )
}
