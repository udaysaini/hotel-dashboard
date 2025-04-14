// Common constants and utility functions for dashboard views

export const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue'
}

export const STATUS_COLORS = {
  pending: 'bg-yellow-300 text-yellow-900',
  in_progress: 'bg-blue-300 text-blue-900',
  completed: 'bg-green-300 text-green-900',
  overdue: 'bg-red-300 text-red-900'
}

export const PRIORITY_LABELS = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority'
}

export const PRIORITY_COLORS = {
  high: 'bg-red-500 text-white',
  medium: 'bg-amber-500 text-white',
  low: 'bg-slate-500 text-white'
}

export const PRIORITY_ORDER = ['high', 'medium', 'low']

export const DEPARTMENT_COLORS = {
  'Front Desk': 'bg-blue-500',
  'Housekeeping': 'bg-green-500',
  'Maintenance': 'bg-yellow-500',
  'Kitchen': 'bg-orange-500',
  'Dining': 'bg-purple-500',
  'Guest Services': 'bg-indigo-500',
  'Security': 'bg-red-500',
  'Events': 'bg-pink-500'
}

export const ORDER_STATUS_COLORS = {
  'Pending': 'bg-yellow-300 text-yellow-900',
  'Completed': 'bg-green-300 text-green-900',
  'Cancelled': 'bg-red-300 text-red-900'
}

// Function to check if task is due soon (within 24 hours)
export const isDueSoon = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  const diffHours = (due - now) / (1000 * 60 * 60);
  return diffHours > 0 && diffHours < 24;
}

// Function to check if a task is overdue
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  return due < now;
}

// Function to format date in a readable way
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Function to format just the date (no time)
export const formatShortDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

// Function to format just the time
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  // Handle both full timestamps and time-only strings
  if (timeStr.includes(':')) {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  } else {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }
}

// Function to group tasks by employee
export const groupTasksByEmployee = (tasks, employees) => {
  const employeeMap = {};
  
  // Create a map of employees for quick lookup
  employees.forEach(employee => {
    employeeMap[employee.employee_id] = employee;
  });
  
  // Initialize the grouping
  const grouped = {};
  
  tasks.forEach(task => {
    const employeeId = task.assigned_to;
    const employee = employeeMap[employeeId];
    
    if (employee) {
      const fullName = `${employee.first_name} ${employee.last_name}`;
      if (!grouped[fullName]) {
        grouped[fullName] = [];
      }
      grouped[fullName].push(task);
    }
  });
  
  return grouped;
}

// Function to get occupancy trend
export const getOccupancyTrend = (current, previous) => {
  if (!previous) return 'stable';
  return current > previous ? 'increasing' : current < previous ? 'decreasing' : 'stable';
}

// Function to calculate statistics from occupancy data
export const calculateOccupancyStats = (occupancyData) => {
  if (!occupancyData || occupancyData.length === 0) return {};
  
  const percentages = occupancyData.map(item => item.percentage);
  const average = percentages.reduce((sum, val) => sum + val, 0) / percentages.length;
  const max = Math.max(...percentages);
  const min = Math.min(...percentages);
  
  return {
    average: average.toFixed(1),
    max: max.toFixed(1),
    min: min.toFixed(1),
    current: percentages[percentages.length - 1].toFixed(1)
  };
}
