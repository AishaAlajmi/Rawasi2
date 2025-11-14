import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3,
  Bell,
  Briefcase,
  Calendar,
  ChevronRight,
  DollarSign,
  Eye,
  FileText,
  FolderOpen,
  Home,
  MapPin,
  MessageSquare,
  Search,
  TrendingUp,
  User,
  Users,
  Menu
} from 'lucide-react';

export default function ProviderDashboards() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const projects = [
    {
      id: 1,
      title: 'Modern Villa Construction',
      client: 'Mohammed Al-Rashid',
      location: 'Riyadh',
      budget: '2,500,000',
      startDate: '2024-01-15',
      endDate: '2024-12-30',
      status: 'active',
      progress: 65,
      team: 12,
      category: 'Residential'
    },
    {
      id: 2,
      title: 'Commercial Plaza Development',
      client: 'Al-Noor Group',
      location: 'Jeddah',
      budget: '8,750,000',
      startDate: '2024-02-01',
      endDate: '2025-06-30',
      status: 'active',
      progress: 42,
      team: 28,
      category: 'Commercial'
    },
    {
      id: 3,
      title: 'School Building Renovation',
      client: 'Ministry of Education',
      location: 'Dammam',
      budget: '1,200,000',
      startDate: '2023-09-01',
      endDate: '2024-03-15',
      status: 'completed',
      progress: 100,
      team: 8,
      category: 'Educational'
    },
    {
      id: 4,
      title: 'Luxury Apartment Complex',
      client: 'Urban Developers',
      location: 'Riyadh',
      budget: '15,000,000',
      startDate: '2024-03-01',
      endDate: '2026-02-28',
      status: 'planning',
      progress: 15,
      team: 0,
      category: 'Residential'
    },
    {
      id: 5,
      title: 'Hospital Wing Extension',
      client: 'Health Ministry',
      location: 'Medina',
      budget: '12,300,000',
      startDate: '2024-01-20',
      endDate: '2025-08-15',
      status: 'active',
      progress: 38,
      team: 56,
      category: 'Healthcare'
    },
    {
      id: 6,
      title: 'Warehouse & Logistics Center',
      client: 'Saudi Logistics Co.',
      location: 'Khobar',
      budget: '5,800,000',
      startDate: '2024-02-15',
      endDate: '2024-11-30',
      status: 'active',
      progress: 55,
      team: 32,
      category: 'Industrial'
    }
  ];

  const stats = [
    { 
      label: 'Total Dashboards', 
      value: projects.length,
      trend: '+1 this month',
      trendUp: true
    },
    { 
      label: 'Active', 
      value: projects.filter(p => p.status === 'active').length,
      trend: '+2 from last',
      trendUp: true
    },
    { 
      label: 'Completed', 
      value: projects.filter(p => p.status === 'completed').length,
      trend: '+1 this month',
      trendUp: true
    },
    { 
      label: 'Planning', 
      value: projects.filter(p => p.status === 'planning').length,
      trend: 'Same as last',
      trendUp: false
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleOpenDashboard = (projectId) => {
    navigate(`/provider/dashboard?project=${projectId}`);
  };

const navItems = [
  { label: "Overview",   icon: Home,      to: "/provider/dashboard" },
  { label: "Dashboards", icon: Briefcase, badge: 4, to: "/provider/dashboards" },
  { label: "Requests",   icon: FolderOpen, badge: 3, to: "/provider/requests" },
  { label: "Messages",   icon: MessageSquare, badge: 2, to: "/provider/messages" },
  { label: "Reports",    icon: BarChart3, to: "/provider/reports" },
  { label: "Profile",    icon: User,      to: "/provider/profile" }
];
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50/20">
      {/* Left Sidebar */}
   <aside
  className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-white transition-all duration-300 z-50 ${
    sidebarOpen ? 'w-64' : 'w-20'
  }`}
>
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <img 
               src="/photo_2025-08-13_21-03-51.png" 
              alt="Rawasi" 
              className="w-10 h-10 rounded-xl shadow-lg"
            />
            {sidebarOpen && (
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  RAWASI
                </div>
                <div className="text-xs text-orange-400 font-medium -mt-0.5">Provider Portal</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
  {navItems.map((item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.to;

    return (
      <Link
        key={item.to}
        to={item.to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
          isActive
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/50'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {sidebarOpen && (
          <>
            <span className="font-medium">{item.label}</span>

            {item.badge && (
              <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  })}
</nav>


        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 bg-slate-800 text-white p-1.5 rounded-full shadow-lg hover:bg-slate-700 transition-all"
        >
          {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* User Profile */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 cursor-pointer transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg">
                AM
              </div>
              <div>
                <p className="text-sm font-medium text-white">Ahmad Mohammed</p>
                <p className="text-xs text-slate-400">Provider</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Project Dashboards</h1>
                <p className="text-sm text-slate-600 mt-1">Track and monitor all your project dashboards</p>
              </div>
              <button className="relative p-2.5 rounded-xl hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-all">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 space-y-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search dashboards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
              {['all', 'active', 'completed', 'planning'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2.5 rounded-xl font-medium capitalize transition-all whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 hover:border-blue-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                    <Briefcase className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className={`w-4 h-4 ${stat.trendUp ? 'text-green-600' : 'text-slate-400'}`} />
                  <span className="text-slate-600">{stat.trend}</span>
                </div>
                <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500" style={{ width: '75%' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">{project.title}</h3>
                    <p className="text-sm text-slate-600">{project.category}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    project.status === 'active' ? 'bg-blue-50 text-blue-700' :
                    project.status === 'completed' ? 'bg-green-50 text-green-700' :
                    'bg-orange-50 text-orange-700'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">{project.budget} SAR</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-bold text-orange-600">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => handleOpenDashboard(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </button>
                  <Link
                    to={`/provider/reports?project=${project.id}`}
                    className="flex items-center justify-center p-2.5 border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl transition-all"
                  >
                    <FileText className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No dashboards found</h3>
              <p className="text-sm text-slate-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
