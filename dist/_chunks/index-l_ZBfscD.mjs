import { useRef, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
import { Flex } from "@strapi/design-system";
import styled from "styled-components";
import { Rocket } from "@strapi/icons";
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PLUGIN_ID = "icons-field";
const Initializer = ({ setPlugin }) => {
  const ref = useRef(setPlugin);
  useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
const IconBox = styled(Flex)`
  background-color: #ddfaf2;
  border: 1px solid #87cec5;

  svg > path {
    fill: #19a796;
  }
`;
const PluginIcon = () => {
  return /* @__PURE__ */ jsx(IconBox, { justifyContent: "center", alignItems: "center", width: 7, height: 6, hasRadius: true, "aria-hidden": true, children: /* @__PURE__ */ jsx(Rocket, {}) });
};
const index = {
  register(app) {
    app.customFields.register({
      name: "icon",
      pluginId: "icons-field",
      type: "text",
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.label`,
        defaultMessage: "Icon Selector"
      },
      intlDescription: {
        id: `${PLUGIN_ID}.description`,
        defaultMessage: "Select any icon from your own config"
      },
      components: {
        Input: async () => import("./IconSelect-CsUoG_QX.mjs")
      },
      options: {
        base: [
          {
            name: "options.selection",
            type: "textarea-enum",
            intlLabel: {
              id: `${PLUGIN_ID}.options.base.selection`,
              defaultMessage: "Choose a specific icons folder"
            },
            description: {
              id: `${PLUGIN_ID}.options.base.selection.description`,
              defaultMessage: "Leave empty to select all icones library"
            },
            placeholder: {
              id: `${PLUGIN_ID}.options.base.selection.placeholder`,
              defaultMessage: "One folder name per line"
            }
          }
        ],
        advanced: [
          {
            sectionTitle: {
              id: "global.settings",
              defaultMessage: "Settings"
            },
            items: [
              {
                name: "required",
                type: "checkbox",
                intlLabel: {
                  id: `${PLUGIN_ID}.options.advanced.requiredField`,
                  defaultMessage: "Required field"
                },
                description: {
                  id: `${PLUGIN_ID}.options.advanced.requiredField.description`,
                  defaultMessage: "You won't be able to create an entry if this field is empty"
                }
              }
            ]
          }
        ]
      }
    });
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID
    });
  },
  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("./en-XB0QtQYD.mjs"), "./translations/fr.json": () => import("./fr-CSOByLe_.mjs") }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
export {
  PLUGIN_ID as P,
  index as i
};
