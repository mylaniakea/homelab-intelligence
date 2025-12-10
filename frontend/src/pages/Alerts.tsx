import React, { useEffect, useState } from 'react';
import api from '@/api/client';
import { useNotification } from '@/contexts/NotificationContext';
import { Bell, CheckCircle, XCircle, AlertTriangle, Settings, Mail, MessageCircle, Smartphone, Hash, Server, Link } from 'lucide-react';

interface Alert {
  id: number;
  rule_id: number;
  server_id: number;
  severity: string;
  message: string;
  metric_value: number;
  triggered_at: string;
  acknowledged: boolean;
  acknowledged_at: string | null;
  resolved: boolean;
  resolved_at: string | null;
}

interface AlertChannel {
  id?: number;
  name: string;
  channel_type: string;
  enabled: boolean;
  config: Record<string, any>;
}

interface ChannelDefinition {
  name: string;
  description: string;
  icon: string;
  category: string;
  config_schema: Record<string, any>;
  setup_instructions?: string;
}

const iconMap: Record<string, any> = {
  Mail,
  MessageCircle,
  Bell,
  MessageSquare: MessageCircle,
  Hash,
  Smartphone,
  Server,
  Link,
};

const Alerts: React.FC = () => {
  const { showNotification } = useNotification();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [channels, setChannels] = useState<AlertChannel[]>([]);
  const [availableChannels, setAvailableChannels] = useState<Record<string, ChannelDefinition>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'alerts' | 'channels'>('alerts');
  const [editingChannel, setEditingChannel] = useState<AlertChannel | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);

  useEffect(() => {
    fetchAlerts();
    fetchChannels();
    fetchAvailableChannels();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts/?limit=100');
      setAlerts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch alerts', error);
      showNotification('Failed to load alerts.', 'error');
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
    try {
      const res = await api.get('/alerts/channels/');
      setChannels(res.data);
    } catch (error) {
      console.error('Failed to fetch channels', error);
    }
  };

  const fetchAvailableChannels = async () => {
    try {
      const res = await api.get('/alerts/channels/available');
      setAvailableChannels(res.data);
    } catch (error) {
      console.error('Failed to fetch available channels', error);
    }
  };

  const handleAcknowledge = async (alertId: number) => {
    try {
      await api.post(`/alerts/${alertId}/acknowledge`);
      showNotification('Alert acknowledged.', 'success');
      fetchAlerts();
    } catch (error) {
      console.error('Failed to acknowledge alert', error);
      showNotification('Failed to acknowledge alert.', 'error');
    }
  };

  const handleResolve = async (alertId: number) => {
    try {
      await api.post(`/alerts/${alertId}/resolve`);
      showNotification('Alert resolved.', 'success');
      fetchAlerts();
    } catch (error) {
      console.error('Failed to resolve alert', error);
      showNotification('Failed to resolve alert.', 'error');
    }
  };

  const handleConfigureChannel = (channelType: string) => {
    const channelDef = availableChannels[channelType];
    const existingChannel = channels.find(c => c.channel_type === channelType);

    if (existingChannel) {
      setEditingChannel(existingChannel);
    } else {
      setEditingChannel({
        name: channelDef.name,
        channel_type: channelType,
        enabled: false,
        config: {},
      });
    }
    setIsConfiguring(true);
  };

  const handleSaveChannel = async () => {
    if (!editingChannel) return;

    try {
      if (editingChannel.id) {
        await api.put(`/alerts/channels/${editingChannel.id}`, {
          enabled: editingChannel.enabled,
          config: editingChannel.config,
        });
        showNotification('Channel updated successfully!', 'success');
      } else {
        await api.post('/alerts/channels/', editingChannel);
        showNotification('Channel configured successfully!', 'success');
      }
      setEditingChannel(null);
      setIsConfiguring(false);
      fetchChannels();
    } catch (error) {
      console.error('Failed to save channel', error);
      showNotification('Failed to save channel.', 'error');
    }
  };

  const handleToggleChannel = async (channel: AlertChannel) => {
    try {
      await api.put(`/alerts/channels/${channel.id}`, { enabled: !channel.enabled });
      fetchChannels();
    } catch (error) {
      console.error('Failed to toggle channel', error);
      showNotification('Failed to toggle channel.', 'error');
    }
  };

  const handleTestChannel = async (channelId: number) => {
    try {
      await api.post(`/alerts/channels/${channelId}/test`);
      showNotification('Test alert sent!', 'success');
    } catch (error) {
      console.error('Failed to send test alert', error);
      showNotification('Failed to send test alert.', 'error');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/20';
      case 'warning': return 'text-yellow-500 bg-yellow-500/20';
      case 'info': return 'text-blue-500 bg-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const criticalCount = unresolvedAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = unresolvedAlerts.filter(a => a.severity === 'warning').length;

  if (loading) return <div className="p-10 text-center">Loading Alerts...</div>;

  return (
    <div className="space-y-8 p-6 bg-background text-foreground min-h-screen">
      {/* Header with Stats */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
          <p className="text-muted-foreground">Monitor alerts and configure notification channels.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-card border border-border rounded-lg px-4 py-2">
            <div className="text-sm text-muted-foreground">Critical</div>
            <div className="text-2xl font-bold text-red-500">{criticalCount}</div>
          </div>
          <div className="bg-card border border-border rounded-lg px-4 py-2">
            <div className="text-sm text-muted-foreground">Warning</div>
            <div className="text-2xl font-bold text-yellow-500">{warningCount}</div>
          </div>
          <div className="bg-card border border-border rounded-lg px-4 py-2">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">{unresolvedAlerts.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'alerts' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Active Alerts ({unresolvedAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'channels' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Notification Channels
        </button>
      </div>

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {unresolvedAlerts.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
              <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium">All Clear!</p>
              <p>No active alerts at the moment.</p>
            </div>
          ) : (
            unresolvedAlerts.map(alert => (
              <div key={alert.id} className={`bg-card border-2 rounded-xl p-6 ${getSeverityColor(alert.severity).replace('text-', 'border-')}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className={getSeverityColor(alert.severity).split(' ')[0]} />
                      <span className={`text-sm font-bold px-2 py-1 rounded ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(alert.triggered_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-lg font-medium mb-1">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">Value: {alert.metric_value}</p>
                  </div>
                  <div className="flex gap-2">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 text-sm"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 text-sm"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Channels Tab (Plugin-like UI) */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          {isConfiguring && editingChannel && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Configure {editingChannel.name}</h3>
              {availableChannels[editingChannel.channel_type]?.setup_instructions && (
                <div className="bg-muted rounded-lg p-4 mb-4 text-sm whitespace-pre-line">
                  {availableChannels[editingChannel.channel_type].setup_instructions}
                </div>
              )}
              <div className="space-y-4">
                {Object.entries(availableChannels[editingChannel.channel_type]?.config_schema || {}).map(([key, schema]: [string, any]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-2">{schema.label}</label>
                    {schema.type === 'boolean' ? (
                      <input
                        type="checkbox"
                        checked={editingChannel.config[key] !== undefined ? editingChannel.config[key] : schema.default}
                        onChange={(e) => setEditingChannel({
                          ...editingChannel,
                          config: { ...editingChannel.config, [key]: e.target.checked }
                        })}
                        className="w-4 h-4"
                      />
                    ) : schema.type === 'textarea' ? (
                      <textarea
                        className="w-full bg-input border border-border rounded-md px-3 py-2"
                        value={editingChannel.config[key] || ''}
                        onChange={(e) => setEditingChannel({
                          ...editingChannel,
                          config: { ...editingChannel.config, [key]: e.target.value }
                        })}
                        placeholder={schema.placeholder}
                        rows={4}
                      />
                    ) : (
                      <input
                        type={schema.type === 'password' ? 'password' : schema.type === 'number' ? 'number' : 'text'}
                        className="w-full bg-input border border-border rounded-md px-3 py-2"
                        value={editingChannel.config[key] || schema.default || ''}
                        onChange={(e) => setEditingChannel({
                          ...editingChannel,
                          config: { ...editingChannel.config, [key]: e.target.value }
                        })}
                        placeholder={schema.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSaveChannel}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Save Configuration
                </button>
                <button
                  onClick={() => { setEditingChannel(null); setIsConfiguring(false); }}
                  className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(availableChannels).map(([type, channelDef]) => {
              const configuredChannel = channels.find(c => c.channel_type === type);
              const IconComponent = iconMap[channelDef.icon] || Bell;

              return (
                <div key={type} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{channelDef.name}</h3>
                        <span className="text-xs text-muted-foreground">{channelDef.category}</span>
                      </div>
                    </div>
                    {configuredChannel && (
                      <span className={`text-xs px-2 py-1 rounded ${configuredChannel.enabled ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                        {configuredChannel.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{channelDef.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfigureChannel(type)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm"
                    >
                      <Settings size={16} />
                      {configuredChannel ? 'Configure' : 'Setup'}
                    </button>
                    {configuredChannel && (
                      <>
                        <button
                          onClick={() => handleToggleChannel(configuredChannel)}
                          className={`px-3 py-2 rounded-md text-sm ${
                            configuredChannel.enabled
                              ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                              : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                          }`}
                        >
                          {configuredChannel.enabled ? 'Disable' : 'Enable'}
                        </button>
                        {configuredChannel.enabled && (
                          <button
                            onClick={() => handleTestChannel(configuredChannel.id!)}
                            className="px-3 py-2 rounded-md bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 text-sm"
                          >
                            Test
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
