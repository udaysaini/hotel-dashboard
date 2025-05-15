import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Call the Python agent API
    const response = await fetch('http://localhost:5000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ user_input: 1 }), // Query for top 10 tasks
      // body: JSON.stringify({ user_input: "Can you give top 10 tasks in JSON format, Append fourseasons schema name for each query? Return data should be in JSON serializable format in all case" }), // Query for top 10 tasks
      // body: JSON.stringify({ user_input: "Can you give top 10 tasks with fourseasons schema in JSON Object which contains json Array  without object name?" }), // Query for top 10 tasks    
      body: JSON.stringify({ user_input: "Give me all tasks that are pending. Output in json" }), // Query for top 10 tasks    
    });

    console.log("Agent API response status:", response.status);

    if (!response.ok) {
      throw new Error(`Agent API responded with status: ${response.status}`);
    }

    // Parse the agent's response as JSON
    const agentResponseText = await response.text();
    console.log("Agent API response text received.", agentResponseText, " ------------------------  \n\n\n ");
    // console.log();

    // The agent might return a JSON string in its response text
    // We need to parse that string to get the actual tasks data
    try {
      // Try to parse the entire response as JSON first

      // Extract the JSON part from the input
      const jsonString = extractJson(agentResponseText);
      let parsedData; // Declare parsedData outside the if block
      if (jsonString) {
        // Trim the JSON string to remove any leading or trailing whitespace
        parsedData = JSON.parse(jsonString.trim());
        console.log("Parsed agent response:", parsedData);
      } else {
        throw new Error("No valid JSON found in the input.");
      }
      // If successful, check if it's in the format we expect
      if (Array.isArray(parsedData)) {
        return NextResponse.json(parsedData);
      } else if (parsedData.data && Array.isArray(parsedData.data)) {
        const columns = parsedData.columns;
        const tasks = parsedData.data.map(row => {
          const task = {};
          columns.forEach((col, i) => {
            task[col] = row[i];
          });
          return task;
        });
        return NextResponse.json(tasks);
      } else {
        // If there's specific JSON within the text, we need to extract and parse it
        // This is a fallback approach
        console.log("Unexpected data structure, returning original response");
        return NextResponse.json(parsedData);
      }
    } catch (parseError) {
      console.error("Error parsing agent response:", parseError);

      // Fallback to the mock data if we can't parse the agent response
      return NextResponse.json(getMockTasks());
    }
  } catch (error) {
    console.error("Error fetching from agent API:", error);

    // If the agent API is unavailable, use the mock data
    return NextResponse.json(getMockTasks());
  }
}

// Function to extract valid JSON from the input string
function extractJson(input) {
  try {
    // Attempt to find and parse the first valid JSON object or array
    const startIndex = input.indexOf('{');
    const endIndex = input.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
      const jsonString = input.substring(startIndex, endIndex + 1);
      return JSON.parse(jsonString); // Parse and return the JSON object
    }
  } catch (error) {
    console.error("Error extracting JSON:", error);
  }
  return null; // Return null if no valid JSON is found
}

