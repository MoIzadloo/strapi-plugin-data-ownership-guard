/**
 * `isOwner` middleware
 */

import type { Core } from '@strapi/strapi';
import qs from 'qs';

const PUBLIC_ROUTE_PREFIXES = ['/api/auth', '/api/connect', '/admin'];

function removeSOrES(word: string) {
  if (word?.endsWith('ies')) {
    return word.slice(0, -3) + 'y';
  }
  if (word?.endsWith('es')) {
    return word.slice(0, -2);
  }
  if (word?.endsWith('s')) {
    return word.slice(0, -1);
  }
  return word;
}

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: any) => {
    const { request } = ctx;
    let user: any;

    const fullURL = new URL('https://example.com' + ctx?.request?.url);

    if (PUBLIC_ROUTE_PREFIXES.some((prefix) => fullURL.pathname.startsWith(prefix))) {
      await next();
      return;
    }

    const protectedAPIs = await strapi
      .query('plugin::strapi-plugin-data-ownership-guard.plugin-setting')
      .findMany();

    const urlPath = fullURL.pathname?.split('/')?.filter(Boolean);

    if (!urlPath?.length || urlPath.length < 2) {
      await next();
      return;
    }

    const path =
      urlPath?.length > 2 ? `/${urlPath[0]}/${urlPath[1]}/:id` : `/${urlPath[0]}/${urlPath[1]}`;
    const method = ctx?.request?.method;
    const params = urlPath?.length > 2 ? { id: urlPath[2] } : null;

    const uid = `api::${removeSOrES(urlPath[1])}.${removeSOrES(urlPath[1])}`;

    if (
      protectedAPIs.length === 0 ||
      protectedAPIs?.filter((api: any) => api.path === path && api.method === method).length === 0
    ) {
      await next();
      return;
    }

    const token = ctx?.request?.headers?.authorization?.split(' ')[1];

    // @ts-ignore
    if (strapi?.firebase !== undefined) {
      // @ts-ignore
      const firebaseResponse = await strapi?.firebase.auth().verifyIdToken(token);

      user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email: firebaseResponse.email },
        select: ['id'],
      });
    } else {
      const payload = await strapi?.plugins?.['users-permissions']?.services?.jwt?.verify(token);

      user = { id: payload?.id };
    }

    if (!user?.id) {
      strapi.log.info('Unauthorized access attempt.');
      return ctx.forbidden('Unauthorized access attempt.');
    }

    if (method === 'GET') {
      if (params && params?.id) {
        const entity = await strapi.query(uid as any).findOne({
          where: {
            $or: [{ id: params?.id }, { document_id: params?.id }],
          },
          select: ['id'],
          populate: {
            user: {
              select: ['id'],
            },
          },
        });

        if (!entity || entity?.user?.id !== user?.id) {
          strapi.log.info(`User ${user?.id} is forbidden to access entity ${params?.id}`);
          return ctx.forbidden('Forbidden Access');
        }
      } else {
        const url = ctx.request.url;
        const queryString = url.includes('?') ? url.split('?')[1] : '';
        const originalQuery = qs.parse(queryString);

        if (originalQuery.filters) {
          // @ts-ignore
          delete originalQuery.filters?.user;
        }

        originalQuery.filters = {
          // @ts-ignore
          ...originalQuery.filters,
          user: { id: { $eq: user?.id } },
        };

        const sanitizedQuery = qs.stringify(originalQuery, {
          addQueryPrefix: true,
          encode: false,
        });

        ctx.request.url = url.split('?')[0] + sanitizedQuery;
      }
    } else if (method === 'POST') {
      if (request.body?.data && typeof request.body.data === 'object') {
        request.body.data = {
          ...request.body.data,
          user: user?.id,
        };
      }
    } else if (method === 'PUT' || method === 'DELETE' || method === 'PATCH') {
      const entity = await strapi.db.query(uid).findOne({
        where: {
          $or: [{ id: params?.id }, { document_id: params?.id }],
        },
        select: ['id'],
        populate: {
          user: {
            select: ['id'],
          },
        },
      });

      if (!entity || entity?.user?.id !== user?.id) {
        strapi.log.info(`User ${user?.id} is forbidden to modify entity ${params?.id}`);
        return ctx.forbidden('Forbidden Access');
      }
    }

    await next();
  };
};
