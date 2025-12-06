import { ReactNode } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                </div>
                <nav className="mt-4">
                    <a href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                        Home
                    </a>
                    <a href="/dashboard/analytics" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                        Analytics
                    </a>
                    <a href="/dashboard/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                        Settings
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <h2 className="text-xl font-semibold text-gray-800">Welcome</h2>
                        <div className="flex items-center space-x-4">
                            <button className="text-gray-600 hover:text-gray-800">
                                Profile
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}