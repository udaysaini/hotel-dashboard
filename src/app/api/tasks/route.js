import { NextResponse } from 'next/server';

export async function GET() {
  // Get date references for last week, today, and next week
  const today = new Date();
  
  // Format a date to ISO string with time
  const formatDate = (date) => {
    return date.toISOString().split('.')[0]; // Remove milliseconds
  };
  
  // Helper to get a date with an offset from today
  const getOffsetDate = (dayOffset, hourOffset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    date.setHours(date.getHours() + hourOffset);
    return formatDate(date);
  };

  // Get dates for various offsets
  const yesterday = getOffsetDate(-1);
  const todayDate = getOffsetDate(0, 3); // 3 hours from now
  const tomorrow = getOffsetDate(1);
  const twoDaysAgo = getOffsetDate(-2);
  const threeDaysAgo = getOffsetDate(-3);
  const fourDaysAgo = getOffsetDate(-4);
  const fiveDaysAgo = getOffsetDate(-5);
  const threeDaysFromNow = getOffsetDate(3);
  const fourDaysFromNow = getOffsetDate(4);
  const fiveDaysFromNow = getOffsetDate(5);
  const sixDaysFromNow = getOffsetDate(6);

  // Simulating database data
  const tasks = [
    {
      id: 1,
      title: 'Clean Room 101',
      description: 'Deep clean the room and change linens',
      assigned_to: 'Alice Johnson',
      assigned_to_id: 3,
      status: 'pending',
      priority: 'medium',
      location: 'Room 101',
      due_date: todayDate,
      department: 'Housekeeping'
    },
    {
      id: 2,
      title: 'Fix AC in Room 202',
      description: 'Repair the air conditioning unit',
      assigned_to: 'Bob Brown',
      assigned_to_id: 4,
      status: 'in_progress',
      priority: 'low',
      location: 'Room 202',
      due_date: tomorrow,
      department: 'Maintenance'
    },
    {
      id: 3,
      title: 'Prepare Dinner Menu',
      description: 'Create a new menu for dinner service',
      assigned_to: 'Charlie Davis',
      assigned_to_id: 5,
      status: 'completed',
      priority: 'medium',
      location: 'Kitchen',
      due_date: yesterday,
      department: 'Kitchen'
    },
    {
      id: 4,
      title: 'Set Up Event in Hall A',
      description: 'Arrange seating and decorations for the event',
      assigned_to: 'Hannah Lopez',
      assigned_to_id: 10,
      status: 'pending',
      priority: 'high',
      location: 'Hall A',
      due_date: threeDaysFromNow,
      department: 'Events'
    },
    {
      id: 5,
      title: 'Check Inventory',
      description: 'Review stock levels for kitchen supplies',
      assigned_to: 'Charlie Davis',
      assigned_to_id: 5,
      status: 'in_progress',
      priority: 'medium',
      location: 'Storage Room',
      due_date: tomorrow,
      department: 'Kitchen'
    },
    {
      id: 6,
      title: 'Greet Guests at Check-In',
      description: 'Welcome guests and assist with check-in',
      assigned_to: 'Jane Smith',
      assigned_to_id: 2,
      status: 'pending',
      priority: 'high',
      location: 'Lobby',
      due_date: yesterday, // Already overdue
      department: 'Front Desk'
    },
    {
      id: 7,
      title: 'Serve Drinks at Bar',
      description: 'Prepare and serve drinks to guests',
      assigned_to: 'Ethan Martinez',
      assigned_to_id: 7,
      status: 'in_progress',
      priority: 'medium',
      location: 'Bar',
      due_date: todayDate,
      department: 'Dining'
    },
    {
      id: 8,
      title: 'Conduct Fire Drill',
      description: 'Organize and execute a fire drill for staff',
      assigned_to: 'George Hernandez',
      assigned_to_id: 9,
      status: 'completed',
      priority: 'low',
      location: 'All Areas',
      due_date: fourDaysFromNow,
      department: 'Security'
    },
    {
      id: 9,
      title: 'Update Guest Records',
      description: 'Ensure all guest information is current in the system',
      assigned_to: 'Jane Smith',
      assigned_to_id: 2,
      status: 'pending',
      priority: 'medium',
      location: 'Front Desk',
      due_date: todayDate,
      department: 'Front Desk'
    },
    {
      id: 10,
      title: 'Assist with Lost & Found',
      description: 'Help guests with lost items and maintain the lost and found log',
      assigned_to: 'George Hernandez',
      assigned_to_id: 9,
      status: 'in_progress',
      priority: 'medium',
      location: 'Security Office',
      due_date: fiveDaysFromNow,
      department: 'Security'
    },
    {
      id: 11,
      title: 'Employee Training',
      description: 'Help new batch of Employees with facility tour and training',
      assigned_to: 'George Hernandez',
      assigned_to_id: 9,
      status: 'in_progress',
      priority: 'medium',
      location: 'Training Room',
      due_date: sixDaysFromNow,
      department: 'Security'
    },
    {
      id: 12,
      title: 'Finalize Event Schedule',
      description: 'Confirm timings and details for upcoming events',
      assigned_to: 'Jane Smith',
      assigned_to_id: 2,
      status: 'pending',
      priority: 'high',
      location: 'Event Hall',
      due_date: twoDaysAgo, // Already overdue
      department: 'Events'
    },
    {
      id: 13,
      title: 'Finalize Event Catering',
      description: 'Confirm catering details for upcoming events',
      assigned_to: 'Jane Smith',
      assigned_to_id: 2,
      status: 'pending',
      priority: 'high',
      location: 'Kitchen',
      due_date: threeDaysAgo, // Already overdue
      department: 'Events'
    },
  ];

  return NextResponse.json(tasks);
}
