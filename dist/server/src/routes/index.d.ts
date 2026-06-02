declare const routes: {
    admin: {
        type: string;
        routes: {
            method: string;
            path: string;
            handler: string;
            config: {
                policies: any[];
                auth: boolean;
            };
        }[];
    };
};
export default routes;
