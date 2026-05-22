import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'Employee' | 'RO' | 'RVO' | 'AA' | 'HRD' | 'PO' | 'AC'>('Employee');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Check if already logged in
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedUsername = localStorage.getItem('username');
    
    if (storedRole && storedUsername) {
      navigate('/');
    }
  }, [navigate]);

  const roles = [
    { value: 'Employee', label: 'Employee', description: 'Access your PMS records and submissions' },
    { value: 'RO', label: 'Reporting Officer', description: 'Review and evaluate subordinates' },
    { value: 'RVO', label: 'Reviewing Officer', description: 'Review RO evaluations' },
    { value: 'AA', label: 'Accepting Authority', description: 'Final approval authority' },
    { value: 'PO', label: 'Personnel Officer (APAR Cell)', description: 'Review AARs and disclose scores' },
    { value: 'AC', label: 'Appeal Committee', description: 'Final decision on representations' },
    { value: 'HRD', label: 'HRD Admin', description: 'System administration and analytics' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Store user role in localStorage (any password works)
    if (username && password) {
      localStorage.setItem('userRole', selectedRole);
      localStorage.setItem('username', username);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PMS Portal</h1>
          <p className="text-gray-600">Performance Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign In</h2>
            
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                >
                  <option value="">Choose a role...</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-600 text-center">
              Demo Mode: Use any username and password to login
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>© 2026 Performance Management System</p>
        </div>
      </div>
    </div>
  );
};

export default Login;