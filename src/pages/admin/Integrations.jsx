import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Integration provider configurations
const INTEGRATION_PROVIDERS = {
  google: {
    name: 'Google Workspace',
    description: 'Connect Gmail, Google Calendar, and Google Drive for seamless productivity.',
    icon: 'google',
    color: '#4285F4',
    features: ['Email Integration', 'Calendar Sync', 'Drive Storage'],
    category: 'productivity',
    oauthUrl: '/api/integrations/google/oauth',
    configFields: [
      { key: 'syncCalendar', label: 'Sync Calendar Events', type: 'toggle', default: true },
      { key: 'syncEmail', label: 'Sync Email', type: 'toggle', default: true },
      { key: 'syncDrive', label: 'Sync Drive Files', type: 'toggle', default: false }
    ]
  },
  microsoft: {
    name: 'Microsoft 365',
    description: 'Integrate Outlook, Teams, and OneDrive for enterprise collaboration.',
    icon: 'microsoft',
    color: '#00A4EF',
    features: ['Outlook Email', 'Teams Meetings', 'OneDrive Storage'],
    category: 'productivity',
    oauthUrl: '/api/integrations/microsoft/oauth',
    configFields: [
      { key: 'syncOutlook', label: 'Sync Outlook Calendar', type: 'toggle', default: true },
      { key: 'syncTeams', label: 'Enable Teams Integration', type: 'toggle', default: true }
    ]
  },
  zoom: {
    name: 'Zoom',
    description: 'Schedule and manage video meetings directly from the platform.',
    icon: 'video',
    color: '#2D8CFF',
    features: ['Video Meetings', 'Meeting Recording', 'Calendar Integration'],
    category: 'communication',
    oauthUrl: '/api/integrations/zoom/oauth',
    configFields: [
      { key: 'autoRecord', label: 'Auto-record Meetings', type: 'toggle', default: false },
      { key: 'waitingRoom', label: 'Enable Waiting Room', type: 'toggle', default: true }
    ]
  },
  slack: {
    name: 'Slack',
    description: 'Send notifications and updates to your Slack workspace.',
    icon: 'message',
    color: '#4A154B',
    features: ['Channel Notifications', 'Direct Messages', 'Bot Integration'],
    category: 'communication',
    oauthUrl: '/api/integrations/slack/oauth',
    configFields: [
      { key: 'defaultChannel', label: 'Default Channel', type: 'text', placeholder: '#general' },
      { key: 'notifyNewTasks', label: 'Notify on New Tasks', type: 'toggle', default: true },
      { key: 'notifyCompletions', label: 'Notify on Completions', type: 'toggle', default: true }
    ]
  },
  stripe: {
    name: 'Stripe',
    description: 'Process payments and manage billing for your clients.',
    icon: 'creditCard',
    color: '#635BFF',
    features: ['Payment Processing', 'Invoicing', 'Subscription Management'],
    category: 'billing',
    requiresApiKey: true,
    configFields: [
      { key: 'publishableKey', label: 'Publishable Key', type: 'text', placeholder: 'pk_live_...' },
      { key: 'secretKey', label: 'Secret Key', type: 'password', placeholder: 'sk_live_...' },
      { key: 'webhookSecret', label: 'Webhook Secret', type: 'password', placeholder: 'whsec_...' },
      { key: 'testMode', label: 'Test Mode', type: 'toggle', default: false }
    ]
  },
  twilio: {
    name: 'Twilio',
    description: 'Enable SMS notifications and voice calls for your assistants.',
    icon: 'phone',
    color: '#F22F46',
    features: ['SMS Notifications', 'Voice Calls', 'WhatsApp Messages'],
    category: 'communication',
    requiresApiKey: true,
    configFields: [
      { key: 'accountSid', label: 'Account SID', type: 'text', placeholder: 'AC...' },
      { key: 'authToken', label: 'Auth Token', type: 'password', placeholder: 'Auth Token' },
      { key: 'phoneNumber', label: 'Twilio Phone Number', type: 'text', placeholder: '+1234567890' },
      { key: 'enableSms', label: 'Enable SMS', type: 'toggle', default: true },
      { key: 'enableVoice', label: 'Enable Voice Calls', type: 'toggle', default: false }
    ]
  },
  zapier: {
    name: 'Zapier',
    description: 'Automate workflows by connecting to 5000+ apps.',
    icon: 'integration',
    color: '#FF4A00',
    features: ['Workflow Automation', 'App Connections', 'Custom Triggers'],
    category: 'automation',
    requiresWebhook: true,
    configFields: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'https://hooks.zapier.com/...' },
      { key: 'triggerNewTask', label: 'Trigger on New Task', type: 'toggle', default: true },
      { key: 'triggerNewClient', label: 'Trigger on New Client', type: 'toggle', default: true },
      { key: 'triggerInvoice', label: 'Trigger on Invoice', type: 'toggle', default: false }
    ]
  },
  calendly: {
    name: 'Calendly',
    description: 'Allow clients to schedule appointments with available assistants.',
    icon: 'calendar',
    color: '#006BFF',
    features: ['Appointment Scheduling', 'Calendar Sync', 'Automated Reminders'],
    category: 'scheduling',
    requiresApiKey: true,
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Your Calendly API key' },
      { key: 'defaultEventType', label: 'Default Event Type', type: 'text', placeholder: 'consultation' },
      { key: 'autoAssign', label: 'Auto-assign to Assistants', type: 'toggle', default: true }
    ]
  },
  quickbooks: {
    name: 'QuickBooks',
    description: 'Sync invoices and financial data with QuickBooks Online.',
    icon: 'invoice',
    color: '#2CA01C',
    features: ['Invoice Sync', 'Expense Tracking', 'Financial Reports'],
    category: 'billing',
    oauthUrl: '/api/integrations/quickbooks/oauth',
    configFields: [
      { key: 'autoSyncInvoices', label: 'Auto-sync Invoices', type: 'toggle', default: true },
      { key: 'syncExpenses', label: 'Sync Expenses', type: 'toggle', default: false }
    ]
  },
  aws: {
    name: 'Amazon S3',
    description: 'Store and manage files securely in Amazon S3 buckets.',
    icon: 'cloud',
    color: '#FF9900',
    features: ['File Storage', 'Document Backup', 'Secure Access'],
    category: 'storage',
    requiresApiKey: true,
    configFields: [
      { key: 'accessKeyId', label: 'Access Key ID', type: 'text', placeholder: 'AKIA...' },
      { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', placeholder: 'Secret Key' },
      { key: 'bucket', label: 'S3 Bucket Name', type: 'text', placeholder: 'my-bucket' },
      { key: 'region', label: 'AWS Region', type: 'select', options: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'] }
    ]
  }
};

const CATEGORIES = {
  all: 'All Integrations',
  productivity: 'Productivity',
  communication: 'Communication',
  billing: 'Billing & Payments',
  automation: 'Automation',
  scheduling: 'Scheduling',
  storage: 'Storage'
};

const Integrations = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [configValues, setConfigValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogsModal, setShowLogsModal] = useState(false);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/integrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setIntegrations(data);
      }
    } catch (error) {
      console.error('Error fetching integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIntegrationStatus = (provider) => {
    const integration = integrations.find(i => i.provider === provider);
    return integration?.status || 'not_connected';
  };

  const getIntegrationConfig = (provider) => {
    const integration = integrations.find(i => i.provider === provider);
    return integration?.settings || {};
  };

  const handleConnect = async (provider) => {
    const config = INTEGRATION_PROVIDERS[provider];

    if (config.oauthUrl) {
      // Redirect to OAuth flow
      window.location.href = `${API_URL}/integrations/${provider}/oauth?redirect=${encodeURIComponent(window.location.href)}`;
    } else {
      // Show configuration modal for API key integrations
      setSelectedIntegration(provider);
      setConfigValues(getIntegrationConfig(provider));
      setShowConfigModal(true);
    }
  };

  const handleConfigure = (provider) => {
    setSelectedIntegration(provider);
    setConfigValues(getIntegrationConfig(provider));
    setShowConfigModal(true);
  };

  const handleDisconnect = async (provider) => {
    if (!confirm(`Are you sure you want to disconnect ${INTEGRATION_PROVIDERS[provider].name}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/integrations/${provider}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setIntegrations(prev => prev.filter(i => i.provider !== provider));
      }
    } catch (error) {
      console.error('Error disconnecting integration:', error);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/integrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          provider: selectedIntegration,
          settings: configValues,
          credentials: configValues,
          status: 'active'
        })
      });

      if (response.ok) {
        await fetchIntegrations();
        setShowConfigModal(false);
        setSelectedIntegration(null);
        setConfigValues({});
      }
    } catch (error) {
      console.error('Error saving integration:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/integrations/${selectedIntegration}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(configValues)
      });

      const data = await response.json();
      setConnectionStatus(response.ok ? 'success' : 'error');
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleViewLogs = async (provider) => {
    setSelectedIntegration(provider);
    setShowLogsModal(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/integrations/${provider}/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
    }
  };

  const filteredProviders = Object.entries(INTEGRATION_PROVIDERS).filter(([key, config]) => {
    const matchesCategory = selectedCategory === 'all' || config.category === selectedCategory;
    const matchesSearch = config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         config.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const connectedCount = integrations.filter(i => i.status === 'active').length;

  // Configuration Modal
  const ConfigModal = () => {
    const config = INTEGRATION_PROVIDERS[selectedIntegration];
    if (!config) return null;

    return (
      <div className="integration-modal-overlay" onClick={() => setShowConfigModal(false)}>
        <div className="integration-modal" onClick={e => e.stopPropagation()}>
          <div className="integration-modal-header">
            <div className="integration-modal-title">
              <div className="integration-modal-icon" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                <Icon name={config.icon} size={24} />
              </div>
              <div>
                <h2>Configure {config.name}</h2>
                <p>{config.description}</p>
              </div>
            </div>
            <button className="integration-modal-close" onClick={() => setShowConfigModal(false)}>
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="integration-modal-body">
            {config.configFields.map(field => (
              <div key={field.key} className="integration-form-field">
                <label>{field.label}</label>
                {field.type === 'toggle' ? (
                  <label className="integration-toggle">
                    <input
                      type="checkbox"
                      checked={configValues[field.key] ?? field.default ?? false}
                      onChange={(e) => setConfigValues({ ...configValues, [field.key]: e.target.checked })}
                    />
                    <span className="integration-toggle-slider"></span>
                  </label>
                ) : field.type === 'select' ? (
                  <select
                    value={configValues[field.key] || ''}
                    onChange={(e) => setConfigValues({ ...configValues, [field.key]: e.target.value })}
                    className="integration-input"
                  >
                    <option value="">Select...</option>
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === 'password' ? 'password' : 'text'}
                    value={configValues[field.key] || ''}
                    onChange={(e) => setConfigValues({ ...configValues, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="integration-input"
                  />
                )}
              </div>
            ))}

            {connectionStatus && (
              <div className={`integration-connection-status ${connectionStatus}`}>
                <Icon name={connectionStatus === 'success' ? 'checkCircle' : 'warning'} size={16} />
                {connectionStatus === 'success' ? 'Connection successful!' : 'Connection failed. Please check your credentials.'}
              </div>
            )}
          </div>

          <div className="integration-modal-footer">
            <button className="integration-btn-secondary" onClick={handleTestConnection} disabled={testingConnection}>
              {testingConnection ? 'Testing...' : 'Test Connection'}
            </button>
            <div className="integration-modal-actions">
              <button className="integration-btn-secondary" onClick={() => setShowConfigModal(false)}>
                Cancel
              </button>
              <button className="integration-btn-primary" onClick={handleSaveConfig} disabled={saving}>
                {saving ? 'Saving...' : 'Save & Connect'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Logs Modal
  const LogsModal = () => {
    const config = INTEGRATION_PROVIDERS[selectedIntegration];
    if (!config) return null;

    return (
      <div className="integration-modal-overlay" onClick={() => setShowLogsModal(false)}>
        <div className="integration-modal integration-modal-lg" onClick={e => e.stopPropagation()}>
          <div className="integration-modal-header">
            <div className="integration-modal-title">
              <h2>{config.name} Activity Logs</h2>
            </div>
            <button className="integration-modal-close" onClick={() => setShowLogsModal(false)}>
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="integration-modal-body">
            {logs.length > 0 ? (
              <div className="integration-logs">
                {logs.map((log, index) => (
                  <div key={index} className={`integration-log-item ${log.level}`}>
                    <div className="integration-log-time">{new Date(log.timestamp).toLocaleString()}</div>
                    <div className="integration-log-message">{log.message}</div>
                    <span className={`integration-log-level ${log.level}`}>{log.level}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="integration-empty-logs">
                <Icon name="document" size={48} />
                <p>No activity logs available</p>
              </div>
            )}
          </div>

          <div className="integration-modal-footer">
            <button className="integration-btn-secondary" onClick={() => setShowLogsModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="integration-loading">
        <div className="integration-spinner"></div>
        <p>Loading integrations...</p>
      </div>
    );
  }

  return (
    <div className="integrations-page">
      {/* Header */}
      <div className="integrations-header">
        <div className="integrations-header-left">
          <h1>Integrations</h1>
          <p>Connect your favorite tools and services to streamline your workflow.</p>
        </div>
        <div className="integrations-header-right">
          <div className="integrations-stats">
            <div className="integrations-stat">
              <span className="integrations-stat-value">{connectedCount}</span>
              <span className="integrations-stat-label">Connected</span>
            </div>
            <div className="integrations-stat">
              <span className="integrations-stat-value">{Object.keys(INTEGRATION_PROVIDERS).length}</span>
              <span className="integrations-stat-label">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="integrations-filters">
        <div className="integrations-search">
          <Icon name="search" size={18} />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="integrations-categories">
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              className={`integrations-category-btn ${selectedCategory === key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Connected Integrations */}
      {integrations.filter(i => i.status === 'active').length > 0 && (
        <div className="integrations-section">
          <h2 className="integrations-section-title">
            <Icon name="checkCircle" size={20} color="#22c55e" />
            Connected Integrations
          </h2>
          <div className="integrations-grid">
            {integrations.filter(i => i.status === 'active').map(integration => {
              const config = INTEGRATION_PROVIDERS[integration.provider];
              if (!config) return null;

              return (
                <div key={integration.id} className="integration-card connected">
                  <div className="integration-card-header">
                    <div className="integration-card-icon" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                      <Icon name={config.icon} size={24} />
                    </div>
                    <div className="integration-card-status connected">
                      <span className="integration-status-dot"></span>
                      Connected
                    </div>
                  </div>
                  <div className="integration-card-body">
                    <h3>{config.name}</h3>
                    <p>{config.description}</p>
                    <div className="integration-features">
                      {config.features.slice(0, 2).map((feature, i) => (
                        <span key={i} className="integration-feature">{feature}</span>
                      ))}
                    </div>
                  </div>
                  <div className="integration-card-actions">
                    <button className="integration-action-btn" onClick={() => handleConfigure(integration.provider)}>
                      <Icon name="settings" size={16} />
                      Configure
                    </button>
                    <button className="integration-action-btn" onClick={() => handleViewLogs(integration.provider)}>
                      <Icon name="document" size={16} />
                      Logs
                    </button>
                    <button className="integration-action-btn danger" onClick={() => handleDisconnect(integration.provider)}>
                      <Icon name="close" size={16} />
                      Disconnect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      <div className="integrations-section">
        <h2 className="integrations-section-title">
          <Icon name="plus" size={20} color="#6366f1" />
          Available Integrations
        </h2>
        <div className="integrations-grid">
          {filteredProviders.map(([key, config]) => {
            const status = getIntegrationStatus(key);
            if (status === 'active') return null;

            return (
              <div key={key} className="integration-card">
                <div className="integration-card-header">
                  <div className="integration-card-icon" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                    <Icon name={config.icon} size={24} />
                  </div>
                  <span className="integration-card-category">{CATEGORIES[config.category]}</span>
                </div>
                <div className="integration-card-body">
                  <h3>{config.name}</h3>
                  <p>{config.description}</p>
                  <div className="integration-features">
                    {config.features.slice(0, 2).map((feature, i) => (
                      <span key={i} className="integration-feature">{feature}</span>
                    ))}
                    {config.features.length > 2 && (
                      <span className="integration-feature-more">+{config.features.length - 2} more</span>
                    )}
                  </div>
                </div>
                <div className="integration-card-actions">
                  <button className="integration-btn-primary" onClick={() => handleConnect(key)}>
                    <Icon name="plus" size={16} />
                    Connect
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProviders.filter(([key]) => getIntegrationStatus(key) !== 'active').length === 0 && (
          <div className="integrations-empty">
            <Icon name="search" size={48} />
            <h3>No integrations found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showConfigModal && <ConfigModal />}
      {showLogsModal && <LogsModal />}
    </div>
  );
};

export default Integrations;
