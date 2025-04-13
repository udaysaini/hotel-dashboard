'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'motion/react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

const PRIORITY_ORDER = ['high', 'medium', 'low']

export default function DashboardPage() {
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
    <main className="min-h-screen bg-zinc-950 text-white px-8 py-10 font-sans">
      <h1 className="text-4xl font-extrabold text-white mb-10 tracking-tight">
        Hotel Staff Task Dashboard
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
                            <Card className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                              <CardContent className="p-5">
                                <div className="flex flex-col gap-3">
                                  <h3 className="text-xl font-bold leading-tight text-white">
                                    {task.title}
                                  </h3>
                                  <p className="text-sm text-zinc-400 font-medium">
                                    Assigned to: <span className="text-white">{task.assigned_to}</span>
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge className={STATUS_COLORS[status]}>
                                      {STATUS_LABELS[status]}
                                    </Badge>
                                    {task.priority === 'high' && (
                                      <Badge className="bg-red-500 text-white animate-pulse">
                                        High Priority
                                      </Badge>
                                    )}
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
    </main>
  )
}