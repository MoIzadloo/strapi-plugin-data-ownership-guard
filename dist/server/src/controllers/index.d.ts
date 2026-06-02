declare const _default: {
    controller: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        index(ctx: any): void;
        getRoutes(ctx: any): Promise<void>;
        assignPolicyToRoute(ctx: any): Promise<void>;
        getSelectedApis(ctx: any): Promise<void>;
        deleteProtectedRoute(ctx: any): Promise<void>;
    };
};
export default _default;
