declare const _default: {
    register: () => void;
    bootstrap: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    destroy: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    config: {
        default: {};
        validator(): void;
    };
    controllers: {
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
    routes: {
        admin: {
            type: string;
            routes: {
                method: string;
                path: string;
                handler: string;
                config: {
                    policies: any[];
                    /**
                     * Plugin server methods
                     */
                    auth: boolean;
                };
            }[];
        };
    };
    services: {
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
    contentTypes: {
        'plugin-setting': {
            schema: {
                kind: string;
                collectionName: string;
                info: {
                    singularName: string;
                    pluralName: string;
                    displayName: string;
                };
                pluginOptions: {
                    "content-manager": {
                        visible: boolean;
                    };
                    "content-type-builder": {
                        visible: boolean;
                    };
                };
                options: {
                    comment: string;
                };
                attributes: {
                    path: {
                        type: string;
                    };
                    method: {
                        type: string;
                    };
                    handler: {
                        type: string;
                    };
                };
            };
        };
    };
    policies: {};
    middlewares: {
        isOwner: (config: any, { strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => (ctx: any, next: any) => Promise<any>;
    };
};
export default _default;
