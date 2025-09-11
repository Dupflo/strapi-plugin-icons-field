declare const _default: {
    register: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    controllers: {
        iconSelector: ({ strapi }: {
            strapi: any;
        }) => {
            getIcons(ctx: any): Promise<void>;
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
                    policies: string[];
                };
            }[];
        };
    };
};
export default _default;
