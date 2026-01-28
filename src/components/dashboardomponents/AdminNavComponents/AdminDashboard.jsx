import React, { useState } from 'react';
import { Users, Home, ClipboardList, MessageSquare, TrendingUp, AlertCircle, CheckCircle, Clock, Search, Filter, ChevronDown } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const stats = {
    totalPGs: 180,
    totalAMs: 6,
    totalOMs: 2,
    pendingBookings: 12,
    activeTenants: 450,
    pendingIssues: 8
  };

  const bookingRequests = [
    { id: 1, tenant: 'Rahul Sharma', pg: 'Green Valley PG', room: '2B', date: '2026-01-08', status: 'pending' },
    { id: 2, tenant: 'Priya Singh', pg: 'Sunrise Apartments', room: '4A', date: '2026-01-09', status: 'pending' },
    { id: 3, tenant: 'Amit Kumar', pg: 'City Center PG', room: '1C', date: '2026-01-10', status: 'approved' }
  ];

  const areaManagers = [
    { id: 1, name: 'Vikram Patel', pgsManaged: 30, contact: '+91 98765 43210', activeIssues: 2, om: 'Neha Gupta' },
    { id: 2, name: 'Anjali Desai', pgsManaged: 30, contact: '+91 98765 43211', activeIssues: 1, om: 'Neha Gupta' },
    { id: 3, name: 'Rajesh Verma', pgsManaged: 30, contact: '+91 98765 43212', activeIssues: 0, om: 'Arjun Mehta' }
  ];

  const operationsManagers = [
    { id: 1, name: 'Neha Gupta', amsManaged: 3, totalPGs: 90, contact: '+91 98765 43220' },
    { id: 2, name: 'Arjun Mehta', amsManaged: 3, totalPGs: 90, contact: '+91 98765 43221' }
  ];

  const tenantIssues = [
    { id: 1, tenant: 'Suresh Reddy', pg: 'Lake View PG', type: 'Maintenance', issue: 'AC not working', priority: 'high', date: '2026-01-09', am: 'Vikram Patel' },
    { id: 2, tenant: 'Kavita Menon', pg: 'Park Street PG', type: 'Query', issue: 'Payment receipt needed', priority: 'low', date: '2026-01-10', am: 'Anjali Desai' }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Zimer Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Saturday, January 10, 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard icon={Home} title="Total PGs" value={stats.totalPGs} color="#3B82F6" />
          <StatCard icon={Users} title="Area Managers" value={stats.totalAMs} subtitle={`${stats.totalOMs} Operations Managers`} color="#10B981" />
          <StatCard icon={ClipboardList} title="Pending Bookings" value={stats.pendingBookings} color="#F59E0B" />
          <StatCard icon={AlertCircle} title="Pending Issues" value={stats.pendingIssues} subtitle={`${stats.activeTenants} Active Tenants`} color="#EF4444" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {['overview', 'bookings', 'managers', 'issues'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Booking Requests Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Booking Requests</h2>
                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                    <Filter size={16} />
                    Filter
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PG Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {bookingRequests.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{booking.tenant}</td>
                          <td className="px-4 py-3 text-sm">{booking.pg}</td>
                          <td className="px-4 py-3 text-sm">{booking.room}</td>
                          <td className="px-4 py-3 text-sm">{booking.date}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {booking.status === 'pending' ? <Clock size={12} className="mr-1" /> : <CheckCircle size={12} className="mr-1" />}
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {booking.status === 'pending' && (
                              <div className="flex gap-2">
                                <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">Approve</button>
                                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">Reject</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Managers Tab */}
            {activeTab === 'managers' && (
              <div className="space-y-6">
                {/* Operations Managers */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Operations Managers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {operationsManagers.map((om) => (
                      <div key={om.id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{om.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{om.contact}</p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700">
                            <ChevronDown size={20} />
                          </button>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Area Managers</p>
                            <p className="text-xl font-bold">{om.amsManaged}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total PGs</p>
                            <p className="text-xl font-bold">{om.totalPGs}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Area Managers */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Area Managers</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PGs Managed</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operations Manager</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active Issues</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {areaManagers.map((am) => (
                          <tr key={am.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">{am.name}</td>
                            <td className="px-4 py-3 text-sm">{am.contact}</td>
                            <td className="px-4 py-3 text-sm">{am.pgsManaged}</td>
                            <td className="px-4 py-3 text-sm">{am.om}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                am.activeIssues === 0 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                              }`}>
                                {am.activeIssues}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">View PGs</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Issues Tab */}
            {activeTab === 'issues' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Tenant Issues & Queries</h2>
                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                    <Filter size={16} />
                    Filter
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PG Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area Manager</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {tenantIssues.map((issue) => (
                        <tr key={issue.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{issue.tenant}</td>
                          <td className="px-4 py-3 text-sm">{issue.pg}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {issue.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{issue.issue}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              issue.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {issue.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{issue.am}</td>
                          <td className="px-4 py-3 text-sm">{issue.date}</td>
                          <td className="px-4 py-3 text-sm">
                            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Bookings */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <ClipboardList size={20} />
                      Recent Booking Requests
                    </h3>
                    <div className="space-y-3">
                      {bookingRequests.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-sm">{booking.tenant}</p>
                            <p className="text-xs text-gray-500">{booking.pg}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Issues */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <MessageSquare size={20} />
                      Recent Issues
                    </h3>
                    <div className="space-y-3">
                      {tenantIssues.map((issue) => (
                        <div key={issue.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-sm">{issue.tenant}</p>
                            <p className="text-xs text-gray-500">{issue.issue}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            issue.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {issue.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance Overview */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={20} />
                    Performance Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Occupancy Rate</p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">87%</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Payment Collection</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">94%</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Issue Resolution</p>
                      <p className="text-2xl font-bold text-purple-600 mt-1">91%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;