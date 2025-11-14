import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, BarChart3, Bell, Briefcase, Building2, Camera, Check, ChevronRight,
  Edit, Eye, FolderOpen, Globe, Home, Mail, MapPin, MessageSquare,
  Phone, Plus, Save, Star, TrendingUp, Upload, User, Users, X, Award,
  Calendar, DollarSign, Image as ImageIcon
} from 'lucide-react';

export default function ProviderProfile() {
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

const navItems = [
  { label: "Overview",   icon: Home,      to: "/provider/dashboard" },
  { label: "Dashboards", icon: Briefcase, badge: 4, to: "/provider/dashboards" },
  { label: "Requests",   icon: FolderOpen, badge: 3, to: "/provider/requests" },
  { label: "Messages",   icon: MessageSquare, badge: 2, to: "/provider/messages" },
  { label: "Reports",    icon: BarChart3, to: "/provider/reports" },
  { label: "Profile",    icon: User,      to: "/provider/profile" }
];
  // Company Info State
  const [companyInfo, setCompanyInfo] = useState({
    name: 'TechHome Developers',
    logo: '/photo_2025-08-13_21-03-51.png',
    about: 'Leading construction company specializing in modern residential and commercial projects. With over 15 years of experience, we deliver quality construction with innovative technologies.',
    phone: '+966 50 123 4567',
    email: 'info@techhome.sa',
    website: 'www.techhome.sa',
    address: 'Riyadh, Saudi Arabia'
  });

  // Services & Technologies
  const availableServices = [
    '3D Printing', 'ICF (Insulated Concrete Forms)', 'Prefabricated Construction',
    'Sustainable Materials', 'Smart Home Integration', 'Green Building',
    'BIM Technology', 'Modular Construction', 'Steel Frame', 'Concrete',
    'Wood Frame', 'Solar Integration'
  ];
  const [selectedServices, setSelectedServices] = useState([
    '3D Printing', 'ICF (Insulated Concrete Forms)', 'Prefabricated Construction', 'Sustainable Materials'
  ]);

  // Experience State
  const [experience, setExperience] = useState({
    yearsInBusiness: 15,
    teamSize: 85,
    licenses: 'Commercial Building License #12345, Residential License #67890',
    certifications: ['ISO 9001:2015', 'LEED Certified', 'Safety Certification'],
    regionsServed: ['Riyadh', 'Jeddah', 'Dammam', 'Eastern Province']
  });

  // Portfolio State
  const [portfolio, setPortfolio] = useState([
    {
      id: 1,
      title: 'Luxury Villa Complex',
      type: 'Residential',
      budgetRange: '15M - 20M SAR',
      location: 'Riyadh',
      completionDate: '2023',
      images: ['/project1.jpg'],
      results: '20 luxury villas completed on time, 100% client satisfaction'
    },
    {
      id: 2,
      title: 'Modern Office Tower',
      type: 'Commercial',
      budgetRange: '50M - 60M SAR',
      location: 'Jeddah',
      completionDate: '2023',
      images: ['/project2.jpg'],
      results: '15-story office building with LEED Gold certification'
    },
    {
      id: 3,
      title: 'Educational Campus',
      type: 'Educational',
      budgetRange: '30M - 35M SAR',
      location: 'Dammam',
      completionDate: '2022',
      images: ['/project3.jpg'],
      results: 'State-of-the-art campus serving 2000+ students'
    }
  ]);

  const stats = [
    { label: 'Projects Completed', value: '47', icon: Briefcase, color: 'orange' },
    { label: 'Average Rating', value: '4.8/5', icon: Star, color: 'blue' },
    { label: 'Years Experience', value: experience.yearsInBusiness, icon: Calendar, color: 'orange' },
    { label: 'Team Members', value: experience.teamSize, icon: Users, color: 'blue' }
  ];

  const toggleService = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleSave = () => {
    setIsEditMode(false);
    // Here you would normally save to backend
    alert('Profile saved successfully!');
  };

  // Preview Mode (How Owners See It)
  const PreviewCard = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold">Provider Profile Preview</h2>
          <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-white/20 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Company Header */}
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center overflow-hidden shadow-xl">
              {companyInfo.logo ? (
                <img src={companyInfo.logo} alt="Company Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{companyInfo.name}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="font-semibold">4.8/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>47 Projects Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{companyInfo.address}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all">
                  Contact Provider
                </button>
                <button className="px-6 py-2.5 bg-white border-2 border-orange-500 text-orange-600 rounded-xl hover:bg-orange-50 transition-all">
                  Request Quote
                </button>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-3">About</h3>
            <p className="text-slate-700 leading-relaxed">{companyInfo.about}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white border-2 border-slate-200 rounded-xl p-4 text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color === 'orange' ? 'text-orange-600' : 'text-blue-600'}`} />
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-600">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-3">Services & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {selectedServices.map((service) => (
                <span key={service} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl text-sm font-medium">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
              <p className="text-sm text-orange-700 font-medium mb-1">Years in Business</p>
              <p className="text-3xl font-bold text-orange-600">{experience.yearsInBusiness}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <p className="text-sm text-blue-700 font-medium mb-1">Team Size</p>
              <p className="text-3xl font-bold text-blue-600">{experience.teamSize}</p>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-3">Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {experience.certifications.map((cert, index) => (
                <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 border-2 border-blue-200">
                  <Award className="w-4 h-4" />
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Regions Served */}
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-3">Regions Served</h3>
            <div className="flex flex-wrap gap-2">
              {experience.regionsServed.map((region, index) => (
                <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border-2 border-blue-200">
                  {region}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-4">Portfolio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.map((project) => (
                <div key={project.id} className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all">
                  <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-slate-400" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-slate-900">{project.title}</h4>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">{project.type}</span>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600 mb-3">
                      <p><span className="font-semibold">Budget:</span> {project.budgetRange}</p>
                      <p><span className="font-semibold">Location:</span> {project.location}</p>
                      <p><span className="font-semibold">Completed:</span> {project.completionDate}</p>
                    </div>
                    <p className="text-sm text-slate-700 italic">{project.results}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-br from-slate-50 to-orange-50 rounded-xl p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-600" />
                <span className="text-slate-700">{companyInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-600" />
                <span className="text-slate-700">{companyInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-orange-600" />
                <span className="text-slate-700">{companyInfo.website}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-orange-600" />
                <span className="text-slate-700">{companyInfo.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/20">
      {/* Sidebar */}
    <aside
  className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-white transition-all duration-300 z-50 ${
    sidebarOpen ? 'w-64' : 'w-20'
  }`}
