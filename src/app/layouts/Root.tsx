import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  FileEdit,
  CheckSquare,
  BarChart3,
  Settings,
  Eye,
  Menu,
  X,
  User,
  LogOut,
  Users,
  Bell,
  Activity,
  ClipboardList,
  CalendarCheck,
  TrendingUp,
  MessageSquare,
  GraduationCap,
  ClipboardCheck,
  CheckCircle,
  Building2,
  Gavel,
  FileCheck
} from 'lucide-react';
import Logo from '../components/Logo';

const Root = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed for mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For desktop collapsed state
  const [userRole, setUserRole] = useState<'Employee' | 'RO' | 'RVO' | 'AA' | 'HRD' | 'PO' | 'AC'>('Employee');
  const [username, setUsername] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Load sidebar collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved === 'true') {
      setSidebarCollapsed(true);
    }
  }, []);

  // Save sidebar collapsed state and dispatch event
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
    window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { collapsed: sidebarCollapsed } }));
  }, [sidebarCollapsed]);

  const notifications = [
    {
      id: 1,
      title: 'KRA Submission Due',
      message: 'Your KRA entries are due by March 15, 2026',
      time: '2 hours ago',
      type: 'warning',
      read: false
    },
    {
      id: 2,
      title: 'Evaluation Completed',
      message: 'Your performance evaluation has been completed by your RO',
      time: '1 day ago',
      type: 'success',
      read: false
    },
    {
      id: 3,
      title: 'New Training Available',
      message: 'Leadership Development Program is now open for enrollment',
      time: '2 days ago',
      type: 'info',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Check authentication
    const storedRole = localStorage.getItem('userRole') as any;
    const storedUsername = localStorage.getItem('username');
    
    if (!storedRole || !storedUsername) {
      navigate('/login');
      return;
    }
    
    setIsAuthenticated(true);
    setUserRole(storedRole);
    setUsername(storedUsername);
  }, [navigate]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };

  // Don't render until authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Determine if officer should see team dashboard
  const showOfficerDashboard = ['RO', 'RVO', 'AA', 'HRD'].includes(userRole);

  const navigation = [
    {
      name: userRole === 'Employee' ? 'Dashboard' : 'My Dashboard',
      href: '/',
      icon: LayoutDashboard,
      roles: ['Employee', 'RO', 'RVO', 'AA', 'HRD', 'PO', 'AC'],
    },

    // Officer Dashboard (for non-Employee roles)
    {
      name: 'Team Dashboard',
      href: '/officer-dashboard',
      icon: Users,
      roles: ['RO', 'RVO', 'AA', 'HRD'],
    },

    // Employee Menu (for Employee and Officer roles - since officers are also employees)
    { name: 'My PMS', type: 'section', roles: ['Employee', 'RO', 'RVO', 'AA'] },
    { name: 'KRA Entry', href: '/my-pms/kra-entry', icon: FileEdit, roles: ['Employee', 'RO', 'RVO', 'AA'] },
    { name: 'View KRA/KPIs', href: '/my-pms/view-kras', icon: Eye, roles: ['Employee', 'RO', 'RVO', 'AA'] },
    { name: 'Mid-Year Review', href: '/my-pms/mid-year-review', icon: CalendarCheck, roles: ['Employee', 'RO', 'RVO', 'AA'] },
    { name: 'Performance Report', href: '/my-pms/final-score', icon: TrendingUp, roles: ['Employee', 'RO', 'RVO', 'AA'] },
    { name: 'Representation', href: '/my-pms/representation', icon: MessageSquare, roles: ['Employee', 'RO', 'RVO', 'AA'] },
    { name: 'Training & Development', href: '/my-pms/training', icon: GraduationCap, roles: ['Employee', 'RO', 'RVO', 'AA'] },

    // RO Menu
    { name: 'Review & Approvals', type: 'section', roles: ['RO', 'RVO', 'AA'] },
    { name: 'Evaluations', href: '/review/evaluations?tab=pending', icon: ClipboardCheck, roles: ['RO', 'RVO', 'AA'] },
    { name: 'Pending Approvals', href: '/review/pending-approvals', icon: CheckSquare, roles: ['RO', 'RVO', 'AA'] },
    { name: 'Recently Completed', href: '/review/recently-completed', icon: CheckCircle, roles: ['RO', 'RVO', 'AA'] },

    // PO (Personnel Officer / APAR Cell) Menu
    { name: 'APAR Cell', type: 'section', roles: ['PO'] },
    { name: 'APAR Queue', href: '/po/queue', icon: Building2, roles: ['PO'] },

    // AC (Appeal Committee) Menu
    { name: 'Appeal Committee', type: 'section', roles: ['AC'] },
    { name: 'Pending Appeals', href: '/ac/queue', icon: Gavel, roles: ['AC'] },

    // HRD Menu
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['HRD'] },
    { name: 'Administration', href: '/administration', icon: Settings, roles: ['HRD'] },

    // Common
    { name: 'Reports', href: '/reports', icon: ClipboardList, roles: ['RO', 'RVO', 'AA', 'HRD'] },
    { name: 'Activity', href: '/activity', icon: Activity, roles: ['Employee', 'RO', 'RVO', 'AA', 'HRD', 'PO', 'AC'] },
  ];

  const filteredNav = navigation.filter(item => item.roles?.includes(userRole));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full z-20">
        <div className="flex items-center justify-between px-4 sm:px-5 py-2 sm:py-2.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-100 lg:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <Logo className="h-7 sm:h-8 w-auto" />
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left leading-tight">
                  <p className="text-sm font-semibold text-gray-900">{username || 'User'}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{userRole}</p>
                </div>
              </button>
              
              {/* Profile Dropdown */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 overflow-hidden">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 rounded-lg hover:bg-gray-100 relative transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-hidden flex flex-col">
                    <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50/50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full font-bold">
                            {unreadCount} NEW
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100 overflow-y-auto">
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                n.type === 'warning' ? 'bg-yellow-500' :
                                n.type === 'success' ? 'bg-green-500' :
                                n.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 leading-snug">{n.title}</p>
                              <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-14 sm:pt-16">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } ${
            sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
          } fixed w-64 bg-white border-r border-gray-200 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] transition-all duration-300 z-10 overflow-hidden`}
        >
          <nav className="p-3 sm:p-4 space-y-1 overflow-y-auto h-full">
            {filteredNav.map((item, idx) => {
              // Check if this is the first non-section item
              const isFirstMenuItem = idx === 0 && item.type !== 'section';
              
              return item.type === 'section' ? (
                <div key={idx} className={`pt-4 pb-2 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.name}
                  </h3>
                </div>
              ) : (
                <Link
                  key={idx}
                  to={item.href || '/'}
                  className={`flex items-center ${
                    sidebarCollapsed ? 'lg:justify-center lg:px-3' : 'gap-3 px-3'
                  } py-2 rounded-lg transition-colors ${
                    isFirstMenuItem ? 'mt-3' : ''
                  } ${
                    location.pathname === item.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  {item.icon && <item.icon className="w-5 h-5 flex-shrink-0" />}
                  <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 w-full min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}>
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Root;
