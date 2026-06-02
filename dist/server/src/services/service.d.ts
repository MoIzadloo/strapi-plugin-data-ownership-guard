import type { Core } from '@strapi/strapi';
type RoutesType = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    handler: string;
    config: any;
}[];
declare const service: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    getWelcomeMessage(): string;
    getRoutes(): RoutesType;
    getProtectedRoutes(): Promise<any[]>;
    deleteProtectedRoute(id: number): Promise<void>;
    createProtectedRoute(route: any): Promise<void>;
};
export default service;
