'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getDepartmentIcon } from '../icons'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { isOverdue, isDueSoon } from '../../utils'
import { useTaskContext } from '@/contexts/TaskContext'
import SearchQueryIndicator from '@/components/tasks/SearchQueryIndicator'

export default function QuickTaskView() {
  // Use the shared task context
  const { tasks, filteredTasks, isLoading } = useTaskContext()
  
  // Determine which tasks array to use
  const currentTasks = filteredTasks?.length > 0 ? filteredTasks : tasks;
  
  // Calculate today's date for highlighting today's tasks
  const today = new Date().setHours(0, 0, 0, 0)
  
  // Critical metrics
  const totalPending = currentTasks.filter(task => task.status === 'pending').length
  const totalInProgress = currentTasks.filter(task => task.status === 'in_progress').length
  const totalCompleted = currentTasks.filter(task => task.status === 'completed').length
  
  const overdueCount = currentTasks.filter(task => 
    isOverdue(task.due_date) && task.status !== 'completed'
  ).length
  
  const dueTodayCount = currentTasks.filter(task => {
    if (!task.due_date || task.status === 'completed') return false
    const dueDate = new Date(task.due_date).setHours(0, 0, 0, 0)
    return dueDate === today
  }).length
  
  // Top priority tasks (high priority or overdue)
  const urgentTasks = currentTasks
    .filter(task => 
      (task.priority === 'high' || isOverdue(task.due_date)) && 
      task.status !== 'completed'
    )
    .slice(0, 3) // Only show top 3
  
  // Group tasks by department for visibility
  const departmentTaskCounts = currentTasks.reduce((acc, task) => {
    if (task.status === 'completed') return acc
    
    const dept = task.department || 'Other'
    if (!acc[dept]) acc[dept] = 0
    acc[dept]++
    return acc
  }, {})
  
  // Get top departments with active tasks
  const topDepartments = Object.entries(departmentTaskCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Quick View Dashboard</h2>
        
        {/* Use the shared SearchQueryIndicator component */}
        <SearchQueryIndicator />
      </div>
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        <Card className={`bg-zinc-900 border-zinc-800 ${overdueCount > 0 ? 'border-l-4 border-l-red-500' : ''}`}>
          <CardContent className="p-3 flex items-center gap-3">
            <div className={`p-2.5 rounded-full ${overdueCount > 0 ? 'bg-red-900/30 text-red-500' : 'bg-zinc-800 text-zinc-500'}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-medium">Overdue</p>
              <p className="text-2xl font-bold text-white">{overdueCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`bg-zinc-900 border-zinc-800 ${dueTodayCount > 0 ? 'border-l-4 border-l-amber-500' : ''}`}>
          <CardContent className="p-3 flex items-center gap-3">
            <div className={`p-2.5 rounded-full ${dueTodayCount > 0 ? 'bg-amber-900/30 text-amber-500' : 'bg-zinc-800 text-zinc-500'}`}>
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-medium">Due Today</p>
              <p className="text-2xl font-bold text-white">{dueTodayCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-blue-900/30 text-blue-500">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-medium">In Progress</p>
              <p className="text-2xl font-bold text-white">{totalInProgress}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-green-900/30 text-green-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-medium">Pending</p>
              <p className="text-2xl font-bold text-white">{totalPending}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two-column layout for urgent tasks and department overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Urgent Tasks */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded bg-red-900/30 text-red-500">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-white">Urgent Tasks</h3>
          </div>
          
          <div className="space-y-2">
            {urgentTasks.length > 0 ? (
              urgentTasks.map((task) => {
                const { Icon, colorClass } = getDepartmentIcon(task.department || 'default')
                const isTaskOverdue = isOverdue(task.due_date)
                
                return (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-zinc-900 border border-zinc-800 rounded-lg p-2 ${
                      isTaskOverdue ? 'border-l-4 border-l-red-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${colorClass} bg-opacity-20`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white" title={task.title}>{task.title}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs">
                          <div className="flex items-center text-zinc-400" title={task.assigned_to}>
                            <User className="h-3 w-3 mr-1" /> 
                            {task.assigned_to}
                          </div>
                          {task.due_date && (
                            <div className={`flex items-center ${isTaskOverdue ? 'text-red-400' : isDueSoon(task.due_date) ? 'text-amber-400' : 'text-zinc-400'}`}>
                              <Clock className="h-3 w-3 mr-1" /> 
                              {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center text-zinc-500">
                No urgent tasks
              </div>
            )}
            
            {urgentTasks.length > 0 && tasks.filter(t => (t.priority === 'high' || isOverdue(t.due_date)) && t.status !== 'completed').length > 3 && (
              <div className="text-center text-xs text-zinc-500">
                +{tasks.filter(t => (t.priority === 'high' || isOverdue(t.due_date)) && t.status !== 'completed').length - 3} more urgent tasks
              </div>
            )}
          </div>
        </div>
        
        {/* Department Overview */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-white">Department Workload</h3>
          </div>
          
          <div className="space-y-3">
            {topDepartments.map(([department, count]) => {
              const { Icon, colorClass } = getDepartmentIcon(department)
              const percentage = Math.round((count / (totalPending + totalInProgress)) * 100)
              
              return (
                <div key={department} className="bg-zinc-900 border border-zinc-800 rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${colorClass} bg-opacity-20`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium text-white">{department}</span>
                    </div>
                    <Badge className="bg-zinc-800 text-zinc-300">{count} tasks</Badge>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={getProgressBarColor(percentage)}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
            
            {topDepartments.length === 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center text-zinc-500">
                No active tasks by department
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Today's Task Summary - Simple Timeline */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 rounded bg-blue-900/30 text-blue-500">
            <Calendar className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-white">Today&apos;s Quick Timeline</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {tasks
            .filter(task => {
              if (!task.due_date || task.status === 'completed') return false
              const dueDate = new Date(task.due_date).setHours(0, 0, 0, 0)
              return dueDate === today
            })
            .slice(0, 6)
            .map((task) => {
              const { Icon, colorClass } = getDepartmentIcon(task.department || 'default')
              const dueTime = task.due_date ? new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
              
              return (
                <Card key={task.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-2">
                    <div className={`p-1 rounded ${colorClass} bg-opacity-20 mb-1 inline-flex`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <div className="text-sm font-medium text-white line-clamp-1">{task.title}</div>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="text-zinc-400">{task.assigned_to.split(' ')[0]}</span>
                      <span className="text-amber-400 font-medium">{dueTime}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            
          {tasks.filter(t => {
            if (!t.due_date || t.status === 'completed') return false
            const dueDate = new Date(t.due_date).setHours(0, 0, 0, 0)
            return dueDate === today
          }).length === 0 && (
            <div className="col-span-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center text-zinc-500">
              No tasks scheduled for today
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to determine progress bar color based on percentage
function getProgressBarColor(percentage) {
  if (percentage >= 80) return 'h-1.5 bg-gradient-to-r from-red-600 to-red-400 rounded-full'
  if (percentage >= 50) return 'h-1.5 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full'
  return 'h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full'
}
