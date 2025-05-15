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
  MapPin,
  ChevronDown,
  ArrowUpDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Trash,
  Edit
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  STATUS_LABELS, 
  STATUS_COLORS, 
  PRIORITY_COLORS, 
  PRIORITY_LABELS, 
  isDueSoon, 
  formatDate, 
  isOverdue 
} from '../../utils'
import { useTaskContext } from '@/contexts/TaskContext'
import SearchQueryIndicator from '@/components/tasks/SearchQueryIndicator'

export default function TaskTableView() {
  const [filteredTasks, setFilteredTasks] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('due_date')
  const [sortDir, setSortDir] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTasks, setSelectedTasks] = useState([])
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Use the shared task context
  const { tasks, filteredTasks: contextFilteredTasks, isLoading, updateTaskStatus } = useTaskContext()
  
  const pageSize = 10
  
  // Apply all filters and sorting
  useEffect(() => {
    // Use context filtered tasks if they exist, otherwise use all tasks
    let tasksToFilter = contextFilteredTasks?.length > 0 ? contextFilteredTasks : tasks;
    
    let filtered = [...tasksToFilter];
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }
    
    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }
    
    // Filter by department
    if (filterDepartment !== 'all') {
      filtered = filtered.filter(task => task.department === filterDepartment);
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
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'due_date') {
        // Handle null dates
        if (!a.due_date && !b.due_date) comparison = 0;
        else if (!a.due_date) comparison = 1;
        else if (!b.due_date) comparison = -1;
        else comparison = new Date(a.due_date) - new Date(b.due_date);
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
      } else {
        comparison = (a[sortBy] || '').localeCompare(b[sortBy] || '');
      }
      
      return sortDir === 'asc' ? comparison : -comparison;
    });
    
    setFilteredTasks(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
    // Clear selected tasks when filter changes
    setSelectedTasks([]);
  }, [filterStatus, filterPriority, filterDepartment, searchQuery, tasks, contextFilteredTasks, sortBy, sortDir]);

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle direction if already sorting by this column
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column with default direction
      setSortBy(column);
      setSortDir('asc');
    }
  };
  
  // Get available departments for filter
  const departments = [...new Set(tasks.map(task => task.department).filter(Boolean))];

  // Status counts
  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  const inProgressCount = tasks.filter(task => task.status === 'in_progress').length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  
  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageTasks = filteredTasks.slice(startIndex, endIndex);
  
  // Bulk selection
  const toggleSelectAll = () => {
    if (selectedTasks.length === currentPageTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(currentPageTasks.map(task => task.id));
    }
  };
  
  const toggleSelectTask = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };
  
  // Task details
  const openTaskDetails = (task) => {
    setCurrentTask(task);
    setIsDetailOpen(true);
  };
  
  // Bulk actions
  const handleBulkAction = (action) => {
    if (selectedTasks.length === 0) return;
    
    if (action === 'complete') {
      // Mark selected tasks as complete
      const updatedTasks = tasks.map(task => 
        selectedTasks.includes(task.id) 
          ? {...task, status: 'completed'} 
          : task
      );
      setTasks(updatedTasks);
    } else if (action === 'delete') {
      // Delete selected tasks
      const updatedTasks = tasks.filter(task => !selectedTasks.includes(task.id));
      setTasks(updatedTasks);
    }
    
    // Clear selection after action
    setSelectedTasks([]);
  };
  
  // Update task status (use the context method)
  const handleUpdateTaskStatus = (taskId, status) => {
    updateTaskStatus(taskId, status);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterPriority('all');
    setFilterDepartment('all');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Task Table View</h2>

        {/* Use the shared SearchQueryIndicator component */}
        <SearchQueryIndicator />

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

          <Button 
            variant="outline" 
            className="border-zinc-700 bg-zinc-900 text-zinc-300"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {(filterPriority !== 'all' || filterDepartment !== 'all') && (
              <Badge variant="secondary" className="ml-2 bg-indigo-500 text-white">
                {(filterPriority !== 'all' && filterDepartment !== 'all') ? '2' : '1'}
              </Badge>
            )}
          </Button>
        </div>
      </div>
      
      {/* Advanced Filters */}
      {isFilterOpen && (
        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <div className="flex flex-wrap gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Priority</label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[140px] bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem className="text-white" value="all">All Priorities</SelectItem>
                  <SelectItem className="text-white" value="high">High</SelectItem>
                  <SelectItem className="text-white" value="medium">Medium</SelectItem>
                  <SelectItem className="text-white" value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Department</label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[160px] bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem className="text-white" value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem className="text-white" key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button variant="ghost" onClick={resetFilters} className="text-zinc-400 hover:text-white">
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Selected Items Actions */}
      {selectedTasks.length > 0 && (
        <div className="bg-indigo-600/20 border border-indigo-600/50 rounded-md p-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-indigo-300 text-sm mr-2">{selectedTasks.length} item{selectedTasks.length !== 1 ? 's' : ''} selected</span>
            <Button 
              variant="ghost"
              size="sm" 
              className="text-zinc-300 hover:text-white"
              onClick={() => setSelectedTasks([])}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="border-indigo-500/50 text-indigo-300 hover:text-white hover:bg-indigo-600/30"
              onClick={() => handleBulkAction('complete')}
            >
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Mark Complete
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-red-500/50 text-red-300 hover:text-white hover:bg-red-600/30"
              onClick={() => handleBulkAction('delete')}
            >
              <Trash className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      )}
      
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
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="ml-2 text-zinc-400">Loading tasks...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-zinc-900">
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={currentPageTasks.length > 0 && selectedTasks.length === currentPageTasks.length}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all tasks"
                        className="data-[state=checked]:bg-indigo-600"
                      />
                    </TableHead>
                    <TableHead className="text-zinc-400">
                      <button onClick={() => handleSort('title')} className="flex items-center">
                        Task
                        <ArrowUpDown className={`h-3.5 w-3.5 ml-1 ${sortBy === 'title' ? 'text-indigo-500' : 'text-zinc-600'}`} />
                      </button>
                    </TableHead>
                    <TableHead className="text-zinc-400">
                      <button onClick={() => handleSort('department')} className="flex items-center">
                        Department
                        <ArrowUpDown className={`h-3.5 w-3.5 ml-1 ${sortBy === 'department' ? 'text-indigo-500' : 'text-zinc-600'}`} />
                      </button>
                    </TableHead>
                    <TableHead className="text-zinc-400">
                      <button onClick={() => handleSort('assigned_to')} className="flex items-center">
                        Assigned To
                        <ArrowUpDown className={`h-3.5 w-3.5 ml-1 ${sortBy === 'assigned_to' ? 'text-indigo-500' : 'text-zinc-600'}`} />
                      </button>
                    </TableHead>
                    <TableHead className="text-zinc-400">
                      <button onClick={() => handleSort('location')} className="flex items-center">
                        Location
                        <ArrowUpDown className={`h-3.5 w-3.5 ml-1 ${sortBy === 'location' ? 'text-indigo-500' : 'text-zinc-600'}`} />
                      </button>
                    </TableHead>
                    <TableHead className="text-zinc-400">
                      <button onClick={() => handleSort('due_date')} className="flex items-center">
                        Due Date
                        <ArrowUpDown className={`h-3.5 w-3.5 ml-1 ${sortBy === 'due_date' ? 'text-indigo-500' : 'text-zinc-600'}`} />
                      </button>
                    </TableHead>
                    <TableHead className="text-zinc-400">
                      <button onClick={() => handleSort('status')} className="flex items-center">
                        Status
                        <ArrowUpDown className={`h-3.5 w-3.5 ml-1 ${sortBy === 'status' ? 'text-indigo-500' : 'text-zinc-600'}`} />
                      </button>
                    </TableHead>
                    <TableHead className="text-zinc-400">
                      <button onClick={() => handleSort('priority')} className="flex items-center">
                        Priority
                        <ArrowUpDown className={`h-3.5 w-3.5 ml-1 ${sortBy === 'priority' ? 'text-indigo-500' : 'text-zinc-600'}`} />
                      </button>
                    </TableHead>
                    <TableHead className="text-zinc-400 w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageTasks.map((task) => {
                    // Get department icon
                    const { Icon, colorClass } = getDepartmentIcon(task.department || 'default');
                    
                    // Check if task is overdue
                    const overdue = isOverdue(task.due_date) && task.status !== 'completed';
                    
                    // Check if task is due soon
                    const dueSoon = isDueSoon(task.due_date) && task.status !== 'completed';
                    
                    return (
                      <TableRow 
                        key={task.id} 
                        className={`border-zinc-800 hover:bg-zinc-800/50 ${selectedTasks.includes(task.id) ? 'bg-indigo-900/10' : ''}`}
                      >
                        <TableCell className="pr-0">
                          <Checkbox
                            checked={selectedTasks.includes(task.id)}
                            onCheckedChange={() => toggleSelectTask(task.id)}
                            aria-label={`Select task ${task.title}`}
                            className="data-[state=checked]:bg-indigo-600"
                          />
                        </TableCell>
                        <TableCell onClick={() => openTaskDetails(task)} className="cursor-pointer">
                          <div className="max-w-[280px]">
                            <div className="font-medium text-white" title={task.title}>{task.title}</div>
                            {task.description && (
                              <div className="text-zinc-400 text-sm truncate" title={task.description}>
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
                              <span className="text-sm text-zinc-300 whitespace-nowrap" title={task.department}>{task.department}</span>
                            </div>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs">
                              {task.assigned_to?.charAt(0) || '?'}
                            </div>
                            <span className="text-sm text-zinc-300" title={task.assigned_to}>{task.assigned_to}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {task.location && (
                            <div className="flex items-center text-sm text-zinc-300" title={task.location}>
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
                            {/* {task.priority || 'medium'} */}
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1) || 'Medium'}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            {task.status !== 'completed' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-green-500 hover:text-green-400 hover:bg-green-900/20"
                                onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                                aria-label="Mark as completed"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-white">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-zinc-900 border border-zinc-800 text-zinc-300">
                                <DropdownMenuItem 
                                  className="hover:bg-zinc-800 hover:text-white cursor-pointer"
                                  onClick={() => openTaskDetails(task)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Task
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="hover:bg-zinc-800 hover:text-white cursor-pointer"
                                  onClick={() => handleUpdateTaskStatus(task.id, task.status === 'pending' ? 'in_progress' : 'pending')}
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Change Status
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem 
                                  className="text-red-400 hover:bg-red-900/30 hover:text-red-300 cursor-pointer"
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete Task
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
            </div>
          )}
          
          {/* Pagination */}
          {filteredTasks.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
              <div className="text-sm text-zinc-500">
                Showing <span className="font-medium text-zinc-300">{startIndex + 1}</span> to <span className="font-medium text-zinc-300">{Math.min(endIndex, filteredTasks.length)}</span> of <span className="font-medium text-zinc-300">{filteredTasks.length}</span> tasks
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className="h-8 w-8 p-0 bg-zinc-900 border-zinc-800 "
                >
                  <ChevronLeft className="h-4 w-4 text-zinc-300" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    // Show all pages if 5 or fewer
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    // If near the start
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // If near the end
                    pageNum = totalPages - 4 + i;
                  } else {
                    // Show current page in the middle
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button 
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-8 w-8 p-0 ${
                        pageNum === currentPage 
                          ? 'bg-indigo-600 hover:bg-indigo-700 border-none' 
                          : 'bg-zinc-900 border-zinc-800'
                      }`}
                    >
                      <div className='text-zinc-300'>
                        {pageNum}  
                      </div>
                    </Button>
                  );
                })}
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  className="h-8 w-8 p-0 bg-zinc-900 border-zinc-800"
                >
                  <ChevronRight className="h-4 w-4 text-zinc-300" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Task Detail Drawer */}
      {currentTask && (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="bg-zinc-900 border-l border-zinc-800 text-white sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-white">{currentTask.title}</SheetTitle>
              <SheetDescription className="text-zinc-400">
                Task ID: {currentTask.id}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-8 space-y-6">
              {/* Task Description */}
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-1">Description</h3>
                <p className="text-zinc-300">{currentTask.description || "No description provided."}</p>
              </div>
              
              {/* Task Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-1">Status</h3>
                  <Badge className={STATUS_COLORS[currentTask.status]}>
                    {STATUS_LABELS[currentTask.status]}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-1">Priority</h3>
                  <Badge className={PRIORITY_COLORS[currentTask.priority]}>
                    {/* {PRIORITY_LABELS[currentTask.priority]} */}
                    {currentTask.priority.charAt(0).toUpperCase() + currentTask.priority.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-1">Assigned To</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs">
                      {currentTask.assigned_to?.charAt(0) || '?'}
                    </div>
                    <span className="text-sm text-zinc-300">{currentTask.assigned_to || "Unassigned"}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-1">Due Date</h3>
                  <div className="text-zinc-300">
                    {currentTask.due_date ? formatDate(currentTask.due_date) : "Not set"}
                  </div>
                </div>
              </div>
              
              {/* Location & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-1">Department</h3>
                  {currentTask.department ? (
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md bg-zinc-800 ${getDepartmentIcon(currentTask.department).colorClass}`}>
                        {(() => {
                          const { Icon } = getDepartmentIcon(currentTask.department);
                          return <Icon className="h-3.5 w-3.5" />;
                        })()}
                      </div>
                      <span className="text-sm text-zinc-300">{currentTask.department}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-zinc-500">Not specified</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-1">Location</h3>
                  {currentTask.location ? (
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <MapPin className="h-4 w-4 text-zinc-500" />
                      {currentTask.location}
                    </div>
                  ) : (
                    <span className="text-sm text-zinc-500">Not specified</span>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button className="bg-indigo-600 hover:bg-indigo-700 flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </Button>
                {currentTask.status !== 'completed' ? (
                  <Button 
                    variant="outline" 
                    className="border-green-600/50 text-green-500 hover:bg-green-600/20 hover:text-green-400 flex-1"
                    onClick={() => handleUpdateTaskStatus(currentTask.id, 'completed')}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="border-amber-600/50 text-amber-500 hover:bg-amber-600/20 hover:text-amber-400 flex-1"
                    onClick={() => handleUpdateTaskStatus(currentTask.id, 'in_progress')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Reopen
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
