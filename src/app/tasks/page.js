'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Plus,
  Filter,
  User,
  Calendar,
  Loader2,
  BarChart4,
  ListChecks,
  Table2,
  LayoutGrid,
  Search
} from "lucide-react"
import { getDepartmentIcon } from './icons'
import { STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS, PRIORITY_ORDER, isDueSoon, formatDate } from '../utils'
import { useTaskContext } from '@/contexts/TaskContext'
import SearchQueryIndicator from '@/components/tasks/SearchQueryIndicator'

export default function CategoricalTasksPage() {
  const [activeTab, setActiveTab] = useState("status")
  const [filterStatus, setFilterStatus] = useState("all")
  const [viewType, setViewType] = useState("list") // list, table, kanban
  
  // Use the shared task context instead of local state
  const { 
    tasks, 
    filteredTasks, 
    searchQuery, 
    isLoading, 
    error, 
    clearFiltered 
  } = useTaskContext()

  // Helper function to sort tasks by due date (ascending - sooner dates first)
  const sortTasksByDueDate = (tasks) => {
    return [...tasks].sort((a, b) => {
      // Handle cases where due_date might be missing
      if (!a.due_date) return 1;  // Items without due date go to the bottom
      if (!b.due_date) return -1; // Items without due date go to the bottom

      // Compare dates
      return new Date(a.due_date) - new Date(b.due_date);
    });
  };

  // Determine which tasks array to use based on whether filtered tasks exist
  const currentTasks = filteredTasks?.length > 0 ? filteredTasks : tasks;

  // Group by status and sort by due date within each group
  const groupedByStatus = {
    pending: sortTasksByDueDate(currentTasks.filter(task => task.status === 'pending')),
    in_progress: sortTasksByDueDate(currentTasks.filter(task => task.status === 'in_progress')),
    completed: currentTasks.filter(task => task.status === 'completed').reverse() // Most recent completions first
  }

  // Group by department
  const groupedByDepartment = currentTasks.reduce((acc, task) => {
    const dept = task.department || 'Uncategorized';
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(task);
    return acc;
  }, {});

  // Get tasks due today
  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueTodayTasks = sortTasksByDueDate(currentTasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date).setHours(0, 0, 0, 0);
    return dueDate === today;
  }));

  // Tasks due this week (next 7 days)
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const dueThisWeekTasks = sortTasksByDueDate(currentTasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date).setHours(0, 0, 0, 0);
    return dueDate > today && dueDate <= nextWeek.getTime();
  }));

  // Render task card - reused across views
  const TaskCard = ({ task }) => {
    const { Icon, colorClass } = getDepartmentIcon(task.department);
    
    // Check if task is overdue
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

    return (
      <motion.div
        key={task.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`bg-zinc-900 border border-zinc-800 rounded-lg shadow-md hover:border-zinc-700 transition-all ${isOverdue ? 'border-red-800/50' : ''}`}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  {task.department && (
                    <div className="mt-1">
                      <div className={`p-2 rounded-md bg-zinc-800 ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold leading-tight text-white">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-zinc-400 text-sm line-clamp-2 mt-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-sm text-zinc-400">
                    <User className="h-3 w-3 mr-1" />
                    <span>{task.assigned_to}</span>
                  </div>

                  {task.due_date && (
                    <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-400' : isDueSoon(task.due_date) ? 'text-amber-400' : 'text-zinc-400'}`}>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(task.due_date)}{isOverdue ? ' (Overdue)' : ''}</span>
                    </div>
                  )}
                </div>

                {task.location && (
                  <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                    {task.location}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex flex-wrap gap-1.5">
                <Badge className={STATUS_COLORS[task.status]}>
                  {STATUS_LABELS[task.status]}
                </Badge>
                {task.priority && (
                  <Badge className={PRIORITY_COLORS[task.priority]}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Badge>
                )}
              </div>

              {task.status !== 'completed' && (
                <div className="flex gap-2">
                  {isOverdue && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs"
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Overdue
                    </Button>
                  )}
                  {!isOverdue && isDueSoon(task.due_date) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 bg-amber-900/30 hover:bg-amber-900/50 text-amber-400 text-xs"
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Urgent
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-zinc-400">Loading tasks...</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <p className="text-zinc-300 text-lg mb-2">Something went wrong</p>
        <p className="text-zinc-400 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Tasks Dashboard</h1>
        
        {/* Show search query if filtered by voice */}
        <SearchQueryIndicator />
      </div>

      {viewType === 'list' && (
        <Tabs defaultValue="status" className="w-full mb-6" onValueChange={setActiveTab}>
          <TabsList className="bg-zinc-900 w-full md:w-auto justify-start">
            <TabsTrigger className="data-[state=active]:text-zinc-800 text-zinc-300 px-4 py-1.5" value="status">By Status</TabsTrigger>
            <TabsTrigger className="data-[state=active]:text-zinc-800 text-zinc-300 px-4 py-1.5" value="department">By Department</TabsTrigger>
            <TabsTrigger className="data-[state=active]:text-zinc-800 text-zinc-300 px-4 py-1.5" value="due">By Due Date</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Status View */}
      {activeTab === "status" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(groupedByStatus).map(([status, statusTasks]) => (
            <div key={status}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg text-white flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${STATUS_COLORS[status].split(' ')[0]}`}></span>
                  {STATUS_LABELS[status]}
                  <Badge variant="outline" className="ml-2 text-xs bg-zinc-800 text-zinc-300">
                    {statusTasks.length}
                  </Badge>
                </h2>
              </div>

              <div className="space-y-3">
                {statusTasks.length > 0 ? (
                  statusTasks.map(task => <TaskCard key={task.id} task={task} />)
                ) : (
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4 text-center text-zinc-500">
                      No tasks in this category
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Department View */}
      {activeTab === "department" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedByDepartment).map(([department, departmentTasks]) => {
            const { Icon, colorClass } = getDepartmentIcon(department);

            return (
              <div key={department}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg text-white flex items-center gap-2">
                    <div className={`p-1.5 rounded-md bg-zinc-800 ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {department}
                    <Badge variant="outline" className="ml-2 text-xs bg-zinc-800 text-zinc-300">
                      {departmentTasks.length}
                    </Badge>
                  </h2>
                </div>

                <div className="space-y-3">
                  {departmentTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Due Date View */}
      {activeTab === "due" && (
        <div className="space-y-8">
          {/* Due Today */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg text-white flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-red-900/30 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                </div>
                Due Today
                <Badge variant="outline" className="ml-2 text-xs bg-zinc-800 text-zinc-300">
                  {dueTodayTasks.length}
                </Badge>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dueTodayTasks.length > 0 ? (
                dueTodayTasks.map(task => <TaskCard key={task.id} task={task} />)
              ) : (
                <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
                  <CardContent className="p-4 text-center text-zinc-500">
                    No tasks due today
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Due This Week */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg text-white flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-900/30 text-blue-400">
                  <Calendar className="h-4 w-4" />
                </div>
                Due This Week
                <Badge variant="outline" className="ml-2 text-xs bg-zinc-800 text-zinc-300">
                  {dueThisWeekTasks.length}
                </Badge>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dueThisWeekTasks.length > 0 ? (
                dueThisWeekTasks.map(task => <TaskCard key={task.id} task={task} />)
              ) : (
                <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
                  <CardContent className="p-4 text-center text-zinc-500">
                    No tasks due this week
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
