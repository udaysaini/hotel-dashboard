import { NextResponse } from 'next/server';

export async function GET() {
  // Simulating database data
  const occupancyData = [
    {
      occupancy_id: 1,
      date: '2023-10-14',
      occupancy_number: 80,
      capacity: 100,
      percentage: 80.0
    },
    {
      occupancy_id: 2,
      date: '2023-10-15',
      occupancy_number: 85,
      capacity: 100,
      percentage: 85.0
    },
    {
      occupancy_id: 3,
      date: '2023-10-16',
      occupancy_number: 90,
      capacity: 100,
      percentage: 90.0
    },
    {
      occupancy_id: 4,
      date: '2023-10-17',
      occupancy_number: 75,
      capacity: 100,
      percentage: 75.0
    },
    {
      occupancy_id: 5,
      date: '2023-10-18',
      occupancy_number: 70,
      capacity: 100,
      percentage: 70.0
    },
    {
      occupancy_id: 6,
      date: '2023-10-19',
      occupancy_number: 95,
      capacity: 100,
      percentage: 95.0
    },
    {
      occupancy_id: 7,
      date: '2023-10-20',
      occupancy_number: 100,
      capacity: 100,
      percentage: 100.0
    }
  ];

  return NextResponse.json(occupancyData);
}
