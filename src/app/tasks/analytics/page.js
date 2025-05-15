'use client'

import { useTaskContext } from '@/contexts/TaskContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart4,
  Users,
  Building2,
  ArrowRight,
  PieChart,
  Activity,
  ListChecks
} from "lucide-react"
import { getDepartmentIcon } from '../icons'
import { STATUS_LABELS, STATUS_COLORS } from '../../utils'
import SearchQueryIndicator from '@/components/tasks/SearchQueryIndicator'

export default function AnalyticsTasksPage() {
  // Use the shared task context
  const { tasks, filteredTasks, isLoading } = useTaskContext()
  
  // Determine which tasks array to use
  const currentTasks = filteredTasks?.length > 0 ? filteredTasks : tasks;
  
  // Calculate task statistics
  const totalTasks = currentTasks.length
  const pendingTasks = currentTasks.filter(task => task.status === 'pending').length
  const inProgressTasks = currentTasks.filter(task => task.status === 'in_progress').length
  const completedTasks = currentTasks.filter(task => task.status === 'completed').length
  
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
  const pendingRate = totalTasks ? Math.round((pendingTasks / totalTasks) * 100) : 0
  
  // Tasks by priority
  const highPriorityTasks = currentTasks.filter(task => task.priority === 'high').length
  const mediumPriorityTasks = currentTasks.filter(task => task.priority === 'medium').length
  const lowPriorityTasks = currentTasks.filter(task => task.priority === 'low').length
  
  // Tasks by department
  const departmentCounts = currentTasks.reduce((acc, task) => {
    const dept = task.department || 'Uncategorized';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
  
  // Top departments by task count
  const topDepartments = Object.entries(departmentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Due dates
  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const overdueTasks = currentTasks.filter(task => {
    if (!task.due_date || task.status === 'completed') return false;
    return new Date(task.due_date) < new Date();
  }).length;
  
  const dueTodayTasks = currentTasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date).setHours(0, 0, 0, 0);
    return dueDate === today && task.status !== 'completed';
  }).length;

  // Calculate assignments to employees
  const assignmentCounts = currentTasks.reduce((acc, task) => {
    const assignee = task.assigned_to || 'Unassigned';
    acc[assignee] = (acc[assignee] || 0) + 1;
    return acc;
  }, {});
  
  // Top employees by assignments
  const topAssignees = Object.entries(assignmentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  // Calculate completion efficiency (completed tasks vs. assigned)
  const employeeEfficiency = {};
  currentTasks.forEach(task => {
    const assignee = task.assigned_to || 'Unassigned';
    if (!employeeEfficiency[assignee]) {
      employeeEfficiency[assignee] = { completed: 0, total: 0 };
    }
    employeeEfficiency[assignee].total++;
    if (task.status === 'completed') {
      employeeEfficiency[assignee].completed++;
    }
  });
  
  // Top employees by efficiency
  const topEfficiency = Object.entries(employeeEfficiency)
    .filter(([_, stats]) => stats.total >= 2) // At least 2 tasks for meaningful efficiency
    .map(([name, stats]) => ({
      name,
      rate: Math.round((stats.completed / stats.total) * 100),
      completed: stats.completed,
      total: stats.total
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5);

  if (isLoading) {
    return <div className="text-center py-12 text-zinc-400">Loading task analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Tasks Analytics</h1>
        
        {/* Use the shared SearchQueryIndicator component */}
        <SearchQueryIndicator />
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-zinc-400 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-white">{totalTasks}</p>
              </div>
              <div className="p-3 bg-indigo-500/20 rounded-full">
                <ListChecks className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-yellow-500" 
                  style={{ width: `${pendingRate}%` }}
                  title={`Pending: ${pendingTasks} tasks (${pendingRate}%)`}
                ></div>
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${inProgressTasks / totalTasks * 100}%` }}
                  title={`In Progress: ${inProgressTasks} tasks (${Math.round(inProgressTasks / totalTasks * 100)}%)`}
                ></div>
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${completionRate}%` }}
                  title={`Completed: ${completedTasks} tasks (${completionRate}%)`}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                <span className="text-zinc-400">Pending</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                <span className="text-zinc-400">In Progress</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                <span className="text-zinc-400">Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-zinc-400 text-sm">Completion Rate</p>
                <p className="text-3xl font-bold text-white">{completionRate}%</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full mt-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-zinc-400 text-sm">Due Today</p>
                <p className="text-3xl font-bold text-white">{dueTodayTasks}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 text-xs text-zinc-500">
              <span>Today&apos;s deadline</span>
              <span>{dueTodayTasks} remaining</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-zinc-400 text-sm">Overdue</p>
                <p className="text-3xl font-bold text-white">{overdueTasks}</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 text-xs">
              <span className="text-red-400">{overdueTasks > 0 ? 'Action required' : 'All caught up!'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department and Assignee Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-white">Department Breakdown</CardTitle>
              <Building2 className="h-5 w-5 text-zinc-500" />
            </div>
            <CardDescription className="text-zinc-400">Task distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDepartments.map(([department, count]) => {
                const { Icon, colorClass } = getDepartmentIcon(department);
                const percentage = Math.round((count / totalTasks) * 100);
                
                return (
                  <div key={department} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md bg-zinc-800 ${colorClass}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm text-zinc-300">{department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-zinc-800 text-zinc-300">
                          {count} tasks
                        </Badge>
                        <span className="text-xs text-zinc-500">{percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full">
                      <div 
                        className={`h-1.5 rounded-full bg-gradient-to-r ${getDepartmentGradient(colorClass)}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-white">Priority Distribution</CardTitle>
              <Activity className="h-5 w-5 text-zinc-500" />
            </div>
            <CardDescription className="text-zinc-400">Task breakdown by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="w-1/3 p-3 bg-zinc-800 rounded-lg text-center">
                <div className="p-2 rounded-full bg-red-500/20 text-red-500 w-10 h-10 flex items-center justify-center mx-auto">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <p className="mt-1 text-zinc-300 text-sm">High</p>
                <p className="text-white font-bold text-xl">{highPriorityTasks}</p>
              </div>
              <div className="w-1/3 p-3 bg-zinc-800 rounded-lg text-center">
                <div className="p-2 rounded-full bg-amber-500/20 text-amber-500 w-10 h-10 flex items-center justify-center mx-auto">
                  <Clock className="h-5 w-5" />
                </div>
                <p className="mt-1 text-zinc-300 text-sm">Medium</p>
                <p className="text-white font-bold text-xl">{mediumPriorityTasks}</p>
              </div>
              <div className="w-1/3 p-3 bg-zinc-800 rounded-lg text-center">
                <div className="p-2 rounded-full bg-slate-500/20 text-slate-400 w-10 h-10 flex items-center justify-center mx-auto">
                  <BarChart4 className="h-5 w-5" />
                </div>
                <p className="mt-1 text-zinc-300 text-sm">Low</p>
                <p className="text-white font-bold text-xl">{lowPriorityTasks}</p>
              </div>
            </div>
            <div className="h-2 flex rounded-full overflow-hidden">
              <div className="bg-red-500" style={{ width: `${(highPriorityTasks / totalTasks) * 100}%` }}></div>
              <div className="bg-amber-500" style={{ width: `${(mediumPriorityTasks / totalTasks) * 100}%` }}></div>
              <div className="bg-slate-500" style={{ width: `${(lowPriorityTasks / totalTasks) * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status and Employee Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Overview */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-white">Status Overview</CardTitle>
              <PieChart className="h-5 w-5 text-zinc-500" />
            </div>
            <CardDescription className="text-zinc-400">Current state of all tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(STATUS_LABELS).map(([statusKey, statusLabel]) => {
                const count = tasks.filter(task => task.status === statusKey).length;
                const percentage = Math.round((count / totalTasks) * 100) || 0;
                const colorClass = STATUS_COLORS[statusKey].split(' ')[0]; // Get just the bg color
                
                return (
                  <div key={statusKey} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${colorClass}`}></span>
                        <span className="text-sm text-zinc-300">{statusLabel}</span>
                      </div>
                      <div>
                        <span className="text-sm text-zinc-300 font-medium">{count} ({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${colorClass}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Employee Performance */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-white">Employee Performance</CardTitle>
              <Users className="h-5 w-5 text-zinc-500" />
            </div>
            <CardDescription className="text-zinc-400">Task completion rate by employee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEfficiency.map((employee) => (
                <div key={employee.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {employee.name.charAt(0)}
                      </div>
                      <span className="text-sm text-zinc-300">{employee.name}</span>
                    </div>
                    <div>
                      <span className="text-sm text-zinc-300 font-medium">
                        {employee.completed}/{employee.total} ({employee.rate}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" 
                      style={{ width: `${employee.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper function to generate appropriate gradient based on department color
function getDepartmentGradient(colorClass) {
  switch(colorClass) {
    case 'text-blue-500': return 'from-blue-600 to-blue-400';
    case 'text-green-500': return 'from-green-600 to-green-400';
    case 'text-orange-500': return 'from-orange-600 to-orange-400';
    case 'text-purple-500': return 'from-purple-600 to-purple-400';
    case 'text-yellow-500': return 'from-yellow-600 to-yellow-400';
    case 'text-indigo-500': return 'from-indigo-600 to-indigo-400';
    case 'text-red-500': return 'from-red-600 to-red-400';
    case 'text-pink-500': return 'from-pink-600 to-pink-400';
    case 'text-amber-500': return 'from-amber-600 to-amber-400';
    case 'text-cyan-500': return 'from-cyan-600 to-cyan-400';
    default: return 'from-gray-600 to-gray-400';
  }
}
