"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const designSystem = require("@strapi/design-system");
const admin = require("@strapi/strapi/admin");
const index = require("./index-BklP0zrL.js");
const parse = require("html-react-parser");
const styled = require("styled-components");
const icons = require("@strapi/icons");
const reactIntl = require("react-intl");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const React__default = /* @__PURE__ */ _interopDefault(React);
const parse__default = /* @__PURE__ */ _interopDefault(parse);
function Icon({ icon, ...props }) {
  const parsedElement = icon && parse__default.default(icon.trim());
  if (parsedElement && React__default.default.isValidElement(parsedElement)) {
    return React__default.default.cloneElement(parsedElement, props);
  }
  return null;
}
const IconSelect = (props) => {
  const theme = styled.useTheme();
  const intl = reactIntl.useIntl();
  const {
    label,
    hint,
    attribute,
    description,
    disabled,
    error,
    intlLabel,
    name,
    onChange,
    placeholder,
    required,
    value
  } = props;
  const [icons$1, setIcons] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { get } = admin.useFetchClient();
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  React.useEffect(() => {
    const fetchIcons = async () => {
      try {
        let url = `/${index.PLUGIN_ID}/icons`;
        if (attribute?.options?.selection) {
          if (Array.isArray(attribute.options.selection)) {
            url += `?selection=${encodeURIComponent(attribute.options.selection.join(","))}`;
          } else {
            url += `?selection=${encodeURIComponent(attribute.options.selection)}`;
          }
        }
        const { data } = await get(url);
        setIcons(data || []);
      } catch (error2) {
        console.error("Error fetching icons:", error2);
      }
    };
    fetchIcons();
  }, [attribute?.options?.selection]);
  const handleChange = (value2) => {
    onChange({ target: { name, value: value2, type: attribute.type } });
  };
  const allIcons = React.useMemo(() => icons$1.flatMap((group) => group.icons), [icons$1]);
  const selectedIcon = React.useMemo(() => {
    for (const icon of allIcons) {
      if (icon.svg === value) {
        return icon.svg;
      }
    }
    return void 0;
  }, [value, allIcons]);
  const handleUnselectedIcon = (e) => {
    e.stopPropagation();
    onChange({ target: { name, value: "", type: attribute.type } });
  };
  console.log(props);
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { error, hint, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: label }),
    /* @__PURE__ */ jsxRuntime.jsxs(
      designSystem.Modal.Root,
      {
        labelledBy: "icon-select-modal-title",
        open: isModalOpen,
        onOpenChange: setIsModalOpen,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Trigger, { children: /* @__PURE__ */ jsxRuntime.jsxs(
            designSystem.Box,
            {
              display: "flex",
              style: { alignItems: "center", gap: "12px", position: "relative", width: "100%" },
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { style: { position: "relative", flex: 1 }, children: /* @__PURE__ */ jsxRuntime.jsx(
                  designSystem.Button,
                  {
                    variant: "tertiary",
                    disabled,
                    style: {
                      gap: "8px",
                      height: "42px",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    },
                    children: /* @__PURE__ */ jsxRuntime.jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        },
                        children: [
                          selectedIcon ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                            /* @__PURE__ */ jsxRuntime.jsx(Icon, { icon: selectedIcon, style: { height: "24px", display: "block" } }),
                            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", children: (() => {
                              const found = allIcons.find((icon) => icon.svg === selectedIcon);
                              return found ? found.name : "Unknown icon";
                            })() })
                          ] }) : /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { style: { fontWeight: "400" }, children: placeholder ?? intl.formatMessage({
                            id: "icons-field.select",
                            defaultMessage: "Select an icon"
                          }) }),
                          /* @__PURE__ */ jsxRuntime.jsx(
                            icons.CaretDown,
                            {
                              color: theme.colors?.neutral500,
                              style: {
                                position: "absolute",
                                right: "16px",
                                height: "16px",
                                width: "16px"
                              }
                            }
                          )
                        ]
                      }
                    )
                  }
                ) }),
                selectedIcon && /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleUnselectedIcon,
                    style: {
                      position: "absolute",
                      right: "44px",
                      height: "16px",
                      width: "16px",
                      cursor: "pointer",
                      zIndex: 3
                    },
                    children: /* @__PURE__ */ jsxRuntime.jsx(icons.Cross, { color: theme.colors?.neutral500, style: { height: "100%", width: "100%" } })
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Modal.Content, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Header, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { fontWeight: "bold", textColor: "neutral800", as: "h2", id: "title", children: intl.formatMessage({
              id: "icons-field.modal.title",
              defaultMessage: "Select an icon"
            }) }) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Body, { children: icons$1.map((group) => /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { marginBottom: 6, children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                designSystem.Typography,
                {
                  fontWeight: "bold",
                  textColor: "neutral800",
                  as: "h3",
                  id: "title",
                  textTransform: "capitalize",
                  marginBottom: 2,
                  children: group.folder
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { display: "flex", marginTop: 2, style: { flexWrap: "wrap", gap: 6 }, children: group.icons.map((icon) => /* @__PURE__ */ jsxRuntime.jsxs(
                designSystem.Box,
                {
                  as: "button",
                  type: "button",
                  "aria-label": icon.name,
                  onClick: () => {
                    handleChange(icon.svg);
                    toggleModal();
                  },
                  style: {
                    alignItems: "center",
                    aspectRatio: "1/1",
                    background: "white",
                    border: value === icon.svg ? `2px solid ${theme.colors?.primary600}` : "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    height: "100%",
                    justifyContent: "center",
                    padding: "12px",
                    width: "85px"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntime.jsx(
                      Icon,
                      {
                        icon: icon.svg,
                        style: {
                          aspectRatio: "1/1",
                          height: "100%",
                          maxWidth: "25px",
                          width: "100%"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", fontWeight: "bold", style: { marginTop: 8 }, children: icon.name })
                  ]
                },
                icon.name
              )) })
            ] }, group.folder)) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Footer, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Close, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { variant: "tertiary", children: intl.formatMessage({
              id: "icons-field.modal.close",
              defaultMessage: "Close window"
            }) }) }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, {})
  ] });
};
exports.default = IconSelect;
