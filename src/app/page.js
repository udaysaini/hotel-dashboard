'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, AlertCircle, MoreVertical } from "lucide-react"

const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed'
}

const STATUS_COLORS = {
  pending: 'bg-yellow-300 text-yellow-900',
  in_progress: 'bg-blue-300 text-blue-900',
  completed: 'bg-green-300 text-green-900'
}

const PRIORITY_LABELS = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority'
}

const PRIORITY_COLORS = {
  high: 'bg-red-500 text-white',
  medium: 'bg-amber-500 text-white',
  low: 'bg-slate-500 text-white'
}

const PRIORITY_ORDER = ['high', 'medium', 'low']

// Function to check if task is due soon (within 24 hours)
const isDueSoon = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  const diffHours = (due - now) / (1000 * 60 * 60);
  return diffHours > 0 && diffHours < 24;
}

// Function to format date in a readable way
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function ClassicDashboardPage() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks)
  }, [])

  // First group by status
  const groupedTasks = {
    pending: [],
    in_progress: [],
    completed: []
  }

  tasks.forEach(task => {
    groupedTasks[task.status]?.push(task)
  })

  // Then group by priority within each status
  const groupedByPriority = Object.entries(groupedTasks).reduce((acc, [status, statusTasks]) => {
    const priorityGroups = {
      high: statusTasks.filter(task => task.priority === 'high'),
      medium: statusTasks.filter(task => task.priority === 'medium' || !task.priority),  // default to medium if no priority
      low: statusTasks.filter(task => task.priority === 'low')
    }
    
    acc[status] = priorityGroups
    return acc
  }, {})

  return (
    <div className="container mx-auto px-8 py-10">
      <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">
        Classic Dashboard View
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {Object.entries(groupedByPriority).map(([status, priorityGroups]) => (
          <div key={status} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-6 text-zinc-100 border-b border-zinc-700 pb-2">
              {STATUS_LABELS[status]}
            </h2>
            
            <Accordion type="multiple" defaultValue={['high']} className="space-y-4">
              {PRIORITY_ORDER.map(priority => {
                const priorityTasks = priorityGroups[priority]
                
                // Only show accordion item if there are tasks with this priority
                if (priorityTasks.length === 0) return null
                
                return (
                  <AccordionItem key={priority} value={priority} className="border-zinc-700">
                    <AccordionTrigger className="text-zinc-200 hover:text-white">
                      {PRIORITY_LABELS[priority]} ({priorityTasks.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {priorityTasks.map(task => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-md hover:border-zinc-600 hover:shadow-xl transition-all">
                              <CardContent className="p-5">
                                <div className="flex flex-col gap-4">
                                  <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold leading-tight text-white">
                                      {task.title}
                                    </h3>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  {task.description && (
                                    <p className="text-zinc-400 text-sm line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}
                                  
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm text-zinc-400 font-medium">
                                      Assigned to: <span className="text-white">{task.assigned_to}</span>
                                    </p>
                                    
                                    {task.due_date && (
                                      <div className={`flex items-center gap-1 text-sm ${isDueSoon(task.due_date) ? 'text-red-400' : 'text-zinc-400'}`}>
                                        <Clock className="h-3 w-3" />
                                        <span>{formatDate(task.due_date)}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex justify-between items-center mt-1">
                                    <div className="flex flex-wrap gap-2">
                                      <Badge className={STATUS_COLORS[status]}>
                                        {STATUS_LABELS[status]}
                                      </Badge>
                                      <Badge className={PRIORITY_COLORS[task.priority]}>
                                        {PRIORITY_LABELS[task.priority]}
                                      </Badge>
                                      {task.location && (
                                        <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                                          {task.location}
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      {status !== 'completed' && (
                                        <Button 
                                          size="sm" 
                                          variant="ghost" 
                                          className="h-8 bg-zinc-800 hover:bg-zinc-700 text-white"
                                        >
                                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                          Complete
                                        </Button>
                                      )}
                                      {isDueSoon(task.due_date) && status !== 'completed' && (
                                        <Button 
                                          size="sm" 
                                          variant="ghost" 
                                          className="h-8 bg-red-900/30 hover:bg-red-900/50 text-red-400"
                                        >
                                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                          Urgent
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        ))}
      </section>
    </div>
  )
}