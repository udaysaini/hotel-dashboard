'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, ORDER_STATUS_COLORS } from '../utils'
import { 
  Coffee, 
  Search, 
  Filter,
  ShoppingBag,
  CheckCircle2,
  Clock,
  MoreVertical,
  BedDouble
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  
  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setFilteredOrders(data)
      })
  }, [])
  
  // Handle filter change
  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status.toLowerCase() === filterStatus.toLowerCase()));
    }
  }, [filterStatus, orders]);

  // Count by status
  const pendingCount = orders.filter(order => order.status === 'Pending').length;
  const completedCount = orders.filter(order => order.status === 'Completed').length;
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Guest Orders</h1>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-[200px]"
            />
          </div>
          <Button variant="outline" className="border-zinc-800 text-zinc-400">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 mb-1 text-sm">Total Orders</p>
                <h2 className="text-3xl font-bold">{orders.length}</h2>
              </div>
              <div className="p-3 bg-indigo-500/20 rounded-full">
                <ShoppingBag className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 mb-1 text-sm">Pending</p>
                <h2 className="text-3xl font-bold">{pendingCount}</h2>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 mb-1 text-sm">Completed</p>
                <h2 className="text-3xl font-bold">{completedCount}</h2>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex border-b border-zinc-800 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 font-medium text-sm relative ${
            filterStatus === 'all' 
              ? 'text-white' 
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          All Orders
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
          Pending
          {filterStatus === 'pending' && (
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
          Completed
          {filterStatus === 'completed' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></span>
          )}
        </button>
      </div>
      
      {/* Orders Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-900">
                <TableHead className="text-zinc-400">Order ID</TableHead>
                <TableHead className="text-zinc-400">Guest</TableHead>
                <TableHead className="text-zinc-400">Room</TableHead>
                <TableHead className="text-zinc-400">Details</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Time</TableHead>
                <TableHead className="text-zinc-400 w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.order_id} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell className="font-medium">{order.order_id}</TableCell>
                  <TableCell>{order.guest_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <BedDouble className="h-3.5 w-3.5 mr-1 text-zinc-500" />
                      {order.room_number}
                    </div>
                  </TableCell>
                  <TableCell>{order.order_details}</TableCell>
                  <TableCell>
                    <Badge className={ORDER_STATUS_COLORS[order.status] || 'bg-zinc-600'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400 text-sm">
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              No orders found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
