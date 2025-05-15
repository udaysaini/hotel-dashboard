'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  Bell, 
  Check,
  ArrowUpRight, 
  MoreVertical,
  Flame
} from 'lucide-react'
import { getDepartmentIcon } from '../icons'
import { STATUS_COLORS, PRIORITY_COLORS, isDueSoon, formatDate } from '../../utils'
import { useTaskContext } from '@/contexts/TaskContext'
import SearchQueryIndicator from '@/components/tasks/SearchQueryIndicator'

export default function GlanceableTasksPage() {
  // Use the shared task context
  const { tasks, filteredTasks, isLoading } = useTaskContext()
  
  // Determine which tasks array to use
  const currentTasks = filteredTasks?.length > 0 ? filteredTasks : tasks;
  
  // Get tasks due today
  const today = new Date().setHours(0, 0, 0, 0);
  
  // Check if a task is overdue - simplified and more robust implementation
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };
  
  // Add debugging console log to see tasks and their overdue status
  console.log('Tasks with overdue status:', currentTasks.map(task => ({
    id: task.id,
    title: task.title,
    due_date: task.due_date,
    isOverdue: isOverdue(task.due_date),
    isDueSoon: isDueSoon(task.due_date),
    status: task.status
  })));
  
  const urgentTasks = currentTasks.filter(task => {
    // Only include non-completed tasks
    if (task.status === 'completed') return false;
    
    // Include if high priority, due soon OR overdue
    return task.priority === 'high' || isDueSoon(task.due_date) || isOverdue(task.due_date);
  }).sort((a, b) => {
    // Sort by overdue first, then by due date
    const aOverdue = isOverdue(a.due_date);
    const bOverdue = isOverdue(b.due_date);
    
    // If one is overdue and the other isn't, prioritize the overdue task
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    // If both have the same overdue status, sort by due date
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date) - new Date(b.due_date);
  });
  
  // Also log the filtered urgent tasks to confirm
  console.log('Urgent tasks:', urgentTasks.map(task => ({
    id: task.id,
    title: task.title,
    due_date: task.due_date,
    isOverdue: isOverdue(task.due_date)
  })));

  const dueTodayTasks = currentTasks.filter(task => {
    if (!task.due_date || task.status === 'completed') return false;
    const dueDate = new Date(task.due_date).setHours(0, 0, 0, 0);
    return dueDate === today;
  }).sort((a, b) => {
    // Sort by due date (most recent first)
    return new Date(a.due_date) - new Date(b.due_date);
  });
  
  // Get in-progress tasks
  const inProgressTasks = currentTasks.filter(task => task.status === 'in_progress');
  
  // Group tasks by assigned employee
  const groupedByEmployee = currentTasks.reduce((acc, task) => {
    if (task.status === 'completed') return acc;
    
    const assignee = task.assigned_to || 'Unassigned';
    if (!acc[assignee]) {
      acc[assignee] = [];
    }
    acc[assignee].push(task);
    return acc;
  }, {});
  
  // Get the top employees by number of tasks
  const topEmployees = Object.entries(groupedByEmployee)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  if (isLoading) {
    return <div className="text-center py-12 text-zinc-400">Loading tasks...</div>;
  }
  
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center mb-4">
          <div className="p-1.5 rounded-md bg-red-900/40 text-red-400 mr-2">
            <Flame className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Urgent Attention Needed</h2>
        </div>
        
        {/* Use the shared SearchQueryIndicator component */}
        <div className="mb-4">
          <SearchQueryIndicator />
        </div>
      </div>
      
      {/* Urgent Tasks - Animated Hot Zone */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {urgentTasks.length > 0 ? (
            urgentTasks.map((task) => (
              <motion.div
                key={task.id}
                className="bg-zinc-900 border border-red-900/40 rounded-lg p-4 relative overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Animated urgent indicator */}
                <div className="absolute top-0 right-0 w-10 h-10">
                  <motion.div
                    className="w-full h-full bg-red-500/20"
                    animate={{ 
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                    }}
                  />
                </div>
                
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-white" title={task.title}>{task.title}</h3>
                    <div className="text-sm text-zinc-400 mt-1" title={task.description}>
                      {task.description?.substring(0, 60)}
                      {task.description?.length > 60 ? '...' : ''}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isOverdue(task.due_date) && (
                      <Badge className="bg-red-700 text-white">Overdue</Badge>
                    )}
                    {task.priority === 'high' && (
                      <Badge className="bg-red-500 text-white">High Priority</Badge>
                    )}
                  </div>
                </div>
                
                {/* Task metadata and action buttons */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    {task.department && (() => {
                      const { Icon, colorClass } = getDepartmentIcon(task.department);
                      return (
                        <div className={`p-1 rounded-md bg-zinc-800 ${colorClass}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                      );
                    })()}
                    {task.due_date && (
                      <div className={`flex items-center gap-1 ${isOverdue(task.due_date) ? 'text-red-400' : isDueSoon(task.due_date) ? 'text-amber-400' : 'text-zinc-400'}`}>
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{formatDate(task.due_date)}{isOverdue(task.due_date) ? ' (Overdue)' : ''}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    className="bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs h-7"
                  >
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Take Action
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="text-zinc-500">No urgent tasks. Great job!</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Timeline for Today */}
      <div>
        <div className="flex items-center mb-4">
          <div className="p-1.5 rounded-md bg-indigo-900/40 text-indigo-400 mr-2">
            <Clock className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Today&apos;s Timeline</h2>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-zinc-800"></div>
          
          <div className="space-y-4">
            {dueTodayTasks.length > 0 ? (
              dueTodayTasks.map((task, index) => {
                const { Icon, colorClass } = getDepartmentIcon(task.department || 'default');
                
                return (
                  <motion.div
                    key={task.id}
                    className="pl-10 relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {/* Timeline node */}
                    <div className={`absolute left-0 top-2 w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center ${colorClass}`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-all">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-white">{task.title}</h3>
                        <div className="flex gap-2">
                          <Badge className={PRIORITY_COLORS[task.priority]}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Badge>
                          <Badge className={STATUS_COLORS[task.status]}>
                            {task.status === 'pending' ? 'To Do' : 'In Progress'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm text-zinc-400">
                          Assigned to: <span className="text-white">{task.assigned_to}</span>
                        </div>
                        {task.due_date && (
                          <div className="flex items-center gap-1 text-sm text-zinc-400">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(task.due_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="pl-10 py-6">
                <div className="absolute left-0 top-8 w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                  <p className="text-zinc-500">No tasks scheduled for today</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Employee task distribution */}
      <div>
        <div className="flex items-center mb-4">
          <div className="p-1.5 rounded-md bg-cyan-900/40 text-cyan-400 mr-2">
            <Bell className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Employee Task Load</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topEmployees.map(([employee, employeeTasks]) => (
            <div 
              key={employee}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-medium">
                    {employee.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{employee}</h3>
                    <p className="text-sm text-zinc-500">{employeeTasks.length} active tasks</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Task pills */}
              <div className="flex flex-wrap gap-2 mt-2">
                {employeeTasks.slice(0, 3).map(task => {
                  const { Icon, colorClass } = getDepartmentIcon(task.department || 'default');
                  
                  return (
                    <div 
                      key={task.id}
                      className="flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-1 text-sm"
                    >
                      <div className={`p-1 rounded-full ${colorClass}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <span className="text-zinc-300">{task.title}</span>
                      {isDueSoon(task.due_date) && (
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      )}
                    </div>
                  );
                })}
                {employeeTasks.length > 3 && (
                  <div className="flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-1 text-sm">
                    <span className="text-zinc-400">+{employeeTasks.length - 3} more</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
