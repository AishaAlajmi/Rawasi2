import React, { useState } from 'react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Activity, BarChart3, Bell, Briefcase, Calendar, CheckCircle2, ChevronRight,
  Clock, DollarSign, FileText, FolderOpen, Home, MapPin, MessageSquare,
  Plus, TrendingUp, User, Users, Edit2, Save, AlertTriangle, Package, Menu, X,
  Download, Share2, Filter, Search
} from 'lucide-react';

export default function ProviderDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get('project');
  
  const [selectedProject, setSelectedProject] = useState(projectIdFromUrl || '');
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dateRange, setDateRange] = useState('');

  // All projects data
  const projects = [
    {
      id: '1',
      name: 'Riyadh North Hospital',
      client: 'Mohammed Al-Rashid',
      location: 'Riyadh',
      status: 'In progress',
      phase: 'Structure',
      progress: 43,
      budget: { total: 2000000, spent: 620000, remaining: 1380000 },
      timeline: { daysTotal: 350, daysElapsed: 245, daysRemaining: 105 },
      team: 12,
      tasks: { total: 7, completed: 3 }
    },
    {
      id: '2',
      name: 'Al Academy Campus',
      client: 'Al-Noor Group',
      location: 'Jeddah',
      status: 'In progress',
      phase: 'Design',
      progress: 28,
      budget: { total: 8750000, spent: 3675000, remaining: 5075000 },
      timeline: { daysTotal: 540, daysElapsed: 227, daysRemaining: 313 },
      team: 28,
      tasks: { total: 120, completed: 50 }
    },
    {
      id: '3',
      name: 'Palm Valley Mall',
      client: 'Ministry of Education',
      location: 'Dammam',
      status: 'Completed',
      phase: 'Handover',
      progress: 100,
      budget: { total: 1200000, spent: 1180000, remaining: 20000 },
      timeline: { daysTotal: 196, daysElapsed: 196, daysRemaining: 0 },
      team: 8,
      tasks: { total: 45, completed: 45 }
    }
  ];

  const currentProject = projects.find(p => p.id === selectedProject) || projects[0];

