import { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-plugin-data-ownership-guard')
      .service('service')
      .getWelcomeMessage();
  },

  async getRoutes(ctx) {
    try {
      const routes = await strapi
        .plugin('strapi-plugin-data-ownership-guard')
        .service('service')
        .getRoutes();

      ctx.body = routes;
    } catch (error) {
      console.log('error of get routes:', error);
      ctx.body = { error: 'Failed to fetch routes' };
    }
  },

  async assignPolicyToRoute(ctx) {
    const { path, method, handler } = ctx.request.body;

    try {
      await strapi
        .plugin('strapi-plugin-data-ownership-guard')
        .service('service')
        .createProtectedRoute({
          path,
          method,
          handler,
        });

      ctx.status = 201;
    } catch (error) {
      console.log('error of assign policy to route:', error);

      ctx.body = { error: 'Failed to assign policy to route' };
    }
  },

  async getSelectedApis(ctx) {
    try {
      const apis = await strapi
        .plugin('strapi-plugin-data-ownership-guard')
        .service('service')
        .getProtectedRoutes();

      ctx.body = apis;
    } catch (error) {
      console.log('error of get selected apis:', error);
      ctx.body = { error: 'Failed to get selected apis' };
    }
  },

  async deleteProtectedRoute(ctx) {
    const { id } = ctx.params;

    try {
      await strapi
        .plugin('strapi-plugin-data-ownership-guard')
        .service('service')
        .deleteProtectedRoute(id);

      ctx.status = 200;
    } catch (error) {
      console.log('error of delete protected route:', error);

      ctx.body = { error: 'Failed to delete protected route' };
    }
  },
});

export default controller;
