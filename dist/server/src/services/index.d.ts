declare const _default: {
    service: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        getWelcomeMessage(): string;
        getRoutes(): {
            method: "GET" | "POST" | "PUT" | "DELETE";
            path: string;
            handler: string;
            config: any;
        }[];
        getProtectedRoutes(): Promise<any[]>;
        deleteProtectedRoute(id: number): Promise<void>;
        createProtectedRoute(route: any): Promise<void>;
    };
};
export default _default;
