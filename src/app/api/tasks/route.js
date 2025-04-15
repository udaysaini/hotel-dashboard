import { NextResponse } from 'next/server';

export async function GET() {
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
      due_date: '2025-10-15T18:00:00',
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
      due_date: '2023-10-16T15:00:00',
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
      due_date: '2023-10-14T17:00:00',
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
      due_date: '2023-10-20T09:00:00',
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
      due_date: '2023-10-18T12:00:00',
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
      due_date: '2023-10-14T15:00:00',
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
      due_date: '2023-10-14T20:00:00',
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
      due_date: '2023-10-22T10:00:00',
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
      due_date: '2023-10-15T17:00:00',
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
      due_date: '2025-04-14T16:00:00',
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
      due_date: '2025-04-14T16:00:00',
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
      due_date: '2025-04-14T16:00:00',
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
      due_date: '2025-04-14T16:00:00',
      department: 'Events'
    },
  ];

  return NextResponse.json(tasks);
}
