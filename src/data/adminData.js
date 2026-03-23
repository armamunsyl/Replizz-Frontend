export const adminMenuItems = [
    {
        key: 'admin-header',
        label: 'ADMIN PANEL',
        isHeader: true,
    },
    {
        key: 'admin-overview',
        icon: 'home',
        label: 'Dashboard',
        navigable: true,
        path: '/admin',
    },
    {
        key: 'admin-users',
        icon: 'user',
        label: 'Users',
        navigable: true,
        path: '/admin/users',
    },
    {
        key: 'admin-analytics',
        icon: 'chart',
        label: 'Analytics',
        navigable: true,
        path: '/admin/analytics',
    },
    {
        key: 'admin-reports',
        icon: 'message',
        label: 'Reports',
        navigable: true,
        path: '/admin/reports',
    },
    {
        key: 'admin-pages',
        icon: 'facebook',
        label: 'Connected Pages',
        navigable: true,
        path: '/admin/pages',
    },
    {
        key: 'admin-divider',
        isDivider: true,
    },
    {
        key: 'user-header',
        label: 'USER DASHBOARD',
        isHeader: true,
    },
    {
        key: 'admin-go-dashboard',
        icon: 'checkCircle',
        label: 'Go to Dashboard',
        navigable: true,
        path: '/overview',
    },
]
