import type { Core } from '@strapi/strapi';
import isOwner from '../middlewares/isOwner';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  // Instantiate the middleware with config and dependencies
  const myMiddleware = isOwner({}, { strapi });

  // Now myMiddleware is of type (ctx, next) => Promise<void>
  strapi.server.use(myMiddleware);
};

export default register;
