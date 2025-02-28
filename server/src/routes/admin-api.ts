export default [
    {
        method: "GET",
        path: "/icons",
        handler: "iconSelector.getIcons",
        config: {
            policies: ['admin::isAuthenticatedAdmin'],
        },
    },
]