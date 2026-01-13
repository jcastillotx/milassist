import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';

const AdminOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const stats = [
    {
      label: 'Active Clients',
      value: '248',
      change: '+5%',
      changeType: 'positive',
      subtext: '18 new this month',
      icon: 'users',
      iconBg: 'rgba(168, 85, 247, 0.1)',
      iconColor: '#a855f7'
    },
    {
      label: 'Active Assistants',
      value: '142',
      change: '+8%',
      changeType: 'positive',
      subtext: '7 available for assignment',
      icon: 'user',
      iconBg: 'rgba(34, 197, 94, 0.1)',
      iconColor: '#22c55e'
    },
    {
      label: 'Active Tasks',
      value: '1,847',
      change: '+4%',
      changeType: 'positive',
      subtext: '342 completed this week',
      icon: 'tasks',
      iconBg: 'rgba(59, 130, 246, 0.1)',
      iconColor: '#3b82f6'
    },
    {
      label: 'Critical Alerts',
      value: '7',
      change: 'Urgent',
      changeType: 'negative',
      subtext: 'Requires immediate attention',
      icon: 'warning',
      iconBg: 'rgba(239, 68, 68, 0.1)',
      iconColor: '#ef4444'
    },
  ];

  const criticalAlerts = [
    {
      type: 'error',
      title: 'Assistant Capacity Alert',
      description: 'Sarah Martinez (ID: A-1647) has exceeded 90% capacity. Reassignment recommended.',
      time: '15 minutes ago',
      action: 'Review Assignment'
    },
    {
      type: 'warning',
      title: 'Client SLA Risk',
      description: 'TechVentures Inc. has 3 tasks approaching SLA deadline within 24 hours.',
      time: '1 hour ago',
      action: 'View Tasks'
    },
    {
      type: 'info',
      title: 'New Client Onboarding',
      description: 'Defense Solutions Group requires assistant matching with security clearance.',
      time: '2 hours ago',
      action: 'Begin Matching'
    }
  ];

  const recentAssignments = [
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
    },
    {
      client: 'Veterans Alliance',
      clientId: 'C-1756',
      assistant: { name: 'Rebecca Foster', id: 'A-1712', avatar: 'RF' },
      serviceType: 'Marketing',
      assignedDate: 'Jan 11, 2024',
      status: 'Active',
      workload: 72
    },
    {
      client: 'Precision Analytics',
      clientId: 'C-1892',
      assistant: { name: 'Jennifer Lewis', id: 'A-1654', avatar: 'JL' },
      serviceType: 'Data & Analytics',
      assignedDate: 'Jan 12, 2024',
      status: 'Active',
      workload: 45
    },
    {
      client: 'Foster & Associates',
      clientId: 'C-1734',
      assistant: { name: 'David Thompson', id: 'A-1789', avatar: 'DT' },
      serviceType: 'Administrative',
      assignedDate: 'Jan 13, 2024',
      status: 'Onboarding',
      workload: 15
    }
  ];

  const assistantAvailability = [
    { name: 'Amanda Rodriguez', role: 'Administrative', status: 'Available', time: '5 hours ago' },
    { name: 'Michael Chen', role: 'Data & Analytics', status: 'Available', time: '8 hours ago' },
    { name: 'Lisa Thompson', role: 'Executive Support', status: 'Available', time: '7 hours ago' },
    { name: 'Robert Davis', role: 'Marketing', status: 'Available', time: '4 days ago' },
    { name: 'Emily Wilson', role: 'Administrative', status: 'In Training', time: '2 days ago' }
  ];

  const pendingMatches = [
    { company: 'Lewis Consulting', type: 'Executive Support', requirement: 'with marketing experience', priority: 'Urgent', time: '2 hours ago' },
    { company: 'Quantum Solutions', type: 'Data Analytics', requirement: 'with SQL proficiency', priority: 'Standard', time: '1 day ago' },
    { company: 'Secure Systems Corp', type: 'Administrative', requirement: 'with security clearance', priority: 'Critical', time: '3 hours ago' },
    { company: 'Horizon Marketing', type: 'Marketing Support', requirement: 'with social media expertise', priority: 'Standard', time: '1 day ago' },
    { company: 'Innovation Labs', type: 'Administrative', requirement: 'with project management skills', priority: 'Standard', time: '1 day ago' }
  ];

  const performanceMetrics = [
    { value: '96.8%', label: 'Client Satisfaction', subtext: 'Last 30 days' },
    { value: '94.2%', label: 'Task Completion Rate', subtext: 'Last 30 days' },
    { value: '2.4 hrs', label: 'Avg Response Time', subtext: 'Last 30 days' },
    { value: '98.1%', label: 'SLA Compliance', subtext: 'Last 30 days' }
  ];

  const coverageStatus = [
    { type: 'Administrative Support', assigned: 47, available: 6, percentage: 94 },
    { type: 'Executive Support', assigned: 28, available: 8, percentage: 78 },
    { type: 'Data & Analytics', assigned: 22, available: 3, percentage: 88 },
    { type: 'Marketing Support', assigned: 18, available: 10, percentage: 65 }
  ];

  const topPerformers = [
    { rank: 1, name: 'Sarah Martinez', role: 'Executive Support', rating: '98.5%' },
    { rank: 2, name: 'Jennifer Lewis', role: 'Data & Analytics', rating: '97.8%' },
    { rank: 3, name: 'Rebecca Foster', role: 'Marketing', rating: '97.2%' },
    { rank: 4, name: 'David Thompson', role: 'Administrative', rating: '96.9%' },
    { rank: 5, name: 'James Patterson', role: 'Administrative', rating: '96.5%' }
  ];

  const recentActivity = [
    { type: 'assignment', title: 'New Assignment Completed', description: 'Sarah Martinez assigned to TechVentures Inc.', time: '15 minutes ago', icon: 'checkCircle', color: '#22c55e' },
    { type: 'client', title: 'New Client Onboarded', description: 'Defense Solutions Group added to platform', time: '2 hours ago', icon: 'users', color: '#3b82f6' },
    { type: 'alert', title: 'Capacity Alert Triggered', description: 'Sarah Martinez workload exceeded 90%', time: '3 hours ago', icon: 'warning', color: '#f59e0b' },
    { type: 'report', title: 'Monthly Report Generated', description: 'December performance metrics compiled', time: '5 hours ago', icon: 'document', color: '#8b5cf6' },
    { type: 'review', title: 'High Client Rating Received', description: 'Jennifer Lewis received 5-star review', time: '1 day ago', icon: 'target', color: '#22c55e' },
    { type: 'termination', title: 'Assignment Terminated', description: 'Client requested assistant change', time: '1 day ago', icon: 'close', color: '#ef4444' }
  ];

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

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>Admin Dashboard</h1>
          <p>Manage assistant assignments and monitor coverage</p>
        </div>
        <div className="admin-header-right">
          <div className="admin-search">
            <Icon name="search" size={16} />
            <input type="text" placeholder="Search..." />
          </div>
          <button className="admin-icon-btn">
            <Icon name="settings" size={20} />
          </button>
          <div className="admin-user-menu">
            <div className="admin-avatar">AU</div>
            <div className="admin-user-info">
              <span className="admin-user-name">Admin User</span>
              <span className="admin-user-role">Administrator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        {stats.map((stat, index) => (
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
      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Critical Alerts & Notifications</h2>
          <Link to="/admin/alerts" className="admin-link">View All</Link>
        </div>
        <div className="admin-alerts-list">
          {criticalAlerts.map((alert, index) => (
            <div key={index} className="admin-alert-item">
              <div className="admin-alert-icon" style={{ backgroundColor: `${getAlertColor(alert.type)}15`, color: getAlertColor(alert.type) }}>
                <Icon name={getAlertIcon(alert.type)} size={18} />
              </div>
              <div className="admin-alert-content">
                <div className="admin-alert-header">
                  <h4>{alert.title}</h4>
                  <span className="admin-alert-time">{alert.time}</span>
                </div>
                <p>{alert.description}</p>
                <button className="admin-alert-action">{alert.action}</button>
              </div>
              <button className="admin-alert-dismiss">
                <Icon name="close" size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Overview & Coverage Status */}
      <div className="admin-grid-2">
        <div className="admin-card">
          <h3>Assignment Overview</h3>
          <p className="admin-card-subtitle">Current Assignments by Service Type</p>
          <div className="admin-chart-placeholder">
            <div className="admin-bar-chart">
              {coverageStatus.map((item, index) => (
                <div key={index} className="admin-bar-item">
                  <div className="admin-bar" style={{ height: `${item.assigned * 2}px`, backgroundColor: '#8b5cf6' }}></div>
                  <span className="admin-bar-label">{item.type.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="admin-card">
          <h3>Coverage Status</h3>
          <div className="admin-coverage-list">
            {coverageStatus.map((item, index) => (
              <div key={index} className="admin-coverage-item">
                <div className="admin-coverage-header">
                  <span className="admin-coverage-type">{item.type}</span>
                  <span className="admin-coverage-percent">{item.percentage}%</span>
                </div>
                <div className="admin-coverage-stats">
                  <span>{item.assigned} assistants assigned</span>
                  <span>{item.available} available</span>
                </div>
                <div className="admin-progress-bar">
                  <div className="admin-progress-fill" style={{ width: `${item.percentage}%`, backgroundColor: item.percentage > 80 ? '#22c55e' : item.percentage > 60 ? '#f59e0b' : '#ef4444' }}></div>
                </div>
              </div>
            ))}
            <div className="admin-coverage-totals">
              <div className="admin-coverage-total">
                <span className="admin-total-value">135</span>
                <span className="admin-total-label">Total Assigned</span>
              </div>
              <div className="admin-coverage-total">
                <span className="admin-total-value">25</span>
                <span className="admin-total-label">Available</span>
              </div>
              <div className="admin-coverage-total">
                <span className="admin-total-value">7</span>
                <span className="admin-total-label">In Training</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assignments Table */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Recent Assignments</h2>
          <div className="admin-section-actions">
            <button className="admin-btn-secondary">
              <Icon name="download" size={16} />
              Export
            </button>
          </div>
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Assistant</th>
                <th>Service Type</th>
                <th>Assigned Date</th>
                <th>Status</th>
                <th>Workload</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentAssignments.map((assignment, index) => (
                <tr key={index}>
                  <td>
                    <div className="admin-client-cell">
                      <div className="admin-client-avatar" style={{ backgroundColor: '#f3e8ff', color: '#8b5cf6' }}>
                        {assignment.client.split(' ').map(w => w[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <span className="admin-client-name">{assignment.client}</span>
                        <span className="admin-client-id">{assignment.clientId}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-assistant-cell">
                      <div className="admin-assistant-avatar">{assignment.assistant.avatar}</div>
                      <div>
                        <span className="admin-assistant-name">{assignment.assistant.name}</span>
                        <span className="admin-assistant-id">{assignment.assistant.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-service-badge">{assignment.serviceType}</span>
                  </td>
                  <td>{assignment.assignedDate}</td>
                  <td>
                    <span className="admin-status-badge" style={{ backgroundColor: `${getStatusColor(assignment.status)}15`, color: getStatusColor(assignment.status) }}>
                      {assignment.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-workload-cell">
                      <div className="admin-workload-bar">
                        <div className="admin-workload-fill" style={{ width: `${assignment.workload}%`, backgroundColor: assignment.workload > 80 ? '#ef4444' : assignment.workload > 60 ? '#f59e0b' : '#22c55e' }}></div>
                      </div>
                      <span>{assignment.workload}%</span>
                    </div>
                  </td>
                  <td>
                    <button className="admin-action-btn">
                      <Icon name="eye" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="admin-table-footer">
            <span>Showing 1-5 of 156 assignments</span>
            <div className="admin-pagination">
              <button className="admin-page-btn">Previous</button>
              <button className="admin-page-btn active">1</button>
              <button className="admin-page-btn">2</button>
              <button className="admin-page-btn">3</button>
              <button className="admin-page-btn">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Assistant Availability & Pending Matches */}
      <div className="admin-grid-2">
        <div className="admin-card">
          <h3>Assistant Availability</h3>
          <div className="admin-availability-list">
            {assistantAvailability.map((assistant, index) => (
              <div key={index} className="admin-availability-item">
                <div className="admin-availability-avatar">{assistant.name.split(' ').map(w => w[0]).join('')}</div>
                <div className="admin-availability-info">
                  <span className="admin-availability-name">{assistant.name}</span>
                  <span className="admin-availability-role">{assistant.role} • {assistant.time}</span>
                </div>
                <span className={`admin-availability-status ${assistant.status === 'Available' ? 'available' : 'training'}`}>
                  {assistant.status}
                </span>
                <button className="admin-assign-btn">{assistant.status === 'Available' ? 'Assign' : 'Unavailable'}</button>
              </div>
            ))}
          </div>
          <button className="admin-view-all-btn">View All Available Assistants</button>
        </div>
        <div className="admin-card">
          <h3>Pending Matches</h3>
          <div className="admin-matches-list">
            {pendingMatches.map((match, index) => (
              <div key={index} className="admin-match-item">
                <div className="admin-match-header">
                  <span className="admin-match-company">{match.company}</span>
                  <span className="admin-match-priority" style={{ backgroundColor: `${getPriorityColor(match.priority)}15`, color: getPriorityColor(match.priority) }}>
                    {match.priority}
                  </span>
                </div>
                <p className="admin-match-requirement">Requires: {match.type} {match.requirement}</p>
                <div className="admin-match-footer">
                  <span className="admin-match-time">Requested {match.time}</span>
                  <button className="admin-review-btn">Review Match</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="admin-section">
        <h2>Performance Metrics</h2>
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

      {/* Workload Distribution */}
      <div className="admin-section">
        <h2>Workload Distribution by Service Type</h2>
        <div className="admin-donut-chart">
          <div className="admin-donut">
            <div className="admin-donut-segment" style={{ '--segment-color': '#8b5cf6', '--segment-percent': '35%' }}></div>
            <div className="admin-donut-center">
              <span className="admin-donut-total">100%</span>
            </div>
          </div>
          <div className="admin-donut-legend">
            <div className="admin-legend-item"><span className="admin-legend-color" style={{ backgroundColor: '#8b5cf6' }}></span>Administrative - 35%</div>
            <div className="admin-legend-item"><span className="admin-legend-color" style={{ backgroundColor: '#3b82f6' }}></span>Executive - 28%</div>
            <div className="admin-legend-item"><span className="admin-legend-color" style={{ backgroundColor: '#22c55e' }}></span>Data & Analytics - 22%</div>
            <div className="admin-legend-item"><span className="admin-legend-color" style={{ backgroundColor: '#f59e0b' }}></span>Marketing - 15%</div>
          </div>
        </div>
      </div>

      {/* Top Performers & Recent Activity */}
      <div className="admin-grid-2">
        <div className="admin-card">
          <h3>Top Performing Assistants</h3>
          <div className="admin-performers-list">
            {topPerformers.map((performer, index) => (
              <div key={index} className="admin-performer-item">
                <span className="admin-performer-rank">{performer.rank}</span>
                <div className="admin-performer-avatar">{performer.name.split(' ').map(w => w[0]).join('')}</div>
                <div className="admin-performer-info">
                  <span className="admin-performer-name">{performer.name}</span>
                  <span className="admin-performer-role">{performer.role}</span>
                </div>
                <span className="admin-performer-rating">{performer.rating}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="admin-card">
          <h3>Recent Activity</h3>
          <div className="admin-activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="admin-activity-item">
                <div className="admin-activity-icon" style={{ backgroundColor: `${activity.color}15`, color: activity.color }}>
                  <Icon name={activity.icon} size={16} />
                </div>
                <div className="admin-activity-content">
                  <span className="admin-activity-title">{activity.title}</span>
                  <span className="admin-activity-description">{activity.description}</span>
                </div>
                <span className="admin-activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <h2>Quick Actions</h2>
        <div className="admin-quick-actions">
          <button className="admin-quick-action">
            <div className="admin-quick-icon" style={{ backgroundColor: '#8b5cf6' }}>
              <Icon name="plus" size={24} color="#fff" />
            </div>
            <span>Add New Client</span>
          </button>
          <button className="admin-quick-action">
            <div className="admin-quick-icon" style={{ backgroundColor: '#3b82f6' }}>
              <Icon name="users" size={24} color="#fff" />
            </div>
            <span>Create Assignment</span>
          </button>
          <button className="admin-quick-action">
            <div className="admin-quick-icon" style={{ backgroundColor: '#22c55e' }}>
              <Icon name="invoice" size={24} color="#fff" />
            </div>
            <span>Generate Invoice</span>
          </button>
          <button className="admin-quick-action">
            <div className="admin-quick-icon" style={{ backgroundColor: '#f59e0b' }}>
              <Icon name="chart" size={24} color="#fff" />
            </div>
            <span>View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
