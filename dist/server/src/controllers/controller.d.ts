import { Core } from '@strapi/strapi';
declare const controller: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    index(ctx: any): void;
    getRoutes(ctx: any): Promise<void>;
    assignPolicyToRoute(ctx: any): Promise<void>;
    getSelectedApis(ctx: any): Promise<void>;
    deleteProtectedRoute(ctx: any): Promise<void>;
};
export default controller;
