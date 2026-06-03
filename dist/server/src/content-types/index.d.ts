declare const _default: {
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
export default _default;
