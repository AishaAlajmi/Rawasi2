import React, { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  Activity, BarChart3, Bell, Briefcase, Calendar, ChevronRight,
  DollarSign, Download, FolderOpen, Home, MessageSquare,
  Users, User, FileText, CheckCircle2, AlertTriangle, Package,
  Eye, TrendingUp, Shield, Menu
} from 'lucide-react';

export default function ProviderReports() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get('project');
  
  const [selectedProjectForReport, setSelectedProjectForReport] = useState(projectIdFromUrl || '');
  const [generatingReport, setGeneratingReport] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const projects = [
    { id: '1', title: 'Modern Villa Construction', client: 'Mohammed Al-Rashid', location: 'Riyadh' },
    { id: '2', title: 'Commercial Plaza Development', client: 'Al-Noor Group', location: 'Jeddah' },
    { id: '3', title: 'School Building Renovation', client: 'Ministry of Education', location: 'Dammam' },
    { id: '4', title: 'Luxury Apartment Complex', client: 'Urban Developers', location: 'Riyadh' },
    { id: '5', title: 'Hospital Wing Extension', client: 'Health Ministry', location: 'Medina' },
    { id: '6', title: 'Warehouse & Logistics Center', client: 'Saudi Logistics Co.', location: 'Khobar' }
  ];

  const reportTypes = [
    {
      id: 'financial',
      title: 'Financial Report',
      description: 'Comprehensive budget analysis, expenses breakdown, revenue tracking, and cost forecasting',
      icon: DollarSign,
      color: 'blue',
      sections: ['Budget Overview', 'Expense Categories', 'Payment Schedule', 'Cost Analysis']
    },
    {
      id: 'progress',
      title: 'Progress Report',
      description: 'Timeline tracking, milestone achievements, task completion rates, and schedule adherence',
      icon: Activity,
      color: 'orange',
      sections: ['Timeline Status', 'Milestones', 'Tasks Completed', 'Delays & Issues']
    },
    {
      id: 'team',
      title: 'Team Performance Report',
      description: 'Resource allocation, team productivity, attendance tracking, and performance metrics',
      icon: Users,
      color: 'blue',
      sections: ['Team Overview', 'Attendance', 'Productivity', 'Resource Utilization']
    },
    {
      id: 'risk',
      title: 'Risk Assessment Report',
      description: 'Identified risks, impact analysis, mitigation strategies, and contingency planning',
      icon: AlertTriangle,
      color: 'orange',
      sections: ['Risk Identification', 'Impact Analysis', 'Mitigation Plans', 'Monitoring']
    },
    {
      id: 'quality',
      title: 'Quality Control Report',
      description: 'Inspection results, compliance audits, quality standards adherence, and corrective actions',
      icon: CheckCircle2,
      color: 'blue',
      sections: ['Inspections', 'Compliance', 'Standards', 'Corrections']
    },
    {
      id: 'materials',
      title: 'Materials & Inventory Report',
      description: 'Material usage tracking, inventory levels, supplier performance, and procurement status',
      icon: Package,
      color: 'orange',
      sections: ['Material Usage', 'Inventory Status', 'Suppliers', 'Procurement']
    },
    {
      id: 'safety',
      title: 'Safety & Compliance Report',
      description: 'Safety incidents, training records, compliance status, and regulatory adherence',
      icon: Shield,
      color: 'blue',
      sections: ['Safety Records', 'Training', 'Incidents', 'Compliance']
    },
    {
      id: 'comprehensive',
      title: 'Full Project Report',
      description: 'Complete overview including all metrics, analytics, and detailed insights across all areas',
      icon: FileText,
      color: 'orange',
      sections: ['Executive Summary', 'All Metrics', 'Analytics', 'Recommendations']
    }
  ];

  const handleDownload = (reportType) => {
    if (!selectedProjectForReport) return;
    
    setGeneratingReport(reportType);
    
    setTimeout(() => {
      const project = projects.find(p => p.id === selectedProjectForReport);
      console.log(`Generating ${reportType} report for project: ${project?.title}`);
      alert(`Downloading ${reportType} report for ${project?.title}`);
      setGeneratingReport(null);
    }, 1500);
  };

  const ReportCard = ({ report }) => {
    const Icon = report.icon;
    const isGenerating = generatingReport === report.id;

    return (
      <div className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 ${report.color === 'orange' ? 'bg-orange-50 group-hover:bg-orange-100' : 'bg-blue-50 group-hover:bg-blue-100'} rounded-xl transition-colors`}>
            <Icon className={`w-6 h-6 ${report.color === 'orange' ? 'text-orange-600' : 'text-blue-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
              {report.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{report.description}</p>
          </div>
        </div>
        
        <div className="mb-4 p-3 bg-slate-50 rounded-xl">
          <p className="text-xs font-medium text-slate-700 mb-2">Report Sections:</p>
          <div className="flex flex-wrap gap-2">
            {report.sections.map((section, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-white rounded-lg text-slate-600 border border-slate-200">
                {section}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleDownload(report.id)}
            disabled={!selectedProjectForReport || isGenerating}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              !selectedProjectForReport
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isGenerating
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </button>
          <button 
            disabled={!selectedProjectForReport}
            className={`px-4 py-2.5 rounded-xl transition-all ${
              !selectedProjectForReport
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'border border-slate-300 hover:border-orange-500 hover:bg-orange-50 text-slate-700 hover:text-orange-600'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
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

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 bg-slate-800 text-white p-1.5 rounded-full shadow-lg hover:bg-slate-700 transition-all"
        >
          {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

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
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Project Reports</h1>
                <p className="text-sm text-slate-600 mt-1">Generate and download comprehensive project reports</p>
              </div>
              <button className="relative p-2.5 rounded-xl hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-all">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-50 rounded-xl">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Select Project for Report Generation
                </label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-slate-900 font-medium"
                  value={selectedProjectForReport}
                  onChange={(e) => setSelectedProjectForReport(e.target.value)}
                >
                  <option value="">-- Select a Project --</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title} - {project.client} ({project.location})
                    </option>
                  ))}
                </select>
                {!selectedProjectForReport && (
                  <p className="mt-2 text-sm text-orange-600">
                    ⓘ Please select a project to enable report downloads
                  </p>
                )}
                {selectedProjectForReport && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Project selected. You can now download reports below.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedProjectForReport ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTypes.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center shadow-sm">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a Project</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Choose a project from the dropdown above to view available reports and download options
              </p>
            </div>
          )}

          {selectedProjectForReport && (
            <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-md">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Need All Reports?</h3>
                    <p className="text-sm text-slate-600">Download the comprehensive report package</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload('all')}
                  disabled={generatingReport === 'all'}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 font-medium"
                >
                  {generatingReport === 'all' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download All Reports
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