function getMockTasks() {
  // Get date references for last week, today, and next week
  const today = new Date();

  // Format a date to ISO string with time
  const formatDate = (date) => {
    return date.toISOString().split('.')[0]; // Remove milliseconds
  };

  function getTimeForToday(hour, minute = 0) {
    // Create a date for today
    const date = new Date();
    
    // Get timezone offset in minutes
    const tzOffset = date.getTimezoneOffset();
    
    // Set the date to today with the specified local time
    date.setHours(hour, minute, 0, 0);
    
    // Adjust for timezone to ensure the time is interpreted as local time
    // We need to subtract the offset because getTimezoneOffset returns minutes WEST of UTC
    const adjustedDate = new Date(date.getTime() - tzOffset * 60000);
    
    // Format as ISO string without milliseconds
    const formattedDate = adjustedDate.toISOString().split('.')[0];
    
    console.log(`Formatted date for ${hour}:${minute === 0 ? '00' : minute}: ${formattedDate}`);
    return formattedDate;
  }

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
    // GUEST JOURNEY 1: David Chen - Business Traveler
    {
      id: 1,
      title: 'VIP Pre-arrival: David Chen',
      description: 'Prepare for arrival of business guest David Chen. Set up premium WiFi access, arrange airport transfer.',
      assigned_to: 'Jane Smith',
      assigned_to_id: 2,
      status: 'completed',
      priority: 'high',
      location: 'Front Desk',
      due_date: fiveDaysAgo,
      department: 'Front Desk',
      guest_id: 'G001'
    },
    {
      id: 2,
      title: 'Check-in: David Chen',
      description: 'Business guest arriving for 3-night stay. Express check-in requested. Prefers high floor room.',
      assigned_to: 'Jane Smith',
      assigned_to_id: 2,
      status: 'completed',
      priority: 'high',
      location: 'Lobby',
      due_date: fourDaysAgo,
      department: 'Front Desk',
      guest_id: 'G001'
    },
    {
      id: 3,
      title: 'Prepare Room 505 for David Chen',
      description: 'VIP business setup: extra power outlets, desk organizer, premium stationery, and quiet floor.',
      assigned_to: 'Alice Johnson',
      assigned_to_id: 3,
      status: 'completed',
      priority: 'high',
      location: 'Room 505',
      due_date: fourDaysAgo,
      department: 'Housekeeping',
      guest_id: 'G001'
    },
    {
      id: 4,
      title: 'Business Center Reservation: David Chen',
      description: 'Set up private meeting room in business center from 2-4pm for client meeting.',
      assigned_to: 'Hannah Lopez',
      assigned_to_id: 10,
      status: 'completed',
      priority: 'medium',
      location: 'Business Center',
      due_date: threeDaysAgo,
      department: 'Events',
      guest_id: 'G001'
    },
    {
      id: 5,
      title: 'In-room Dining: David Chen',
      description: 'Deliver breakfast to Room 505 at 6:30am. Low-carb option requested.',
      assigned_to: 'Charlie Davis',
      assigned_to_id: 5,
      status: 'completed',
      priority: 'medium',
      location: 'Room 505',
      due_date: threeDaysAgo,
      department: 'Kitchen',
      guest_id: 'G001'
    },
    {
      id: 6,
      title: 'Dry Cleaning: David Chen',
      description: 'Rush dry cleaning for business suit. Required by 5pm today for evening meeting.',
      assigned_to: 'Alice Johnson',
      assigned_to_id: 3,
      status: 'completed',
      priority: 'high',
      location: 'Laundry',
      due_date: twoDaysAgo,
      department: 'Housekeeping',
      guest_id: 'G001'
    },
    {
      id: 7,
      title: 'Tech Support: David Chen',
      description: 'Guest in 505 reporting issues with video conferencing setup. Assistance needed ASAP.',
      assigned_to: 'Bob Brown',
      assigned_to_id: 4,
      status: 'completed',
      priority: 'high',
      location: 'Room 505',
      due_date: twoDaysAgo,
      department: 'Maintenance',
      guest_id: 'G001'
    },
    {
      id: 8,
      title: 'Express Checkout: David Chen',
      description: 'Prepare express checkout paperwork. Send invoice to company email. Car service at 8am.',
      assigned_to: 'Jane Smith',
      assigned_to_id: 2,
      status: 'pending',
      priority: 'medium',
      location: 'Front Desk',
      due_date: tomorrow,
      department: 'Front Desk',
      guest_id: 'G001'
    },

    // GUEST JOURNEY 2: Michael & Sophia Rodriguez - Anniversary Couple
    {
      id: 9,
      title: 'Anniversary Package: Rodriguez',
      description: 'Set up anniversary package for Rodriguez couple: champagne, roses, and personalized welcome card.',
      assigned_to: 'Jane Smith',
      assigned_to_id: 2,
      status: 'completed',
      priority: 'high',
      location: 'Front Desk',
      due_date: threeDaysAgo,
      department: 'Front Desk',
      guest_id: 'G002'
    },
    {
      id: 10,
      title: 'Room Decoration: Rodriguez',
      description: 'Decorate Room 302 with rose petals, set up anniversary banner and decorative lighting.',
      assigned_to: 'Alice Johnson',
      assigned_to_id: 3,
      status: 'completed',
      priority: 'medium',
      location: 'Room 302',
      due_date: threeDaysAgo,
      department: 'Housekeeping',
      guest_id: 'G002'
    },
    {
      id: 11,
      title: 'Couples Spa Appointment: Rodriguez',
      description: 'Confirm couples massage for Rodriguez anniversary package at 3pm in the spa.',
      assigned_to: 'Fiona Wilson',
      assigned_to_id: 8,
      status: 'completed',
      priority: 'medium',
      location: 'Spa',
      due_date: twoDaysAgo,
      department: 'Spa',
      guest_id: 'G002'
    },
    {
      id: 12,
      title: 'Special Dinner: Rodriguez',
      description: 'Set up private candlelight dinner on ocean terrace. Anniversary menu with wine pairing.',
      assigned_to: 'Charlie Davis',
      assigned_to_id: 5,
      status: 'in_progress',
      priority: 'high',
      location: 'Restaurant',
      due_date: todayDate,
      department: 'Kitchen',
      guest_id: 'G002'
    },
    {
      id: 13,
      title: 'Photography Session: Rodriguez',
      description: 'Arrange for photographer to capture anniversary moments during dinner. 7-8pm.',
      assigned_to: 'Hannah Lopez',
      assigned_to_id: 10,
      status: 'pending',
      priority: 'medium',
      location: 'Ocean Terrace',
      due_date: todayDate,
      department: 'Events',
      guest_id: 'G002'
    },
    {
      id: 14,
      title: 'Romantic Turndown: Rodriguez',
      description: 'Special turndown service with chocolate truffles, mood lighting, and soft music setup.',
      assigned_to: 'Alice Johnson',
      assigned_to_id: 3,
      status: 'pending',
      priority: 'medium',
      location: 'Room 302',
      due_date: todayDate,
      department: 'Housekeeping',
      guest_id: 'G002'
    },
    {
      id: 15,
      title: 'Yacht Excursion: Rodriguez',
      description: 'Confirm private sunset yacht booking. Champagne and canapés to be prepared.',
      assigned_to: 'Hannah Lopez',
      assigned_to_id: 10,
      status: 'pending',
      priority: 'high',
      location: 'Marina',
      due_date: tomorrow,
      department: 'Events',
      guest_id: 'G002'
    },
    {
      id: 16,
      title: 'Late Checkout: Rodriguez',
      description: 'Arrange late checkout (2pm) for Rodriguez couple as part of anniversary package.',
      assigned_to: 'Jane Smith',
      assigned_to_id: 2,
      status: 'pending',
      priority: 'low',
      location: 'Front Desk',
      due_date: threeDaysFromNow,
      department: 'Front Desk',
      guest_id: 'G002'
    },

    // GUEST JOURNEY 3: Johnson Family with Children
    {
      id: 17,
      title: 'Family Check-in: Johnson Family',
      description: 'Welcome Johnson family with 2 children (ages 5 & 8). Kids welcome packs ready.',
      assigned_to: 'Jane Smith',
      assigned_to_id: 2,
      status: 'completed',
      priority: 'medium',
      location: 'Lobby',
      due_date: yesterday,
      department: 'Front Desk',
      guest_id: 'G003'
    },
    {
      id: 18,
      title: 'Kids Club Registration: Johnson Children',
      description: 'Register Johnson children for Kids Club activities. Allergy note: Alex (8) has peanut allergy.',
      assigned_to: 'Diane Miller',
      assigned_to_id: 6,
      status: 'completed',
      priority: 'medium',
      location: 'Kids Club',
      due_date: yesterday,
      department: 'Recreation',
      guest_id: 'G003'
    },
    {
      id: 19,
      title: 'Family Suite Setup: Johnson Family',
      description: 'Prepare connecting rooms 410-412 with extra rollaway bed, child-proofing, and kids amenities.',
      assigned_to: 'Alice Johnson',
      assigned_to_id: 3,
      status: 'completed',
      priority: 'high',
      location: 'Rooms 410-412',
      due_date: yesterday,
      department: 'Housekeeping',
      guest_id: 'G003'
    },
    {
      id: 20,
      title: 'Pool Safety Briefing: Johnson Family',
      description: 'Conduct family pool safety orientation. Provide kids with appropriate flotation devices.',
      assigned_to: 'George Hernandez',
      assigned_to_id: 9,
      status: 'in_progress',
      priority: 'high',
      location: 'Pool Deck',
      due_date: todayDate,
      department: 'Security',
      guest_id: 'G003'
    },
    {
      id: 21,
      title: 'Children\'s Cooking Class: Johnson Kids',
      description: 'Set up pizza making class for Johnson children at 3pm in the demonstration kitchen.',
      assigned_to: 'Charlie Davis',
      assigned_to_id: 5,
      status: 'pending',
      priority: 'medium',
      location: 'Kitchen',
      due_date: getTimeForToday(15, 0), // 3:00PM Today
      department: 'Kitchen',
      guest_id: 'G003'
    },
    {
      id: 22,
      title: 'Family Movie Night: Johnson Family',
      description: 'Arrange outdoor movie setup with family-friendly film, popcorn, and blankets.',
      assigned_to: 'Hannah Lopez',
      assigned_to_id: 10,
      status: 'pending',
      priority: 'low',
      location: 'Garden Terrace',
      due_date: tomorrow,
      department: 'Events',
      guest_id: 'G003'
    },
    {
      id: 23,
      title: 'Family Excursion: Johnson Family',
      description: 'Book family dolphin watching tour. Prepare packed lunch for 4 people. Pickup at 9am.',
      assigned_to: 'Diane Miller',
      assigned_to_id: 6,
      status: 'pending',
      priority: 'medium',
      location: 'Tour Desk',
      due_date: threeDaysFromNow,
      department: 'Recreation',
      guest_id: 'G003'
    },
    {
      id: 24,
      title: 'Babysitting Service: Johnson Family',
      description: 'Arrange certified babysitter for Johnson children from 7-10pm for parents\' date night.',
      assigned_to: 'Diane Miller',
      assigned_to_id: 6,
      status: 'pending',
      priority: 'high',
      location: 'Rooms 410-412',
      due_date: fourDaysFromNow,
      department: 'Recreation',
      guest_id: 'G003'
    },

    // STANDARD OPERATIONAL TASKS
    {
      id: 25,
      title: 'Clean Room 101',
      description: 'Deep clean the room and change linens',
      assigned_to: 'Alice Johnson',
      assigned_to_id: 3,
      status: 'pending',
      priority: 'medium',
      location: 'Room 101',
      due_date: getTimeForToday(12, 0), // 12:00 PM Today
      department: 'Housekeeping'
    },
    {
      id: 26,
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
      id: 27,
      title: 'Update Weekly Menu',
      description: 'Create a new menu for next week\'s dinner service',
      assigned_to: 'Charlie Davis',
      assigned_to_id: 5,
      status: 'in_progress',
      priority: 'medium',
      location: 'Kitchen',
      due_date: fiveDaysFromNow,
      department: 'Kitchen'
    },
    {
      id: 28,
      title: 'Staff Training',
      description: 'Conduct emergency response training for new employees',
      assigned_to: 'George Hernandez',
      assigned_to_id: 9,
      status: 'pending',
      priority: 'high',
      location: 'Training Room',
      due_date: sixDaysFromNow,
      department: 'Security'
    },
    {
      id: 29,
      title: 'Inventory Check',
      description: 'Monthly inventory audit of kitchen supplies and equipment',
      assigned_to: 'Charlie Davis',
      assigned_to_id: 5,
      status: 'pending',
      priority: 'medium',
      location: 'Storage Room',
      due_date: fiveDaysFromNow,
      department: 'Kitchen'
    },
    {
      id: 30,
      title: 'Update Guest Records',
      description: 'Ensure all guest information is current in the system',
      assigned_to: 'Jane Smith',
      assigned_to_id: 2,
      status: 'pending',
      priority: 'medium',
      location: 'Front Desk',
      due_date: fourDaysFromNow,
      department: 'Front Desk'
    },
    // Add this to the tasks array in getMockTasks function
    {
      id: 31,
      title: 'Birthday Cake Delivery',
      description: 'Deliver birthday cake to Room 303 at 9 PM for guest Sarah Williams.',
      assigned_to: 'Charlie Davis',
      assigned_to_id: 5,
      status: 'pending',
      priority: 'medium',
      location: 'Room 303',
      due_date: getTimeForToday(21, 0), // 9:00 PM Today
      department: 'Kitchen',
      guest_id: 'G004'
    }
  ];

  return tasks;
}
