/**
 * `isOwner` middleware
 */

import type { Core } from '@strapi/strapi';
import qs from 'qs';

function removeSOrES(word: string) {
  if (word?.endsWith('es')) {
    return word?.slice(0, -2);
  } else if (word?.endsWith('s')) {
    return word?.slice(0, -1);
  } else {
    return word;
  }
}

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
  //
  return async (ctx: any, next: any) => {
    const { request } = ctx;
    let user: any;

    try {
      const protectedAPIs = await strapi
        .query('plugin::strapi-plugin-data-ownership-guard.plugin-setting')
        .findMany();

      const fullURL = new URL('https://example.com' + ctx?.request?.url);
      const urlPath = fullURL.pathname?.split('/')?.filter(Boolean);
      const path =
        urlPath?.length > 2 ? `/${urlPath[0]}/${urlPath[1]}/:id` : `/${urlPath[0]}/${urlPath[1]}`;
      const method = ctx?.request?.method;
      const params = urlPath?.length > 2 ? { id: urlPath[2] } : null;

      const uid = `api::${removeSOrES(urlPath[1])}.${removeSOrES(urlPath[1])}`;

      // If the API is not protected, proceed to the next middleware
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

        user = { id: payload.id };
      }

      // If there's no authenticated user, throw an unauthorized error
      if (!user?.id) {
        strapi.log.info('Unauthorized access attempt.');

        ctx.forbidden('Forbidden Access');
      }

      if (method === 'GET') {
        // For data retrieval requests
        if (params && params.id) {
          // Single record request: Validate entity ownership
          const entity = await strapi.query(uid as any).findOne({
            where: {
              $or: [{ id: params.id }, { document_id: params.id }],
            },
            select: ['id'],
            populate: {
              user: {
                select: ['id'],
              },
            },
          });

          console.log('entity', entity);

          if (!entity || entity?.user?.id !== user?.id) {
            strapi.log.info(`User ${user?.id} is forbidden to access entity ${params.id}`);

            ctx.forbidden('Forbidden Access');
          }
        } else {
          // For collection queries, update the query to filter for the current user
          const url = ctx.request.url;
          const queryString = url.includes('?') ? url.split('?')[1] : '';
          const originalQuery = qs.parse(queryString);

          // Remove any existing user filter
          if (originalQuery.filters) {
            // @ts-ignore
            delete originalQuery.filters?.user;
          }

          // Add a filter to restrict results to the current user
          originalQuery.filters = {
            // @ts-ignore
            ...originalQuery.filters,
            user: { id: { $eq: user?.id } },
          };

          // Rebuild and update the query string. Note that updating the URL might not affect
          // some internal parsing, so you might also consider modifying ctx.query if needed.
          const sanitizedQuery = qs.stringify(originalQuery, {
            addQueryPrefix: true,
            encode: false,
          });

          ctx.request.url = url.split('?')[0] + sanitizedQuery;
        }
      } else if (method === 'POST') {
        // For creating new records, ensure the data is associated with the current user
        request.body.data = {
          ...request.body.data,
          user: user?.id,
        };
      } else if (method === 'PUT' || method === 'DELETE') {
        // For updating or deleting, first confirm that the user owns the entity
        const entity = await strapi.db.query(uid).findOne({
          where: {
            id: params.id,
          },
          select: ['id'],
          populate: {
            user: {
              select: ['id'],
            },
          },
        });

        if (!entity || entity.user.id !== user?.id) {
          strapi.log.info(`User ${user?.id} is forbidden to modify entity ${params.id}`);

          ctx.forbidden('Forbidden Access');
        }
      }

      // If all checks pass, proceed to the next middleware or controller.
      await next();
    } catch (error) {
      strapi.log.error(`Error in isOwner middleware: ${error.message}`);
      ctx.throw(500, 'Internal Server Error');
    }
  };
};
