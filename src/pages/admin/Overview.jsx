import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const AdminOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [user, setUser] = useState(null);

  // Dashboard data state
  const [stats, setStats] = useState({
    clients: { count: 0, change: 0, newThisMonth: 0 },
    assistants: { count: 0, change: 0, available: 0 },
    tasks: { count: 0, change: 0, completed: 0 },
    alerts: { count: 0, urgent: 0 }
  });
  const [alerts, setAlerts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [availableAssistants, setAvailableAssistants] = useState([]);
  const [pendingMatches, setPendingMatches] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
    fetchUserProfile();
    fetchAlerts();
  }, [selectedPeriod]);

  // Fetch alerts from API
  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.map(alert => ({
          id: alert.id,
          type: alert.type,
          title: alert.title,
          description: alert.description,
          time: formatTimeAgo(alert.createdAt),
          action: alert.action || 'View Details',
          actionUrl: alert.actionUrl
        })));

        // Update stats
        const urgentCount = data.filter(a => a.priority === 'urgent').length;
        setStats(prev => ({
          ...prev,
          alerts: { count: data.length, urgent: urgentCount }
        }));
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      // Fall back to sample alerts if API fails
    }
  };

  // Format time ago helper
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data in parallel
      const [usersRes, tasksRes] = await Promise.all([
        fetch(`${API_URL}/users`, { headers }),
        fetch(`${API_URL}/tasks`, { headers }).catch(() => ({ ok: false }))
      ]);

      // Process users data
      if (usersRes.ok) {
        const users = await usersRes.json();
        const clients = users.filter(u => u.role === 'client');
        const assistants = users.filter(u => u.role === 'assistant');

        setStats(prev => ({
          ...prev,
          clients: {
            count: clients.length,
            change: 5,
            newThisMonth: Math.floor(clients.length * 0.1)
          },
          assistants: {
            count: assistants.length,
            change: 8,
            available: Math.floor(assistants.length * 0.3)
          }
        }));

        // Set available assistants
        setAvailableAssistants(assistants.slice(0, 5).map(a => ({
          id: a.id,
          name: a.name,
          role: a.profile_data?.specialty || 'Administrative',
          status: 'Available',
          time: 'Recently'
        })));
      }

      // Process tasks data
      if (tasksRes.ok) {
        const tasks = await tasksRes.json();
        const activeTasks = tasks.filter(t => t.status !== 'completed');
        const completedTasks = tasks.filter(t => t.status === 'completed');

        setStats(prev => ({
          ...prev,
          tasks: {
            count: activeTasks.length,
            change: 4,
            completed: completedTasks.length
          }
        }));
      }

      // Alerts are now fetched separately via fetchAlerts()

      // Set sample assignments
      setAssignments([
        {
          client: 'TechVentures Inc.',
          clientId: 'C-1847',
          assistant: { name: 'Sarah Martinez', id: 'A-1647', avatar: 'SM' },
          serviceType: 'Executive Support',
          assignedDate: 'Jan 8, 2024',
          status: 'Active',
          workload: 85
        },
        {
          client: 'Defense Solutions Group',
          clientId: 'C-1901',
          assistant: { name: 'James Patterson', id: 'A-1823', avatar: 'JP' },
          serviceType: 'Administrative',
          assignedDate: 'Jan 10, 2024',
          status: 'Active',
          workload: 68
        }
      ]);

      // Set sample pending matches
      setPendingMatches([
        { company: 'Lewis Consulting', type: 'Executive Support', requirement: 'with marketing experience', priority: 'Urgent', time: '2 hours ago' },
        { company: 'Quantum Solutions', type: 'Data Analytics', requirement: 'with SQL proficiency', priority: 'Standard', time: '1 day ago' }
      ]);

      // Set sample recent activity
      setRecentActivity([
        { type: 'assignment', title: 'New Assignment Completed', description: 'Assignment created successfully', time: '15 minutes ago', icon: 'checkCircle', color: '#22c55e' },
        { type: 'client', title: 'New Client Onboarded', description: 'New client added to platform', time: '2 hours ago', icon: 'users', color: '#3b82f6' }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users?search=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const users = await response.json();
        const filtered = users.filter(u =>
          u.name?.toLowerCase().includes(query.toLowerCase()) ||
          u.email?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        setSearchResults(filtered.map(u => ({
          id: u.id,
          name: u.name,
          type: u.role,
          subtitle: u.email
        })));
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSearchResultClick = (result) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigate(`/admin/users?id=${result.id}`);
  };

  // Dismiss alert - calls API to log and persist
  const dismissAlert = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/alerts/${alertId}/dismiss`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remove from local state with animation
        setAlerts(prev => prev.filter(a => a.id !== alertId));

        // Update alert count in stats
        setStats(prev => ({
          ...prev,
          alerts: {
            count: Math.max(0, prev.alerts.count - 1),
            urgent: prev.alerts.urgent > 0 ? prev.alerts.urgent - 1 : 0
          }
        }));
      } else {
        console.error('Failed to dismiss alert');
      }
    } catch (error) {
      console.error('Error dismissing alert:', error);
      // Still remove locally for UX even if API fails
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    }
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#22c55e';
      case 'Onboarding': return '#f59e0b';
      case 'Paused': return '#6b7280';
      default: return '#3b82f6';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return '#ef4444';
      case 'Critical': return '#dc2626';
      case 'Standard': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return 'warning';
      case 'warning': return 'clock';
      case 'info': return 'user';
      default: return 'info';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const coverageStatus = [
    { type: 'Administrative Support', assigned: 47, available: 6, percentage: 94 },
    { type: 'Executive Support', assigned: 28, available: 8, percentage: 78 },
    { type: 'Data & Analytics', assigned: 22, available: 3, percentage: 88 },
    { type: 'Marketing Support', assigned: 18, available: 10, percentage: 65 }
  ];

  const performanceMetrics = [
    { value: '96.8%', label: 'Client Satisfaction', subtext: 'Last 30 days' },
    { value: '94.2%', label: 'Task Completion Rate', subtext: 'Last 30 days' },
    { value: '2.4 hrs', label: 'Avg Response Time', subtext: 'Last 30 days' },
    { value: '98.1%', label: 'SLA Compliance', subtext: 'Last 30 days' }
  ];

  const topPerformers = [
    { rank: 1, name: 'Sarah Martinez', role: 'Executive Support', rating: '98.5%' },
    { rank: 2, name: 'Jennifer Lewis', role: 'Data & Analytics', rating: '97.8%' },
    { rank: 3, name: 'Rebecca Foster', role: 'Marketing', rating: '97.2%' }
  ];

  const statsConfig = [
    {
      label: 'Active Clients',
      value: stats.clients.count.toString(),
      change: `+${stats.clients.change}%`,
      changeType: 'positive',
      subtext: `${stats.clients.newThisMonth} new this month`,
      icon: 'users',
      iconBg: 'rgba(168, 85, 247, 0.1)',
      iconColor: '#a855f7'
    },
    {
      label: 'Active Assistants',
      value: stats.assistants.count.toString(),
      change: `+${stats.assistants.change}%`,
      changeType: 'positive',
      subtext: `${stats.assistants.available} available for assignment`,
      icon: 'user',
      iconBg: 'rgba(34, 197, 94, 0.1)',
      iconColor: '#22c55e'
    },
    {
      label: 'Active Tasks',
      value: stats.tasks.count.toString(),
      change: `+${stats.tasks.change}%`,
      changeType: 'positive',
      subtext: `${stats.tasks.completed} completed this week`,
      icon: 'tasks',
      iconBg: 'rgba(59, 130, 246, 0.1)',
      iconColor: '#3b82f6'
    },
    {
      label: 'Critical Alerts',
      value: stats.alerts.count.toString(),
      change: stats.alerts.urgent > 0 ? 'Urgent' : 'None',
      changeType: stats.alerts.urgent > 0 ? 'negative' : 'positive',
      subtext: stats.alerts.urgent > 0 ? 'Requires immediate attention' : 'All clear',
      icon: 'warning',
      iconBg: stats.alerts.urgent > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
      iconColor: stats.alerts.urgent > 0 ? '#ef4444' : '#22c55e'
    }
  ];

  // Settings Modal Component
  const SettingsModal = () => (
    <div className="admin-modal-overlay" onClick={() => setShowSettingsModal(false)}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>Dashboard Settings</h2>
          <button className="admin-modal-close" onClick={() => setShowSettingsModal(false)}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="admin-modal-body">
          <div className="admin-settings-section">
            <h3>Time Period</h3>
            <div className="admin-settings-options">
              {['day', 'week', 'month', 'quarter'].map(period => (
                <label key={period} className="admin-radio-label">
                  <input
                    type="radio"
                    name="period"
                    checked={selectedPeriod === period}
                    onChange={() => setSelectedPeriod(period)}
                  />
                  <span>{period.charAt(0).toUpperCase() + period.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="admin-settings-section">
            <h3>Notifications</h3>
            <label className="admin-toggle-label">
              <input type="checkbox" defaultChecked />
              <span>Email alerts for critical issues</span>
            </label>
            <label className="admin-toggle-label">
              <input type="checkbox" defaultChecked />
              <span>Daily summary reports</span>
            </label>
            <label className="admin-toggle-label">
              <input type="checkbox" />
              <span>New client notifications</span>
            </label>
          </div>
          <div className="admin-settings-section">
            <h3>Dashboard Widgets</h3>
            <label className="admin-toggle-label">
              <input type="checkbox" defaultChecked />
              <span>Show performance metrics</span>
            </label>
            <label className="admin-toggle-label">
              <input type="checkbox" defaultChecked />
              <span>Show recent activity</span>
            </label>
            <label className="admin-toggle-label">
              <input type="checkbox" defaultChecked />
              <span>Show top performers</span>
            </label>
          </div>
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn-secondary" onClick={() => setShowSettingsModal(false)}>
            Cancel
          </button>
          <button className="admin-btn-primary" onClick={() => setShowSettingsModal(false)}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>Admin Dashboard</h1>
          <p>Manage assistant assignments and monitor coverage</p>
        </div>
        <div className="admin-header-right">
          <div className="admin-search-container">
            <div className="admin-search">
              <Icon name="search" size={16} />
              <input
                type="text"
                placeholder="Search users, clients..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              />
            </div>
            {showSearchResults && searchResults.length > 0 && (
              <div className="admin-search-results">
                {searchResults.map(result => (
                  <div
                    key={result.id}
                    className="admin-search-result"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    <div className="admin-search-result-avatar">
                      {result.name?.charAt(0) || '?'}
                    </div>
                    <div className="admin-search-result-info">
                      <span className="admin-search-result-name">{result.name}</span>
                      <span className="admin-search-result-subtitle">{result.subtitle} • {result.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="admin-icon-btn" onClick={() => setShowSettingsModal(true)}>
            <Icon name="settings" size={20} />
          </button>
          <div className="admin-user-menu">
            <div className="admin-avatar">{user?.name?.split(' ').map(n => n[0]).join('') || 'AU'}</div>
            <div className="admin-user-info">
              <span className="admin-user-name">{user?.name || 'Admin User'}</span>
              <span className="admin-user-role">Administrator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="admin-period-selector">
        {['day', 'week', 'month', 'quarter'].map(period => (
          <button
            key={period}
            className={`admin-period-btn ${selectedPeriod === period ? 'active' : ''}`}
            onClick={() => setSelectedPeriod(period)}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        {statsConfig.map((stat, index) => (
          <div key={index} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ backgroundColor: stat.iconBg }}>
              <Icon name={stat.icon} size={20} color={stat.iconColor} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">{stat.label}</span>
              <div className="admin-stat-value-row">
                <span className="admin-stat-value">{stat.value}</span>
                <span className={`admin-stat-change ${stat.changeType}`}>{stat.change}</span>
              </div>
              <span className="admin-stat-subtext">{stat.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Critical Alerts Section */}
      {alerts.length > 0 && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Critical Alerts & Notifications</h2>
            <Link to="/admin/alerts" className="admin-section-link">View All</Link>
          </div>
          <div className="admin-alerts-list">
            {alerts.map((alert) => (
              <div key={alert.id} className={`admin-alert-card ${alert.type}`}>
                <div className="admin-alert-icon" style={{ backgroundColor: `${getAlertColor(alert.type)}15` }}>
                  <Icon name={getAlertIcon(alert.type)} size={18} color={getAlertColor(alert.type)} />
                </div>
                <div className="admin-alert-content">
                  <h4 className="admin-alert-title">{alert.title}</h4>
                  <p className="admin-alert-description">{alert.description}</p>
                  <div className="admin-alert-meta">
                    <span className="admin-alert-time">{alert.time}</span>
                    <button className="admin-alert-action">{alert.action}</button>
                  </div>
                </div>
                <button className="admin-alert-dismiss" onClick={() => dismissAlert(alert.id)}>
                  <Icon name="close" size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignment Overview & Coverage Status */}
      <div className="admin-grid">
        <div className="admin-card assignment-overview-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Assignment Overview</h3>
            <span className="admin-card-badge">{coverageStatus.reduce((a, b) => a + b.assigned, 0)} Total</span>
          </div>
          <div className="admin-card-body">
            <p className="admin-card-subtitle">Current Assignments by Service Type</p>
            <div className="admin-bar-chart">
              {coverageStatus.map((item, index) => {
                const maxAssigned = Math.max(...coverageStatus.map(i => i.assigned));
                const heightPercent = (item.assigned / maxAssigned) * 100;
                return (
                  <div key={index} className="admin-bar-item">
                    <span className="admin-bar-value">{item.assigned}</span>
                    <div
                      className="admin-bar"
                      style={{
                        height: `${Math.max(heightPercent, 15)}%`
                      }}
                    ></div>
                    <span className="admin-bar-label">{item.type.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="admin-card coverage-status-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Coverage Status</h3>
            <span className="admin-card-badge success">{Math.round(coverageStatus.reduce((a, b) => a + b.percentage, 0) / coverageStatus.length)}% Avg</span>
          </div>
          <div className="admin-card-body">
            {coverageStatus.map((item, index) => (
              <div key={index} className="admin-coverage-item">
                <div className="admin-coverage-header">
                  <span className="admin-coverage-type">{item.type}</span>
                  <span className={`admin-coverage-percent ${item.percentage > 80 ? 'high' : item.percentage > 60 ? 'medium' : 'low'}`}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="admin-progress">
                  <div
                    className="admin-progress-bar"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.percentage > 80 ? '#22c55e' : item.percentage > 60 ? '#f59e0b' : '#ef4444'
                    }}
                  ></div>
                </div>
                <div className="admin-coverage-stats">
                  <span><Icon name="users" size={12} style={{ marginRight: '4px' }} />{item.assigned} assigned</span>
                  <span><Icon name="checkCircle" size={12} style={{ marginRight: '4px' }} />{item.available} available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Assignments Table */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Recent Assignments</h2>
          <div className="admin-section-actions">
            <button className="admin-btn-secondary">
              <Icon name="download" size={16} />
              Export
            </button>
            <Link to="/admin/users" className="admin-btn-primary">
              <Icon name="plus" size={16} />
              New Assignment
            </Link>
          </div>
        </div>
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Assistant</th>
                <th>Service Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Workload</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment, index) => (
                <tr key={index}>
                  <td>
                    <div className="admin-cell-user">
                      <div className="admin-list-avatar" style={{ backgroundColor: '#f3e8ff', color: '#8b5cf6' }}>
                        {assignment.client.split(' ').map(w => w[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <div className="admin-list-title">{assignment.client}</div>
                        <div className="admin-list-subtitle">{assignment.clientId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-cell-user">
                      <div className="admin-list-avatar">{assignment.assistant.avatar}</div>
                      <div>
                        <div className="admin-list-title">{assignment.assistant.name}</div>
                        <div className="admin-list-subtitle">{assignment.assistant.id}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="admin-badge">{assignment.serviceType}</span></td>
                  <td>{assignment.assignedDate}</td>
                  <td>
                    <span className="admin-status" style={{ backgroundColor: `${getStatusColor(assignment.status)}15`, color: getStatusColor(assignment.status) }}>
                      <span className="admin-status-dot" style={{ backgroundColor: getStatusColor(assignment.status) }}></span>
                      {assignment.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-workload">
                      <div className="admin-progress" style={{ width: '60px' }}>
                        <div
                          className="admin-progress-bar"
                          style={{
                            width: `${assignment.workload}%`,
                            backgroundColor: assignment.workload > 80 ? '#ef4444' : assignment.workload > 60 ? '#f59e0b' : '#22c55e'
                          }}
                        ></div>
                      </div>
                      <span>{assignment.workload}%</span>
                    </div>
                  </td>
                  <td>
                    <button className="admin-icon-btn-sm">
                      <Icon name="eye" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assistant Availability & Pending Matches */}
      <div className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Assistant Availability</h3>
            <Link to="/admin/users?role=assistant" className="admin-section-link">View All</Link>
          </div>
          <div className="admin-card-body">
            {availableAssistants.length > 0 ? (
              availableAssistants.map((assistant, index) => (
                <div key={index} className="admin-list-item">
                  <div className="admin-list-avatar">{assistant.name?.split(' ').map(w => w[0]).join('') || '?'}</div>
                  <div className="admin-list-content">
                    <div className="admin-list-title">{assistant.name}</div>
                    <div className="admin-list-subtitle">{assistant.role} • {assistant.time}</div>
                  </div>
                  <span className="admin-status available">
                    <span className="admin-status-dot" style={{ backgroundColor: '#22c55e' }}></span>
                    {assistant.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="admin-empty-state">No assistants available</p>
            )}
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Pending Matches</h3>
            <Link to="/admin/matches" className="admin-section-link">View All</Link>
          </div>
          <div className="admin-card-body">
            {pendingMatches.map((match, index) => (
              <div key={index} className="admin-list-item">
                <div className="admin-list-content">
                  <div className="admin-list-title">{match.company}</div>
                  <div className="admin-list-subtitle">Requires: {match.type} {match.requirement}</div>
                </div>
                <span className="admin-badge" style={{ backgroundColor: `${getPriorityColor(match.priority)}15`, color: getPriorityColor(match.priority) }}>
                  {match.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="admin-section">
        <h2 className="admin-section-title">Performance Metrics</h2>
        <div className="admin-metrics-grid">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="admin-metric-card">
              <span className="admin-metric-value">{metric.value}</span>
              <span className="admin-metric-label">{metric.label}</span>
              <span className="admin-metric-subtext">{metric.subtext}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers & Recent Activity */}
      <div className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Top Performing Assistants</h3>
          </div>
          <div className="admin-card-body">
            {topPerformers.map((performer, index) => (
              <div key={index} className="admin-list-item">
                <span className="admin-rank">{performer.rank}</span>
                <div className="admin-list-avatar">{performer.name.split(' ').map(w => w[0]).join('')}</div>
                <div className="admin-list-content">
                  <div className="admin-list-title">{performer.name}</div>
                  <div className="admin-list-subtitle">{performer.role}</div>
                </div>
                <span className="admin-rating">{performer.rating}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Recent Activity</h3>
          </div>
          <div className="admin-card-body">
            {recentActivity.map((activity, index) => (
              <div key={index} className="admin-activity-item">
                <div className="admin-activity-icon" style={{ backgroundColor: `${activity.color}15` }}>
                  <Icon name={activity.icon} size={16} color={activity.color} />
                </div>
                <div className="admin-activity-content">
                  <div className="admin-activity-title">{activity.title}</div>
                  <div className="admin-activity-description">{activity.description}</div>
                </div>
                <span className="admin-activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="admin-quick-actions">
          <Link to="/admin/users?action=add&role=client" className="admin-quick-action">
            <div className="admin-quick-icon" style={{ backgroundColor: '#8b5cf6' }}>
              <Icon name="plus" size={24} color="#fff" />
            </div>
            <span>Add New Client</span>
          </Link>
          <Link to="/admin/users?action=assign" className="admin-quick-action">
            <div className="admin-quick-icon" style={{ backgroundColor: '#3b82f6' }}>
              <Icon name="users" size={24} color="#fff" />
            </div>
            <span>Create Assignment</span>
          </Link>
          <Link to="/admin/invoices?action=new" className="admin-quick-action">
            <div className="admin-quick-icon" style={{ backgroundColor: '#22c55e' }}>
              <Icon name="invoice" size={24} color="#fff" />
            </div>
            <span>Generate Invoice</span>
          </Link>
          <Link to="/admin/reports" className="admin-quick-action">
            <div className="admin-quick-icon" style={{ backgroundColor: '#f59e0b' }}>
              <Icon name="chart" size={24} color="#fff" />
            </div>
            <span>View Reports</span>
          </Link>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && <SettingsModal />}
    </div>
  );
};

export default AdminOverview;
