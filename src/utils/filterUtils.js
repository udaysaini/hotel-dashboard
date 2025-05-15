/**
 * Utility functions for filtering tasks that can be shared between
 * voice and chat interfaces
 */

/**
 * Filter tasks based on a natural language query
 * @param {Array} tasks - The array of tasks to filter
 * @param {string} query - The natural language query string
 * @returns {Array} - Filtered tasks based on the query
 */
export function filterTasksByQuery(tasks, query) {
  // Normalize query for consistent matching
  const normalizedQuery = query.toLowerCase();
  let filteredResults = [];
  
  // Check for "show all tasks" or similar query to reset filters
  if (normalizedQuery.includes('all tasks') || 
      normalizedQuery.includes('show all') || 
      normalizedQuery.includes('reset filter') || 
      normalizedQuery.includes('clear filter') ||
      normalizedQuery.includes('show everything')) {
    // Return null to indicate all filters should be cleared
    return null;
  }
  
  // Filter by status
  if (normalizedQuery.includes('pending') || normalizedQuery.includes('not started') || normalizedQuery.includes('to do')) {
    return tasks.filter(task => task.status === 'pending');
  } else if (normalizedQuery.includes('in progress') || normalizedQuery.includes('started')) {
    return tasks.filter(task => task.status === 'in_progress');
  } else if (normalizedQuery.includes('completed') || normalizedQuery.includes('finished') || normalizedQuery.includes('done')) {
    return tasks.filter(task => task.status === 'completed');
  } 
  
  // Filter by priority
  else if (normalizedQuery.includes('high priority')) {
    return tasks.filter(task => task.priority === 'high');
  } else if (normalizedQuery.includes('medium priority')) {
    return tasks.filter(task => task.priority === 'medium');
  } else if (normalizedQuery.includes('low priority')) {
    return tasks.filter(task => task.priority === 'low');
  }
  
  // Filter by department
  else if (normalizedQuery.includes('department') || 
           normalizedQuery.includes('housekeeping') || 
           normalizedQuery.includes('maintenance') || 
           normalizedQuery.includes('front desk') || 
           normalizedQuery.includes('kitchen') || 
           normalizedQuery.includes('restaurant') || 
           normalizedQuery.includes('security') || 
           normalizedQuery.includes('management') || 
           normalizedQuery.includes('spa')) {
    
    const deptKeywords = [
      'housekeeping', 'maintenance', 'front desk', 'kitchen', 
      'restaurant', 'security', 'management', 'spa'
    ];
    
    for (const dept of deptKeywords) {
      if (normalizedQuery.includes(dept)) {
        return tasks.filter(task => 
          task.department?.toLowerCase().includes(dept)
        );
      }
    }
    
    // If we get here and the query mentioned 'department' but no specific department,
    // look for any department-related tasks
    if (normalizedQuery.includes('department')) {
      return tasks.filter(task => 
        task.department && task.department.trim() !== ''
      );
    }
  }
  
  // Filter by assignee (person name)
  else if (normalizedQuery.includes('assigned to') || normalizedQuery.includes('assigned')) {
    // Extract name after "assigned to"
    const assigneeMatch = normalizedQuery.match(/assigned(?:\s+to)?\s+(\w+)/i);
    if (assigneeMatch && assigneeMatch[1]) {
      const assigneeName = assigneeMatch[1];
      return tasks.filter(task => 
        task.assigned_to?.toLowerCase().includes(assigneeName.toLowerCase())
      );
    }
  }
  
  // Search for person name with related to or similar phrases
  else if (normalizedQuery.includes('related to') || 
           normalizedQuery.includes('for') || 
           normalizedQuery.includes('by') ||
           normalizedQuery.includes('associated with')) {
    
    // Get all tasks assigned_to values to check against
    const assignees = [...new Set(tasks.map(task => task.assigned_to).filter(Boolean))];
    
    // Look for any assignee name in the query
    for (const assignee of assignees) {
      const assigneeWords = assignee.toLowerCase().split(' ');
      
      // Check if any part of the assignee name is in the query
      for (const word of assigneeWords) {
        if (word.length > 2 && normalizedQuery.includes(word.toLowerCase())) {
          return tasks.filter(task => 
            task.assigned_to?.toLowerCase().includes(word.toLowerCase())
          );
        }
      }
    }
  }
  
  // Filter by due date
  else if (normalizedQuery.includes('due today')) {
    const today = new Date().setHours(0, 0, 0, 0);
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date).setHours(0, 0, 0, 0);
      return dueDate === today;
    });
  } else if (normalizedQuery.includes('due tomorrow')) {
    const today = new Date().setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date).setHours(0, 0, 0, 0);
      return dueDate === tomorrow.getTime();
    });
  } else if (normalizedQuery.includes('due this week')) {
    const today = new Date().setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date).setHours(0, 0, 0, 0);
      return dueDate >= today && dueDate <= nextWeek.getTime();
    });
  } else if (normalizedQuery.includes('overdue')) {
    return tasks.filter(task => {
      if (!task.due_date || task.status === 'completed') return false;
      return new Date(task.due_date) < new Date();
    });
  }
  
  // Generic search in title, description, and location
  else {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(normalizedQuery) ||
      (task.description && task.description.toLowerCase().includes(normalizedQuery)) ||
      (task.location && task.location.toLowerCase().includes(normalizedQuery))
    );
  }
  
  // If no specific filters matched but we got to this point
  return filteredResults;
}