>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img 
               src="/photo_2025-08-13_21-03-51.png" 
              alt="Rawasi" 
              className="w-10 h-10 rounded-xl shadow-lg"
            />
            {sidebarOpen && (
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">RAWASI</div>
                <div className="text-xs text-slate-400">Provider Portal</div>
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
          className="absolute -right-3 top-20 bg-slate-800 text-white p-1.5 rounded-full shadow-lg hover:bg-slate-700 transition-all"
        >
          {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* User Profile */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
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
                <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
                <p className="text-sm text-slate-600 mt-1">Manage your company information and showcase your work</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                {isEditMode ? (
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
                <button className="relative p-2.5 rounded-xl hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-all">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-600">{stat.label}</p>
                    <div className={`p-2 rounded-lg ${stat.color === 'orange' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                      <Icon className={`w-5 h-5 ${stat.color === 'orange' ? 'text-orange-600' : 'text-blue-600'}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Company Information</h2>
            
            <div className="space-y-6">
              {/* Logo & Name */}
              <div className="flex items-start gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center overflow-hidden shadow-lg">
                    {companyInfo.logo ? (
                      <img src={companyInfo.logo} alt="Company Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-12 h-12 text-white" />
                    )}
                  </div>
                  {isEditMode && (
                    <button className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </button>
                  )}
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-slate-900">{companyInfo.name}</p>
                  )}
                </div>
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">About Company</label>
                {isEditMode ? (
                  <textarea
                    value={companyInfo.about}
                    onChange={(e) => setCompanyInfo({...companyInfo, about: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-slate-700 leading-relaxed">{companyInfo.about}</p>
                )}
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  {isEditMode ? (
                    <input
                      type="tel"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">{companyInfo.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  {isEditMode ? (
                    <input
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">{companyInfo.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={companyInfo.website}
                      onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">{companyInfo.website}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">{companyInfo.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Services & Technologies */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Services & Technologies</h2>
            
            {isEditMode ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableServices.map((service) => (
                  <button
                    key={service}
                    onClick={() => toggleService(service)}
                    className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedServices.includes(service)
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-500'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    {selectedServices.includes(service) && (
                      <Check className="w-4 h-4 inline mr-1" />
                    )}
                    {service}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {selectedServices.map((service) => (
                  <span key={service} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl text-sm font-medium">
                    {service}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Experience & Qualifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Years in Business */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Years in Business</label>
                {isEditMode ? (
                  <input
                    type="number"
                    value={experience.yearsInBusiness}
                    onChange={(e) => setExperience({...experience, yearsInBusiness: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-slate-900 font-semibold">{experience.yearsInBusiness} years</p>
                )}
              </div>

              {/* Team Size */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Team Size</label>
                {isEditMode ? (
                  <input
                    type="number"
                    value={experience.teamSize}
                    onChange={(e) => setExperience({...experience, teamSize: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-slate-900 font-semibold">{experience.teamSize} members</p>
                )}
              </div>

              {/* Licenses */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Licenses</label>
                {isEditMode ? (
                  <textarea
                    value={experience.licenses}
                    onChange={(e) => setExperience({...experience, licenses: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-slate-700">{experience.licenses}</p>
                )}
              </div>

              {/* Certifications */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Certifications</label>
                <div className="flex flex-wrap gap-2">
                  {experience.certifications.map((cert, index) => (
                    <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 border-2 border-blue-200">
                      <Award className="w-4 h-4" />
                      {cert}
                    </span>
                  ))}
                  {isEditMode && (
                    <button className="px-4 py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all">
                      <Plus className="w-4 h-4 inline mr-1" />
                      Add Certification
                    </button>
                  )}
                </div>
              </div>

              {/* Regions Served */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Regions Served</label>
                <div className="flex flex-wrap gap-2">
                  {experience.regionsServed.map((region, index) => (
                    <span key={index} className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium border-2 border-orange-200">
                      {region}
                    </span>
                  ))}
                  {isEditMode && (
                    <button className="px-4 py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-all">
                      <Plus className="w-4 h-4 inline mr-1" />
                      Add Region
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Portfolio</h2>
              {isEditMode && (
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all">
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((project) => (
                <div key={project.id} className="group bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-orange-300 hover:shadow-lg transition-all">
                  <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center relative">
                    <ImageIcon className="w-16 h-16 text-slate-400" />
                    {isEditMode && (
                      <button className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-lg hover:bg-blue-50 transition-all">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-slate-900">{project.title}</h4>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">{project.type}</span>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600 mb-2">
                      <p><span className="font-semibold">Budget:</span> {project.budgetRange}</p>
                      <p><span className="font-semibold">Location:</span> {project.location}</p>
                    </div>
                    <p className="text-sm text-slate-700 italic">{project.results}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      {showPreview && <PreviewCard />}
    </div>
  );
}
