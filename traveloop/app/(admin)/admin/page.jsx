"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  MapPin, 
  Compass, 
  BarChart3, 
  Search, 
  Filter, 
  ArrowUpDown, 
  LayoutGrid,
  ChevronRight,
  TrendingUp,
  Activity,
  Calendar,
  AlertCircle,
  MoreVertical,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { 
  LineChart, Line, 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  Dot
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import PageTopBar from "@/components/shared/PageTopBar";

// --- Constants ---

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const TABS = [
  { id: "users", label: "Manage Users" },
  { id: "cities", label: "Popular cities" },
  { id: "activities", label: "Popular Activites" },
  { id: "analytics", label: "User Trends and Analytics" }
];

const SIDEBAR_DESCRIPTIONS = {
  users: {
    title: "Manage User Section:",
    text: "This Section is responsible for managing the users and their actions. This section will give the admin the access to view all the trips made by the user. Also other functionalities are welcome...."
  },
  cities: {
    title: "Popular cities:",
    text: "Lists all the popular cities where the users are visiting based on the current user trends."
  },
  activities: {
    title: "Popular Activites:",
    text: "List all the popular activites that the users are doing based on the current user trend data."
  },
  analytics: {
    title: "User trends and Analytics:",
    text: "This section will major focus on the providing analysis across various points and give useful information to the user."
  }
};

// --- Sub-components ---

const StatsCard = ({ label, value, icon: Icon, trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between group hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
  >
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
      <h3 className="text-2xl font-black italic tracking-tighter">{value}</h3>
      {trend && (
        <div className="flex items-center gap-1 text-[9px] font-bold text-green-500">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </div>
      )}
    </div>
    <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-blue-50 group-hover:bg-blue-500 group-hover:text-white transition-colors">
      <Icon className="h-6 w-6" />
    </div>
  </motion.div>
);

// --- Tab Contents ---

const ManageUsersTab = ({ externalSearch = "", externalGroup = "all" }) => {
  const [data, setData] = useState({ users: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?q=${externalSearch}&filter=${externalGroup}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [externalSearch, externalGroup]);

  const toggleAdmin = async (userId, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: !currentStatus })
      });
      if (res.ok) {
        toast.success("User role updated");
        fetchUsers();
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure? This will delete all user data!")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User deleted");
        fetchUsers();
      } else {
        const error = await res.json();
        toast.error(error.error || "Delete failed");
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      {/* Table Section */}
      <div className="bg-white border-2 border-black overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-black">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">User</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Trips</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Joined</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Role</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user, idx) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-100 flex items-center justify-center text-[10px] font-black uppercase overflow-hidden">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : user.username.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-tighter">{user.firstName} {user.lastName}</p>
                        <p className="text-[9px] font-bold text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold">{user._count.trips} trips</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleAdmin(user.id, user.isAdmin)}
                      className={`flex items-center gap-1.5 px-2 py-1 border-2 border-black text-[8px] font-black uppercase transition-all ${user.isAdmin ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                    >
                      {user.isAdmin ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                      {user.isAdmin ? "Admin" : "User"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => deleteUser(user.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-black p-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">User Acquisition (Last 8 Weeks)</h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{name: 'W1', val: 12}, {name: 'W2', val: 19}, {name: 'W3', val: 15}, {name: 'W4', val: 22}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} fontWeight="bold" />
                <YAxis fontSize={10} fontWeight="bold" />
                <Tooltip />
                <Bar dataKey="val" fill="#3B82F6" stroke="#000" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border-2 border-black p-6 flex flex-col items-center justify-center border-dashed">
          <Users className="h-12 w-12 text-gray-200 mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Activity map coming soon</p>
        </div>
      </div>
    </div>
  );
};

const PopularCitiesTab = () => {
  const [data, setData] = useState({ cities: [], regions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/cities/popular")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Top Left: Numbered List */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border-2 border-black p-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <MapPin className="h-3 w-3" /> Most Visited Cities
          </h4>
          <div className="space-y-4">
            {data.cities.map((city, idx) => (
              <div key={city.id} className="flex items-center gap-4">
                <span className="text-xl font-black italic text-gray-200 w-6">0{idx + 1}</span>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-tighter">{city.name}, {city.country}</span>
                    <span className="text-[10px] font-bold text-blue-600">{city.tripCount} trips</span>
                  </div>
                  <Progress value={(city.tripCount / (data.cities[0]?.tripCount || 1)) * 100} className="h-1.5 rounded-none border border-black bg-gray-50 [&>div]:bg-blue-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Right: Pie Chart */}
      <div className="lg:col-span-5">
        <div className="bg-white border-2 border-black p-6 h-full">
          <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">Regional Distribution</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.regions}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.regions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#000" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom: Bar Chart */}
      <div className="lg:col-span-12">
        <div className="bg-white border-2 border-black p-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">Popularity Comparison</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cities}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} fontWeight="bold" />
                <YAxis fontSize={10} fontWeight="bold" />
                <Tooltip />
                <Bar dataKey="tripCount" radius={[4, 4, 0, 0]} stroke="#000" strokeWidth={2}>
                  {data.cities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const PopularActivitiesTab = () => {
  const [data, setData] = useState({ activities: [], distribution: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/activities/popular")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Top Section */}
      <div className="lg:col-span-7">
        <div className="bg-white border-2 border-black p-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">Top Activities</h4>
          <div className="space-y-4">
            {data.activities.slice(0, 5).map((act, idx) => (
              <div key={act.id} className="flex items-center gap-4 group">
                <div className="w-10 h-10 border-2 border-black bg-gray-50 flex items-center justify-center font-black italic">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-black uppercase tracking-tighter">{act.name}</p>
                    <p className="text-[9px] font-bold text-gray-400">{act.timesAdded} times</p>
                  </div>
                  <p className="text-[9px] font-bold text-blue-500 uppercase">{act.city} • {act.type}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-black transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="bg-white border-2 border-black p-6 h-full">
          <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">Activities by Type</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.distribution}
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {data.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#000" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom: Detailed Table */}
      <div className="lg:col-span-12">
        <div className="bg-white border-2 border-black overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-black">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Activity</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Type</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Added</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-right">Avg Cost</th>
              </tr>
            </thead>
            <tbody>
              {data.activities.map((act) => (
                <tr key={act.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="text-xs font-black uppercase tracking-tighter">{act.name}</p>
                    <p className="text-[9px] font-bold text-gray-400">{act.city}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 uppercase">{act.type}</span>
                  </td>
                  <td className="p-4 font-bold text-xs">{act.timesAdded}</td>
                  <td className="p-4 text-right font-black italic text-xs">₹{act.avgCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AnalyticsTab = () => {
  const [data, setData] = useState({ dailyTrends: [], monthlyTrends: [], stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]">
          <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Avg Duration</p>
          <p className="text-2xl font-black italic">{data.stats.avgDuration} Days</p>
        </div>
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(16,185,129,1)]">
          <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Avg Budget</p>
          <p className="text-2xl font-black italic">₹{data.stats.avgBudget.toLocaleString()}</p>
        </div>
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(245,158,11,1)]">
          <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Top Destination</p>
          <p className="text-2xl font-black italic truncate">{data.stats.mostPopularCity}</p>
        </div>
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]">
          <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Peak Activity</p>
          <p className="text-2xl font-black italic truncate">{data.stats.mostPopularActivityType}</p>
        </div>
      </div>

      {/* Main Chart: Line Trend */}
      <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h4 className="text-[10px] font-black uppercase tracking-widest mb-8">Daily Trip Creation (Last 30 Days)</h4>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis 
                dataKey="date" 
                fontSize={9} 
                fontWeight="bold" 
                tickFormatter={(val) => val.split('-').slice(1).join('/')}
              />
              <YAxis fontSize={9} fontWeight="bold" />
              <Tooltip 
                contentStyle={{ border: '2px solid black', borderRadius: 0, fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#000" 
                strokeWidth={3} 
                dot={<Dot r={4} stroke="#000" strokeWidth={2} fill="#3B82F6" />}
                activeDot={{ r: 6, stroke: '#000', strokeWidth: 2, fill: '#fff' }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border-2 border-black p-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">Monthly Volume</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={10} fontWeight="bold" />
                <YAxis fontSize={10} fontWeight="bold" />
                <Tooltip />
                <Bar dataKey="count" fill="#F59E0B" stroke="#000" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-black text-white p-8 flex flex-col justify-center">
          <h4 className="text-xl font-black italic uppercase mb-4 text-blue-500">Insights Alpha</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
              <p className="text-xs font-bold leading-relaxed">Bookings are peaking on <span className="text-blue-500 underline">Weekends</span>, with a 24% increase compared to weekdays.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
              <p className="text-xs font-bold leading-relaxed">Users spend an average of <span className="text-blue-500 underline">₹2,400</span> per activity across top 5 cities.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
              <p className="text-xs font-bold leading-relaxed">The most requested feature in community comments is <span className="text-blue-500 underline">Offline Maps</span>.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGroupBy, setActiveGroupBy] = useState("all");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(json => {
        setStats(json);
        setLoading(false);
      });
  }, []);

  const description = SIDEBAR_DESCRIPTIONS[activeTab];

  return (
    <div className="w-full px-6 py-8 space-y-10 min-h-screen overflow-x-hidden">
      
      {/* Header & Navbar Mock */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-blue-500" />
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Admin <span className="text-gray-300">Control Center</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">System.Access_v2.0</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase">Last Sync: Just Now</p>
            </div>
            <div className="w-10 h-10 border-2 border-black rounded-full bg-gray-100 flex items-center justify-center font-black">A</div>
          </div>
        </div>

        {/* Search Bar - Reusing PageTopBar style */}
        <PageTopBar 
          searchPlaceholder="Global admin search ......"
          onSearch={setSearchQuery}
          groupByOptions={[
            {label: 'All Users', value: 'all'}, 
            {label: 'Admins Only', value: 'admins'},
            {label: 'Regular Users', value: 'regular'}
          ]}
          onGroupBy={setActiveGroupBy}
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-50 border-2 border-black animate-pulse" />
          ))
        ) : (
          <>
            <StatsCard label="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} trend="+12% this month" />
            <StatsCard label="New Users (Week)" value={stats.newUsersThisWeek.toLocaleString()} icon={TrendingUp} trend="Expanding" />
            <StatsCard label="Active Today" value={stats.activeToday.toLocaleString()} icon={Activity} trend="Live" />
            <StatsCard label="Total Trips" value={stats.totalTrips.toLocaleString()} icon={Compass} trend="+5.2k all-time" />
          </>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        <div className="flex-1 min-w-0 space-y-8">
          <div className="flex border-4 border-black p-1 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] py-3 text-[10px] font-black uppercase tracking-widest italic transition-all ${
                  activeTab === tab.id 
                    ? "bg-black text-white" 
                    : "text-black hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Card Content */}
          <div className="bg-gray-50/50 border-4 border-black p-8 min-h-[850px] w-full relative overflow-hidden">
            {/* Background Decorative Dots per wireframe style */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-200" />
              <div className="w-2 h-2 rounded-full bg-gray-200" />
              <div className="w-2 h-2 rounded-full bg-gray-200" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="pt-6"
              >
                {activeTab === "users" && <ManageUsersTab externalSearch={searchQuery} externalGroup={activeGroupBy} />}
                {activeTab === "cities" && <PopularCitiesTab />}
                {activeTab === "activities" && <PopularActivitiesTab />}
                {activeTab === "analytics" && <AnalyticsTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white border-4 border-black p-6 sticky top-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <h3 className="text-sm font-black uppercase italic tracking-tighter">Module Info</h3>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h4 className="text-xs font-black uppercase tracking-widest text-blue-500">
                  {description.title}
                </h4>
                <p className="text-[11px] font-bold text-gray-600 leading-relaxed italic">
                  {description.text}
                </p>
                <div className="pt-6 border-t-2 border-dashed border-gray-100">
                  <p className="text-[9px] font-black uppercase text-gray-400 mb-4 tracking-widest">Quick Actions</p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start text-[10px] font-black uppercase tracking-widest border-2 border-black rounded-none h-10 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
                      <BarChart3 className="h-3 w-3 mr-2" /> Export Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-[10px] font-black uppercase tracking-widest border-2 border-black rounded-none h-10 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
                      <Users className="h-3 w-3 mr-2" /> Bulk Notify
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
