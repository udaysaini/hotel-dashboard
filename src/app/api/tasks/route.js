export async function GET() {
    return Response.json([
        {
            id: "1",
            title: "Clean Room 101",
            status: "pending",
            priority: "high",
            assigned_to: "Aman"
        },
        {
            id: "2",
            title: "Check-in Setup - Room 205",
            status: "in_progress",
            priority: "low",
            assigned_to: "Emily"
        },
        {
            id: "3",
            title: "Refill minibar - Room 202",
            status: "completed",
            priority: "medium",
            assigned_to: "Raj"
        },
        { id: "4", title: "Replace towels - Room 107", status: "pending", priority: "medium", assigned_to: "Priya" },
        { id: "5", title: "Check AC - Room 303", status: "in_progress", priority: "high", assigned_to: "Ali" },
        { id: "6", title: "Deliver luggage - Lobby", status: "pending", priority: "low", assigned_to: "John" },
        { id: "7", title: "Sanitize bathroom - Room 404", status: "completed", priority: "medium", assigned_to: "Nina" },
        { id: "8", title: "Refill minibar - Room 110", status: "pending", priority: "high", assigned_to: "Chris" },
        { id: "9", title: "Setup breakfast trays - 6th floor", status: "in_progress", priority: "low", assigned_to: "Tina" },
        { id: "10", title: "Clean hallway - East Wing", status: "completed", priority: "high", assigned_to: "Rahul" }
    ]);
}
