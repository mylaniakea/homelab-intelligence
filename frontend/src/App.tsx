import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from './pages/Dashboard';
import Profiles from './pages/Profiles';
import Intelligence from './pages/Intelligence';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Knowledge from './pages/Knowledge';
import Homelab from './pages/Homelab';
import ServerHardware from './pages/ServerHardware';
import Automations from './pages/Automations';
import Plugins from './pages/Plugins';
import Thresholds from './pages/Thresholds';
import Alerts from './pages/Alerts';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ConfirmDialogProvider } from '@/contexts/ConfirmDialogContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <ConfirmDialogProvider>
                    <NotificationProvider>
                        <Router>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="homelab" element={<Homelab />} />
                                <Route path="profiles" element={<Profiles />} />
                                <Route path="hardware" element={<ServerHardware />} />
                                <Route path="plugins" element={<Plugins />} />
                                <Route path="ai" element={<Intelligence />} />
                                <Route path="reports" element={<Reports />} />
                                <Route path="knowledge" element={<Knowledge />} />
                                <Route path="thresholds" element={<Thresholds />} />
                                <Route path="alerts" element={<Alerts />} />
                                <Route path="automations" element={<Automations />} />
                                <Route path="settings" element={<Settings />} />
                            </Route>
                        </Routes>
                        </Router>
                    </NotificationProvider>
                </ConfirmDialogProvider>
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default App;