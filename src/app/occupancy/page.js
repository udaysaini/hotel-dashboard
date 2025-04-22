'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatShortDate, getOccupancyTrend, calculateOccupancyStats } from '../utils'
import { 
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Users,
  UserCheck,
  CalendarDays,
  BarChart3,
  BedDouble,
} from 'lucide-react'

export default function OccupancyDashboard() {
  const [occupancyData, setOccupancyData] = useState([])
  const [guestsData, setGuestsData] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    // Fetch occupancy data
    fetch('/api/occupancy')
      .then(res => res.json())
      .then(data => {
        setOccupancyData(data)
        setStats(calculateOccupancyStats(data))
      })
      
    // We would fetch guests data here in a real app
    // For now, let's simulate it
    const mockGuests = [
      { id: 1, name: 'Michael Johnson', room: '101', checkIn: '2023-10-14', checkOut: '2023-10-20' },
      { id: 2, name: 'Sarah Williams', room: '102', checkIn: '2023-10-15', checkOut: '2023-10-22' },
      { id: 3, name: 'David Jones', room: '103', checkIn: '2023-10-16', checkOut: '2023-10-19' },
      { id: 4, name: 'Emily Brown', room: '104', checkIn: '2023-10-14', checkOut: '2023-10-21' },
      { id: 5, name: 'Daniel Garcia', room: '105', checkIn: '2023-10-15', checkOut: '2023-10-25' },
    ];
    setGuestsData(mockGuests);
  }, [])

  // Get trends
  const currentOccupancy = occupancyData[occupancyData.length - 1]?.percentage || 0;
  const previousOccupancy = occupancyData[occupancyData.length - 2]?.percentage || 0;
  const trend = getOccupancyTrend(currentOccupancy, previousOccupancy);
  
  // Calculate today's check-ins and check-outs
  const today = new Date().toISOString().split('T')[0];
  const checkInsToday = guestsData.filter(guest => guest.checkIn === today).length;
  const checkOutsToday = guestsData.filter(guest => guest.checkOut === today).length;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl text-white font-bold mb-8">Hotel Occupancy</h1>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-zinc-400 flex items-center font-bold">
              <Users className="h-4 w-4 mr-2" />
              Current Occupancy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div className="text-3xl text-white font-bold">{stats.current || 0}%</div>
              <div className="flex items-center">
                {trend === 'increasing' && (
                  <Badge className="bg-green-500/20 text-green-500 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +{(currentOccupancy - previousOccupancy).toFixed(1)}%
                  </Badge>
                )}
                {trend === 'decreasing' && (
                  <Badge className="bg-amber-500/20 text-amber-500 flex items-center gap-1">
                    <ArrowDownRight className="h-3 w-3" />
                    {(currentOccupancy - previousOccupancy).toFixed(1)}%
                  </Badge>
                )}
                {trend === 'stable' && (
                  <Badge className="bg-blue-500/20 text-blue-500 flex items-center gap-1">
                    <Minus className="h-3 w-3" />
                    Stable
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-4 w-full bg-zinc-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full" 
                style={{ width: `${stats.current || 0}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-zinc-400 flex items-center font-bold">
              <BarChart3 className="h-4 w-4 mr-2" />
              7-Day Average
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white font-bold">{stats.average || 0}%</div>
            <div className="flex justify-between mt-3 text-sm">
              <div className="text-zinc-500">Min: {stats.min || 0}%</div>
              <div className="text-zinc-500">Max: {stats.max || 0}%</div>
            </div>
            <div className="mt-2 flex h-12 gap-1">
              {occupancyData.map((day, i) => (
                <div key={i} className="flex-1 flex items-end">
                  <div 
                    className="w-full bg-indigo-600 rounded-sm" 
                    style={{ 
                      height: `${day.percentage}%`,
                      opacity: 0.3 + (i / occupancyData.length) * 0.7
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-zinc-400 flex items-center font-bold">
              <UserCheck className="h-4 w-4 mr-2" />
              Today&apos;s Check-ins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white font-bold">{checkInsToday}</div>
            <div className="mt-2">
              <div className="w-full bg-zinc-800 h-1 mb-2">
                <div className="bg-emerald-500 h-1" style={{ width: `${(checkInsToday / 10) * 100}%` }}></div>
              </div>
              <div className="text-xs text-zinc-500">Expected today: 10</div>
            </div>
            <div className="mt-4 flex gap-2">
              {guestsData.filter(guest => guest.checkIn === today).slice(0, 3).map((guest, i) => (
                <Badge key={i} className="bg-zinc-800 text-zinc-300">
                  Room {guest.room}
                </Badge>
              ))}
              {checkInsToday > 3 && (
                <Badge className="bg-zinc-800 text-zinc-300">
                  +{checkInsToday - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-zinc-400 flex items-center font-bold">
              <CalendarDays className="h-4 w-4 mr-2" />
              Today&apos;s Check-outs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white font-bold">{checkOutsToday}</div>
            <div className="mt-2">
              <div className="w-full bg-zinc-800 h-1 mb-2">
                <div className="bg-amber-500 h-1" style={{ width: `${(checkOutsToday / 8) * 100}%` }}></div>
              </div>
              <div className="text-xs text-zinc-500">Expected today: 8</div>
            </div>
            <div className="mt-4 flex gap-2">
              {guestsData.filter(guest => guest.checkOut === today).slice(0, 3).map((guest, i) => (
                <Badge key={i} className="bg-zinc-800 text-zinc-300">
                  Room {guest.room}
                </Badge>
              ))}
              {checkOutsToday > 3 && (
                <Badge className="bg-zinc-800 text-zinc-300">
                  +{checkOutsToday - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Occupancy Chart and Guests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2 text-white">
          <CardHeader>
            <CardTitle>Occupancy Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end gap-2">
              {occupancyData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex justify-center">
                    <Badge className="bg-zinc-800 text-zinc-300">
                      {day.percentage}%
                    </Badge>
                  </div>
                  <div className="w-full flex-1 flex items-end">
                    <div 
                      className={`w-full rounded-t-sm ${day.percentage >= 90 ? 'bg-red-500' : day.percentage >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ height: `${day.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{formatShortDate(day.date)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Current Guests</CardTitle>
            <Badge className="bg-emerald-500/20 text-emerald-500">
              {guestsData.length} Active
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {guestsData.slice(0, 5).map(guest => (
                <div key={guest.id} className="flex items-center justify-between border-b border-zinc-800 pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/20 text-indigo-500 p-2 rounded">
                      <BedDouble className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{guest.name}</div>
                      <div className="text-sm text-zinc-500">Room {guest.room}</div>
                    </div>
                  </div>
                  <div className="text-sm text-zinc-400">
                    {formatShortDate(guest.checkOut)}
                  </div>
                </div>
              ))}
              {guestsData.length > 5 && (
                <div className="text-center pt-2">
                  <Badge className="bg-zinc-800 text-zinc-300">
                    +{guestsData.length - 5} more guests
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
