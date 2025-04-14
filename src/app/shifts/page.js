'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatShortDate, formatTime, DEPARTMENT_COLORS } from '../utils'
import { 
  Calendar, 
  Clock, 
  Plus, 
  Users,
  LayoutGrid
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ShiftsDashboard() {
  const [shifts, setShifts] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState('daily')
  const [uniqueDates, setUniqueDates] = useState([])

  useEffect(() => {
    fetch('/api/shifts')
      .then(res => res.json())
      .then(data => {
        setShifts(data)
        
        // Extract unique dates
        const dates = [...new Set(data.map(shift => shift.shift_date))];
        setUniqueDates(dates.sort());
      })
  }, [])

  // Filter shifts by selected date
  const shiftsOnSelectedDate = shifts.filter(shift => {
    if (viewMode === 'daily') {
      return shift.shift_date === selectedDate;
    } else {
      // Weekly view could show all shifts
      return true;
    }
  });

  // Group shifts by department for the department view
  const departmentShifts = shiftsOnSelectedDate.reduce((acc, shift) => {
    const department = shift.department;
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(shift);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-0 sm:px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Staff Shifts</h1>

        <Button className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Shift
        </Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 items-center overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          <Button
            variant={selectedDate === uniqueDates[0] ? "secondary" : "ghost"}
            onClick={() => setSelectedDate(uniqueDates[0])}
            className="text-sm"
            disabled={!uniqueDates.length}
          >
            Today
          </Button>
          {uniqueDates.slice(1, 4).map((date) => (
            <Button
              key={date}
              variant={selectedDate === date ? "secondary" : "ghost"}
              onClick={() => setSelectedDate(date)}
              className="text-sm whitespace-nowrap"
            >
              {formatShortDate(date)}
            </Button>
          ))}
        </div>

        <div className="flex border rounded-md overflow-hidden w-full sm:w-auto">
          <button 
            className={`px-3 py-2 flex items-center gap-1 flex-1 sm:flex-auto ${viewMode === 'daily' ? 'bg-zinc-800 text-white' : 'bg-zinc-900'}`}
            onClick={() => setViewMode('daily')}
          >
            <Calendar className="h-4 w-4 sm:mr-1" />
            <span className="text-sm hidden sm:inline">Daily</span>
          </button>
          <button 
            className={`px-3 py-2 flex items-center gap-1 flex-1 sm:flex-auto ${viewMode === 'department' ? 'bg-zinc-800 text-white' : 'bg-zinc-900'}`}
            onClick={() => setViewMode('department')}
          >
            <Users className="h-4 w-4 sm:mr-1" />
            <span className="text-sm hidden sm:inline">By Department</span>
          </button>
          <button 
            className={`px-3 py-2 flex items-center gap-1 flex-1 sm:flex-auto ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'bg-zinc-900'}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4 sm:mr-1" />
            <span className="text-sm hidden sm:inline">Grid</span>
          </button>
        </div>
      </div>

      {viewMode === 'daily' && (
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3 border-b border-zinc-800">
              <CardTitle className="text-lg md:text-xl text-white">
                Shifts for {formatShortDate(selectedDate)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {shiftsOnSelectedDate.length > 0 ? (
                  shiftsOnSelectedDate.map(shift => (
                    <div key={shift.shift_id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md border border-zinc-800 bg-zinc-950 gap-3">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {shift.employee_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{shift.employee_name}</h3>
                          <p className="text-sm text-zinc-400">{shift.position}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 ml-14 sm:ml-0">
                        <Badge className={`${DEPARTMENT_COLORS[shift.department] || 'bg-zinc-600'}`}>
                          {shift.department}
                        </Badge>
                        <div className="flex items-center text-zinc-400">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-zinc-500">
                    No shifts scheduled for this date
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {viewMode === 'department' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(departmentShifts).map(([department, departmentShifts]) => (
            <Card key={department} className="bg-zinc-900 border-zinc-800">
              <CardHeader className={`pb-3 border-b border-zinc-800 ${DEPARTMENT_COLORS[department] ? `bg-opacity-10 bg-${DEPARTMENT_COLORS[department].substring(3)}` : ''}`}>
                <CardTitle className="text-xl flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${DEPARTMENT_COLORS[department] || 'bg-zinc-600'}`}></span>
                  {department}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {departmentShifts.map(shift => (
                    <div key={shift.shift_id} className="flex items-center justify-between p-2 rounded-md border border-zinc-800 bg-zinc-950">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-sm font-medium">
                          {shift.employee_name.charAt(0)}
                        </div>
                        <span className="font-medium text-white text-sm">{shift.employee_name}</span>
                      </div>
                      <div className="flex items-center text-zinc-400 text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === 'grid' && (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[800px] px-4 sm:px-0">
            <div className="grid grid-cols-9 gap-2 mb-2 text-sm font-medium text-zinc-400">
              <div className="col-span-2">Employee</div>
              <div className="col-span-1">Department</div>
              <div className="col-span-1 text-center">6 AM</div>
              <div className="col-span-1 text-center">9 AM</div>
              <div className="col-span-1 text-center">12 PM</div>
              <div className="col-span-1 text-center">3 PM</div>
              <div className="col-span-1 text-center">6 PM</div>
              <div className="col-span-1 text-center">9 PM</div>
            </div>
            
            {shiftsOnSelectedDate.map(shift => {
              // Calculate position and width for the shift visual
              const startHour = parseInt(shift.start_time.split(':')[0]);
              const endHour = parseInt(shift.end_time.split(':')[0]);
              const startPosition = Math.max(0, Math.round((startHour - 6) / 3));
              const duration = Math.round((endHour - startHour) / 3);
              
              return (
                <div key={shift.shift_id} className="grid grid-cols-9 gap-2 mb-3 items-center">
                  <div className="col-span-2 flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-sm font-medium">
                      {shift.employee_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{shift.employee_name}</div>
                      <div className="text-xs text-zinc-500">{shift.position}</div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Badge className={`${DEPARTMENT_COLORS[shift.department] || 'bg-zinc-600'} text-xs`}>
                      {shift.department}
                    </Badge>
                  </div>
                  
                  {/* Time grid */}
                  {[0, 1, 2, 3, 4, 5].map(col => (
                    <div 
                      key={col} 
                      className={`col-span-1 h-8 ${col === startPosition ? 'relative' : ''}`}
                    >
                      {col === startPosition && (
                        <div 
                          className="absolute inset-0 bg-indigo-500/30 border border-indigo-500 rounded-md flex items-center justify-center text-xs text-white"
                          style={{ 
                            width: `calc(${duration * 100}% + ${duration - 1}*0.5rem)`,
                          }}
                        >
                          {shift.start_time} - {shift.end_time}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}
