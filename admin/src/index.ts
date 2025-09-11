import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';


export default {
  register(app: any) {
    app.customFields.register({
      name: "icon",
      pluginId: "icons-field",
      type: "text",
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.label`,
        defaultMessage: "Icon Selector",
      },
      intlDescription: {
        id: `${PLUGIN_ID}.description`,
        defaultMessage: "Select any icon from your own config",
      },
      components: {
        Input: async () =>
          import("./components/IconSelect"),
      },
      options: {
        base: [
          {
            name: 'options.selection',
            type: 'textarea-enum',
            intlLabel: {
              id: `${PLUGIN_ID}.options.base.selection`,
              defaultMessage: 'Choose a specific icons folder',
            },
            description: {
              id: `${PLUGIN_ID}.options.base.selection.description`,
              defaultMessage: 'Leave empty to select all icones library',
            },
            placeholder: {
              id: `${PLUGIN_ID}.options.base.selection.placeholder`,
              defaultMessage: 'One folder name per line',
            },
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: `${PLUGIN_ID}.options.advanced.requiredField`,
                  defaultMessage: 'Required field',
                },
                description: {
                  id: `${PLUGIN_ID}.options.advanced.requiredField.description`,
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    })

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
