

import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'icon',
    plugin: 'icons-field',
    type: 'text',
  });
};

export default register;