const navItems = [
  { label: "Overview",   icon: Home,      to: "/provider/dashboard" },
  { label: "Dashboards", icon: Briefcase, badge: 4, to: "/provider/dashboards" },
  { label: "Requests",   icon: FolderOpen, badge: 3, to: "/provider/requests" },
  { label: "Messages",   icon: MessageSquare, badge: 2, to: "/provider/messages" },
  { label: "Reports",    icon: BarChart3, to: "/provider/reports" },
  { label: "Profile",    icon: User,      to: "/provider/profile" }
];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
     <aside
  className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-white transition-all duration-300 z-50 ${
    sidebarOpen ? 'w-64' : 'w-20'
  }`}
>
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <img 
               src="/photo_2025-08-13_21-03-51.png"
              alt="Rawasi" 
              className="w-10 h-10 rounded-lg"
            />
            {sidebarOpen && (
              <div>
                <div className="text-xl font-bold text-orange-500">RAWASI</div>
                <div className="text-xs text-orange-400">Provider Portal</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
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
          className="absolute -right-3 top-24 bg-slate-700 text-white p-1.5 rounded-full hover:bg-slate-600 transition-all"
        >
          {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* User Profile */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 cursor-pointer transition-all">
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
                AN
              </div>
              <div>
                <p className="text-sm font-medium text-white">Al-Nahda Builders</p>
                <p className="text-xs text-slate-400">Provider</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-blue-500/30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Home className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4" />
                  <span className="font-medium text-orange-600">Project Dashboard</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl shadow-lg transition-all">
                  <Share2 className="w-4 h-4" />
                  <span className="font-medium">Share</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl shadow-lg transition-all">
                  <Download className="w-4 h-4" />
                  <span className="font-medium">Export</span>
                </button>
              </div>
            </div>

            {/* Project Info Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {currentProject.status} • {currentProject.phase}
                </div>
                <div className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                  Sole provider
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {/* Filters Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Project Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl shadow-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="mt-2 space-y-1">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl shadow-lg text-sm transition-all ${
                        selectedProject === project.id
                          ? 'bg-orange-50 text-orange-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {project.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phase Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phase</label>
                <div className="space-y-2">
                  {['All', 'Design', 'Structure', 'Handover'].map((phase) => (
                    <button
                      key={phase}
                      className={`w-full text-left px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium transition-all ${
                        phase === 'All'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {phase}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date range</label>
                <input
                  type="date"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="mm/dd/yyyy"
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 text-orange-600 mb-3">
                <Activity className="w-5 h-5" />
                <h3 className="font-semibold">Status / Phase</h3>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">{currentProject.status} —</p>
                <p className="text-2xl font-bold text-gray-900">{currentProject.phase}</p>
                <p className="text-sm text-green-600 font-medium">Healthy trend</p>
              </div>
            </div>

            {/* Budget Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 text-orange-600 mb-3">
                <DollarSign className="w-5 h-5" />
                <h3 className="font-semibold">Budget vs Actual</h3>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">
                  SAR {(currentProject.budget.spent / 1000).toFixed(0)},000 actual /
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  SAR {(currentProject.budget.total / 1000).toFixed(0)},000 budget
                </p>
                <p className="text-sm text-orange-600 font-medium">Budget used: {((currentProject.budget.spent / currentProject.budget.total) * 100).toFixed(0)}% (1.38 CPI)</p>
              </div>
            </div>

            {/* Forecast Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 text-orange-600 mb-3">
                <TrendingUp className="w-5 h-5" />
                <h3 className="font-semibold">Forecast at Completion</h3>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">
                  SAR {((currentProject.budget.total * 0.69) / 1000).toFixed(0)},000 –
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  SAR {((currentProject.budget.total * 0.77) / 1000).toFixed(0)},000
                </p>
                <p className="text-sm bg-yellow-50 text-yellow-700 px-2 py-1 rounded inline-block font-medium">
                  Point: SAR {((currentProject.budget.total * 0.72) / 1000).toFixed(0)},000
                </p>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 text-orange-600 mb-3">
                <Clock className="w-5 h-5" />
                <h3 className="font-semibold">Schedule variance</h3>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">-43 days</p>
                <p className="text-sm text-red-600 font-medium">vs baseline</p>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 text-orange-600 mb-3">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-semibold">% Progress</h3>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">{currentProject.progress}% ({currentProject.tasks.completed}/{currentProject.tasks.total})</p>
                <p className="text-sm text-blue-600 font-medium">Progress</p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all"
                    style={{ width: `${currentProject.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gantt Chart and Cost S-Curve */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Gantt Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 text-orange-600 mb-4">
                <Calendar className="w-5 h-5" />
                <h3 className="font-semibold">Gantt</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-24">Task</span>
                  <div className="flex-1 grid grid-cols-12 gap-1 text-xs text-orange-300 font-medium">
                    {[...Array(12)].map((_, i) => (
                      <span key={i} className="text-center">{i + 1}</span>
                    ))}
                  </div>
                </div>
                {['Design', 'Permits', 'Groundwork', 'Structure', 'MEP', 'Finishes', 'Handover'].map((task, index) => (
                  <div key={task} className="flex items-center gap-3">
                    <span className="text-sm text-gray-900 w-24">{task}</span>
                    <div className="flex-1 h-8 bg-orange-50 rounded relative">
                      <div 
                        className="absolute h-full bg-orange-500 rounded"
                        style={{ 
                          left: `${(index * 12) % 60}%`,
                          width: `${20 + (index * 5)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-sm text-gray-500 mt-2">Current week: 20</p>
              </div>
            </div>

            {/* Cost S-Curve */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cost S-curve</h3>
              <div className="relative h-48 border-l border-b border-blue-500/30">
                <svg viewBox="0 0 300 150" className="w-full h-full">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={150 - y * 1.5}
                      x2="300"
                      y2={150 - y * 1.5}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Planned curve (orange) */}
                  <path
                    d="M 0 150 Q 75 140, 150 100 T 300 20"
                    fill="none"
                    stroke="#fb923c"
                    strokeWidth="3"
                  />
                  {/* Actual curve (blue) */}
                  <path
                    d="M 0 150 Q 60 145, 130 110 T 280 30"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />
                  {/* Forecast curve (yellow) */}
                  <path
                    d="M 0 150 Q 70 142, 140 105 T 290 25"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                </svg>
              </div>
              <div className="flex gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded"></div>
                  <span className="text-gray-600">Planned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-gray-600">Forecast</span>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Cost breakdown</h4>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#fed7aa" strokeWidth="20" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        stroke="#fb923c" 
                        strokeWidth="20"
                        strokeDasharray="125 251"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-orange-600">52%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Materials 52%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">Labor 35%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
                      <span className="text-sm text-gray-700">Tech 13%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming & Overdue */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Upcoming</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-700">Structure</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-700">MEP</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-700">Finishes</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Overdue</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-gray-700">Permits</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-gray-700">Groundwork</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Performance & ML Insights */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Al-Nahda Builders</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-4 h-4 text-yellow-400">★</div>
                    ))}
                    <div className="w-4 h-4 text-gray-300">★</div>
                    <span className="text-sm text-gray-600 ml-1">4.4</span>
                  </div>
                </div>
                <button className="ml-auto px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-xl shadow-lg transition-all">
                  View profile
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">On-Resp:</p>
                  <p className="text-lg font-bold text-gray-900">-6h</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">COs:</p>
                  <p className="text-lg font-bold text-gray-900">3</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">On-time:</p>
                  <p className="text-lg font-bold text-gray-900">92%</p>
                </div>
              </div>
              
              {/* ML Insights */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">ML Insights</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-3 rounded-xl shadow-lg">
                    <p className="text-sm text-gray-700 font-medium">Forecast at Completion</p>
                    <p className="text-lg font-bold text-orange-600">SAR 1,388,800 – SAR 1,533,467</p>
                    <p className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded mt-1 inline-block">
                      Confidence: 80%
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl shadow-lg">
                    <p className="text-sm text-gray-700 font-medium">Forecast finish</p>
                    <p className="text-lg font-bold text-blue-600">Week 38</p>
                    <p className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded mt-1 inline-block">
                      Risk of overrun: 20%
                    </p>
                  </div>
                </div>
                <div className="mt-3 bg-yellow-50 p-3 rounded-xl shadow-lg">
                  <p className="text-sm font-medium text-white">Key drivers</p>
                  <ul className="text-sm text-gray-700 space-y-1 mt-2">
                    <li>• Permit delay (+1w)</li>
                    <li>• On-site utility clash</li>
                    <li>• Long-lead procurement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <div className="flex items-center gap-2 text-orange-600 mb-4">
              <Bell className="w-5 h-5" />
              <h3 className="font-semibold">Alerts</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Al-Nahda Builders approved</p>
                    <p className="text-sm text-gray-600">2h ago</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-xl shadow-lg font-medium hover:bg-orange-600 transition-all">
                  View request
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <X className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">Al-Nahda Builders rejected</p>
                    <p className="text-sm text-gray-600">1d ago</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-xl shadow-lg font-medium hover:bg-orange-600 transition-all">
                  View details
                </button>
              </div>
            </div>
          </div>

          {/* Reports Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Reports</h3>
            <div className="flex items-center gap-4">
              <input
                type="date"
                className="px-4 py-2.5 border border-gray-300 rounded-xl shadow-lg focus:ring-2 focus:ring-orange-500"
                placeholder="mm/dd/yyyy"
              />
              <button className="flex items-center gap-2 px-6 py-2.5 bg-orange-50 text-orange-600 rounded-xl shadow-lg font-medium hover:bg-orange-100 transition-all">
                <FileText className="w-4 h-4" />
                Generate
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl shadow-lg font-medium hover:bg-orange-600 transition-all">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-3">Note: Generated reports include an audit log and change history.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
