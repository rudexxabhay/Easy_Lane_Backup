const publicRoutes = new Set([
  '/', '/home', '/book-demo', '/platform', '/platform/tms',
  '/platform/fleet-management', '/platform/control-tower', '/platform/live-tracking',
  '/platform/maintenance', '/platform/fuel-management', '/platform/tyre-management',
  '/platform/driver-management', '/platform/compliance', '/platform/bill-discounting',
  '/platform/vendor-payments', '/platform/invoice-management', '/client-dashboard',
  '/vendor-dashboard', '/driver-app', '/operations-dashboard', '/solutions', '/about-us',
  '/contact-us', '/careers', '/privacy-policy', '/resources', '/company', '/pricing',
]);

export function canHandleRoute(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  return publicRoutes.has(path) || path === '/admin' || path.startsWith('/admin/');
}
