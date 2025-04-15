'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  Filter,
  MoreVertical,
  Plus,
  User,
  Calendar,
  AlertCircle,
  Check,
  Clock,
  MapPin
} from 'lucide-react'
import { getDepartmentIcon } from '../icons'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  STATUS_LABELS, 
  STATUS_COLORS, 
  PRIORITY_COLORS, 
  PRIORITY_LABELS, 
  isDueSoon, 
  formatDate, 
  isOverdue 
} from '../../utils'

export default function TaskTableView() {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data)
        setFilteredTasks(data)
      })
  }, [])
  
  // Handle filter and search
  useEffect(() => {
    let filtered = [...tasks];
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.assigned_to && task.assigned_to.toLowerCase().includes(query)) ||
        (task.location && task.location.toLowerCase().includes(query)) ||
        (task.department && task.department.toLowerCase().includes(query))
      );
    }
    
    setFilteredTasks(filtered);
  }, [filterStatus, searchQuery, tasks]);

  // Status counts
  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  const inProgressCount = tasks.filter(task => task.status === 'in_progress').length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Task Table View</h2>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-[200px]"
            />
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap border-b border-zinc-800 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 font-medium text-sm relative ${
            filterStatus === 'all' 
              ? 'text-white' 
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          All Tasks ({tasks.length})
          {filterStatus === 'all' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></span>
          )}
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 font-medium text-sm relative ${
            filterStatus === 'pending' 
              ? 'text-white' 
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          Pending ({pendingCount})
          {filterStatus === 'pending' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></span>
          )}
        </button>
        <button
          onClick={() => setFilterStatus('in_progress')}
          className={`px-4 py-2 font-medium text-sm relative ${
            filterStatus === 'in_progress' 
              ? 'text-white' 
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          In Progress ({inProgressCount})
          {filterStatus === 'in_progress' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></span>
          )}
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 font-medium text-sm relative ${
            filterStatus === 'completed' 
              ? 'text-white' 
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          Completed ({completedCount})
          {filterStatus === 'completed' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></span>
          )}
        </button>
      </div>
      
      {/* Tasks Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-900">
                <TableHead className="text-zinc-400">Task</TableHead>
                <TableHead className="text-zinc-400">Department</TableHead>
                <TableHead className="text-zinc-400">Assigned To</TableHead>
                <TableHead className="text-zinc-400">Location</TableHead>
                <TableHead className="text-zinc-400">Due Date</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Priority</TableHead>
                <TableHead className="text-zinc-400 w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => {
                // Get department icon
                const { Icon, colorClass } = getDepartmentIcon(task.department || 'default');
                
                // Check if task is overdue
                const overdue = isOverdue(task.due_date) && task.status !== 'completed';
                
                // Check if task is due soon
                const dueSoon = isDueSoon(task.due_date) && task.status !== 'completed';
                
                return (
                  <TableRow key={task.id} className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableCell>
                      <div className="max-w-[280px]">
                        <div className="font-medium text-white">{task.title}</div>
                        {task.description && (
                          <div className="text-zinc-400 text-sm truncate">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {task.department && (
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md bg-zinc-800 ${colorClass}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm text-zinc-300 whitespace-nowrap">{task.department}</span>
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs">
                          {task.assigned_to?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm text-zinc-300">{task.assigned_to}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {task.location && (
                        <div className="flex items-center text-sm text-zinc-300">
                          <MapPin className="h-3 w-3 mr-1.5 text-zinc-500" />
                          {task.location}
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {task.due_date ? (
                        <div className={`flex items-center text-sm ${
                          overdue 
                            ? 'text-red-400' 
                            : dueSoon 
                              ? 'text-amber-400' 
                              : 'text-zinc-400'
                        }`}>
                          <Clock className="h-3 w-3 mr-1.5" />
                          {formatDate(task.due_date)}
                          {overdue && <AlertCircle className="h-3 w-3 ml-1 text-red-400" />}
                        </div>
                      ) : (
                        <span className="text-sm text-zinc-500">Not set</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={STATUS_COLORS[task.status]}>
                        {STATUS_LABELS[task.status]}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={PRIORITY_COLORS[task.priority]}>
                        {task.priority || 'medium'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {task.status !== 'completed' && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500 hover:text-green-400 hover:bg-green-900/20">
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              No tasks found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
