export default [
  {
    method: 'GET',
    path: '/get-routes',
    handler: 'controller.getRoutes',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/assign-policy-to-route',
    handler: 'controller.assignPolicyToRoute',
    config: { policies: [], auth: false },
  },
  {
    method: 'GET',
    path: '/get-selected-apis',
    handler: 'controller.getSelectedApis',
    config: { policies: [], auth: false },
  },
  {
    method: 'DELETE',
    path: '/delete-protected-route/:id',
    handler: 'controller.deleteProtectedRoute',
    config: { policies: [], auth: false },
  },
];
