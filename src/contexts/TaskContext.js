'use client'

import { createContext, useContext, useState, useEffect } from 'react'

// Create the context
const TaskContext = createContext(undefined)

// Custom hook to use the task context
export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch tasks on initial load
  useEffect(() => {
    async function fetchTasks() {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/tasks')

        if (!res.ok) {
          throw new Error(`Failed to fetch tasks: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()

        // Transform data if needed to match expected format
        const transformedTasks = Array.isArray(data) ? data.map(task => {
          // Ensure all tasks have the required fields
          return {
            id: task.id || task.task_id || Math.random().toString(36).substr(2, 9),
            title: task.title || task.task_name || task.name || "Untitled Task",
            description: task.description || "",
            assigned_to: task.assigned_to || task.assignee || "",
            status: task.status || "pending",
            priority: task.priority || "medium",
            location: task.location || "",
            due_date: task.due_date || null,
            department: task.department || ""
          }
        }) : [];

        setTasks(transformedTasks)
      } catch (err) {
        console.error("Error fetching tasks:", err)
        setError("Failed to load tasks. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // Apply filters to tasks
  const filterTasks = (filters = {}) => {
    let result = [...tasks];
    
    // Filter by status
    if (filters.status && filters.status !== 'all') {
      result = result.filter(task => task.status === filters.status);
    }
    
    // Filter by priority
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }
    
    // Filter by department
    if (filters.department && filters.department !== 'all') {
      result = result.filter(task => task.department === filters.department);
    }
    
    // Filter by due date
    if (filters.dueDate) {
      if (filters.dueDate === 'today') {
        const today = new Date().setHours(0, 0, 0, 0);
        result = result.filter(task => {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date).setHours(0, 0, 0, 0);
          return dueDate === today;
        });
      } else if (filters.dueDate === 'this-week') {
        const today = new Date().setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        result = result.filter(task => {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date).setHours(0, 0, 0, 0);
          return dueDate >= today && dueDate <= nextWeek.getTime();
        });
      }
    }
    
    // Filter by text search
    if (filters.searchText) {
      const query = filters.searchText.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.assigned_to && task.assigned_to.toLowerCase().includes(query)) ||
        (task.location && task.location.toLowerCase().includes(query)) ||
        (task.department && task.department.toLowerCase().includes(query))
      );
    }
    
    return result;
  }

  // Update filtered tasks with a search query
  const handleTasksFiltered = (filtered, query) => {
    setFilteredTasks(filtered)
    setSearchQuery(query)
  }
  
  // Clear filtered results
  const clearFiltered = () => {
    setFilteredTasks(null)
    setSearchQuery('')
  }

  // Add a new task
  const addTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, {
      id: Math.random().toString(36).substr(2, 9),
      ...newTask
    }]);
  }

  // Update a task
  const updateTask = (taskId, updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  }

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }

  // Update task status
  const updateTaskStatus = (taskId, status) => {
    updateTask(taskId, { status });
  }

//   const resetTasks = () => {
//     // setTasks()
//     setFilteredTasks(tasks)
//     setSearchQuery('');
//   }

  const value = {
    tasks,
    filteredTasks,
    searchQuery,
    isLoading,
    error,
    filterTasks,
    handleTasksFiltered,
    clearFiltered,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilteredTasks,
    setSearchQuery,
    // resetTasks
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
