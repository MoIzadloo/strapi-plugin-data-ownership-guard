import type { Core } from '@strapi/strapi';
import isOwner from '../middlewares/isOwner';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  const myMiddleware = isOwner({}, { strapi });

  strapi.server.use(myMiddleware);
};

export default bootstrap;
