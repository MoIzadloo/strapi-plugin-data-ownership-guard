import type { Core } from '@strapi/strapi';
import _ from 'lodash';

type RoutesType = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  handler: string;
  config: any;
}[];

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi Ownership Guard! 🚀';
  },

  getRoutes() {
    const routesMap: RoutesType = [];

    _.forEach(strapi?.apis, async (api, apiName: string) => {
      const routes = _.flatMap(api.routes, (route) => {
        if (_.has(route, 'routes')) {
          return route.routes;
        }

        return route;
      });

      if (routes.length === 0) {
        return;
      }

      const apiPrefix: string = strapi?.config.get('api.rest.prefix');

      const base = apiPrefix.endsWith('/') ? apiPrefix : `${apiPrefix}/`;

      routes.forEach((route: any) => {
        routesMap?.push({
          ...route,
          path: base?.slice(0, -1) + route.path,
        });
      });
    });

    return routesMap;
  },

  async getProtectedRoutes() {
    const routes = await strapi
      .query('plugin::strapi-plugin-data-ownership-guard.plugin-setting')
      .findMany();

    return routes;
  },

  async deleteProtectedRoute(id: number) {
    await strapi
      .query('plugin::strapi-plugin-data-ownership-guard.plugin-setting')
      .delete({ where: { id } });
  },

  async createProtectedRoute(route: any) {
    await strapi
      .query('plugin::strapi-plugin-data-ownership-guard.plugin-setting')
      .create({ data: route });
  },
});

export default service;
