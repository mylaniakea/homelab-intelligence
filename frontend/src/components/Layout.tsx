import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Server, Bot, Menu, X, Settings, FileText, Brain, Network, HardDrive, Clock, Plug } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Layout() {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Network, label: 'Environment', path: '/homelab' },
        { icon: Server, label: 'Servers', path: '/profiles' },
        { icon: HardDrive, label: 'Hardware', path: '/hardware' },
        { icon: Plug, label: 'Plugins', path: '/plugins' },
        { icon: Bot, label: 'Intelligence', path: '/ai' },
        { icon: FileText, label: 'Reports', path: '/reports' },
        { icon: Brain, label: 'Knowledge', path: '/knowledge' },
        { icon: Clock, label: 'Automations', path: '/automations' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 240 : 80 }}
                className="bg-card border-r border-border hidden md:flex flex-col relative z-20"
            >
                <div className="p-4 flex items-center justify-between h-16 border-b border-border">
                    <span className={cn("font-bold text-xl truncate", !isSidebarOpen && "hidden")}>
                        HomelabAI
                    </span>
                    <button onClick={toggleSidebar} className="p-1 hover:bg-muted rounded" title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}>
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 p-2 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon size={20} />
                                {isSidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative z-10">
                <header className="h-16 border-b border-border flex items-center px-6 bg-card/50 backdrop-blur sticky top-0 md:hidden">
                    <span className="font-bold text-lg">HomelabAI</span>
                </header>
                <div className="p-6 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
