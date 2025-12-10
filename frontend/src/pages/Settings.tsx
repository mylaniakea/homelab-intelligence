
import { useEffect, useState } from 'react';
import { Save, Shield, Cpu, CircuitBoard, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/api/client';
import { cn } from '@/lib/utils';
import { useNotification } from '@/contexts/NotificationContext';

interface ProviderConfig {
    url?: string;
    api_key?: string;
    enabled: boolean;
    models?: string[]; // Add models array
    active_model?: string; // Add active_model
}

interface SettingsData {
    id: number;
    providers: {
        [key: string]: ProviderConfig; // Allow dynamic provider keys
    };
    active_model: string;
    primary_provider: string;
    fallback_provider: string;
    system_prompt?: string; // Make system_prompt optional
}

export default function Settings() {
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const settingsRes = await api.get('/settings/');
            const modelsRes = await api.get('/ai/models');
            
            const fetchedSettings = settingsRes.data;
            const availableModels = modelsRes.data.models;

            // Merge available models into provider configs
            for (const providerName in availableModels) {
                if (fetchedSettings.providers[providerName]) {
                    fetchedSettings.providers[providerName].models = availableModels[providerName];
                }
            }
            setSettings(fetchedSettings);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch settings or models", error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            await api.put('/settings/', settings);
            showNotification("Settings saved successfully", "success");
        } catch (error) {
            console.error("Failed to save settings", error);
            showNotification("Failed to save settings", "error");
        } finally {
            setSaving(false);
        }
    };

    const updateProvider = (provider: string, field: string, value: any) => {
        if (!settings) return;
        setSettings({
            ...settings,
            providers: {
                ...settings.providers,
                [provider]: {
                    ...settings.providers[provider as keyof typeof settings.providers],
                    [field]: value
                }
            }
        });
    };

    const updateSetting = (field: string, value: any) => {
        if (!settings) return;
        setSettings({ ...settings, [field]: value });
    };

    if (loading) return <div className="p-8">Loading settings...</div>;
    if (!settings) return <div className="p-8">Error loading settings.</div>;

    const providers = ['ollama', 'google', 'openai', 'anthropic'];

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Intelligence Settings</h1>
                    <p className="text-muted-foreground">Configure AI providers and orchestration logic</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Global Config */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 bg-card border border-border p-6 rounded-xl space-y-4"
                >
                    <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                        <CircuitBoard className="text-primary" />
                        <h2 className="text-xl font-semibold">Orchestration</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Left Column: Primary and Fallback Providers */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Primary Provider</label>
                                <select
                                    value={settings.primary_provider}
                                    onChange={(e) => setSettings({ ...settings, primary_provider: e.target.value })}
                                    className="w-full bg-background border border-border rounded-md px-3 py-2"
                                >
                                    {providers.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Fallback Provider</label>
                                <select
                                    value={settings.fallback_provider}
                                    onChange={(e) => updateSetting('fallback_provider', e.target.value)}
                                    className="w-full bg-background border border-border rounded-md px-3 py-2"
                                >
                                    {providers.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                                </select>
                            </div>
                        </div>
                        {/* Right Column: Active Model */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Active Model</label>
                            <select
                                value={settings.active_model || ''}
                                onChange={(e) => updateSetting('active_model', e.target.value)}
                                className="w-full bg-background border border-border rounded-md px-3 py-2"
                            >
                                <option value="">Default (Provider specific)</option>
                                {Object.values(settings.providers).flatMap(p => p.enabled && p.models ? p.models.map(model => ({
                                    provider: Object.keys(settings.providers).find(key => settings.providers[key] === p),
                                    model: model
                                })) : []).map((item, index) => (
                                    <option key={index} value={item.model}>
                                        {item.provider.toUpperCase()}: {item.model}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* System Prompt (Agent Brain) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 bg-card border border-border p-6 rounded-xl space-y-4"
                >
                    <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                        <Brain className="text-primary" />
                        <h2 className="text-xl font-semibold">Agent Personality & Context</h2>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">System Prompt</label>
                        <textarea
                            value={(settings as any).system_prompt || ""}
                            onChange={(e) => updateSetting('system_prompt', e.target.value)}
                            className="w-full bg-background border border-border rounded-md px-3 py-2 min-h-[150px] font-mono text-sm"
                            placeholder="You are a helpful assistant..."
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            The core instructions for your Agent. It will also receive Server Profiles and Knowledge Base items dynamically.
                        </p>
                    </div>
                </motion.div>

                {/* Provider Cards */}
                {providers.map((provider, i) => {
                    const config = settings.providers[provider as keyof typeof settings.providers];
                    return (
                        <motion.div
                            key={provider}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "bg-card border p-6 rounded-xl space-y-4 transition-colors",
                                config.enabled ? "border-primary/50" : "border-border opacity-75"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Shield size={20} className={config.enabled ? "text-primary" : "text-muted-foreground"} />
                                    <h3 className="font-bold capitalize">{provider}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-muted-foreground">Enabled</label>
                                    <input
                                        type="checkbox"
                                        checked={config.enabled}
                                        onChange={(e) => updateProvider(provider, 'enabled', e.target.checked)}
                                        className="h-4 w-4 accent-primary"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {provider === 'ollama' ? (
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-muted-foreground">Base URL</label>
                                        <input
                                            type="text"
                                            value={config.url}
                                            onChange={(e) => updateProvider(provider, 'url', e.target.value)}
                                            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono"
                                            disabled={!config.enabled}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-muted-foreground">API Key</label>
                                        <input
                                            type="password"
                                            value={config.api_key}
                                            onChange={(e) => updateProvider(provider, 'api_key', e.target.value)}
                                            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono"
                                            placeholder="sk-..."
                                            disabled={!config.enabled}
                                        />
                                    </div>
                                )}
                                {config.enabled && config.models && config.models.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-muted-foreground">Active Model</label>
                                        <select
                                            value={config.active_model || ''}
                                            onChange={(e) => updateProvider(provider, 'active_model', e.target.value)}
                                            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono"
                                        >
                                            {config.models.map(model => (
                                                <option key={model} value={model}>
                                                    {model}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}


            </div>
        </div>
    );
}
