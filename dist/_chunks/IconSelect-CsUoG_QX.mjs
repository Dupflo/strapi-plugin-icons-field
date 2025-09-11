import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo } from "react";
import { Field, Modal, Box, Button, Typography } from "@strapi/design-system";
import { useFetchClient } from "@strapi/strapi/admin";
import { P as PLUGIN_ID } from "./index-l_ZBfscD.mjs";
import parse from "html-react-parser";
import { useTheme } from "styled-components";
import { CaretDown, Cross } from "@strapi/icons";
import { useIntl } from "react-intl";
function Icon({ icon, ...props }) {
  const parsedElement = icon && parse(icon.trim());
  if (parsedElement && React.isValidElement(parsedElement)) {
    return React.cloneElement(parsedElement, props);
  }
  return null;
}
const IconSelect = (props) => {
  const theme = useTheme();
  const intl = useIntl();
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
  const [icons, setIcons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { get } = useFetchClient();
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  useEffect(() => {
    const fetchIcons = async () => {
      try {
        let url = `/${PLUGIN_ID}/icons`;
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
  const allIcons = useMemo(() => icons.flatMap((group) => group.icons), [icons]);
  const selectedIcon = useMemo(() => {
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
  return /* @__PURE__ */ jsxs(Field.Root, { error, hint, children: [
    /* @__PURE__ */ jsx(Field.Label, { children: label }),
    /* @__PURE__ */ jsxs(
      Modal.Root,
      {
        labelledBy: "icon-select-modal-title",
        open: isModalOpen,
        onOpenChange: setIsModalOpen,
        children: [
          /* @__PURE__ */ jsx(Modal.Trigger, { children: /* @__PURE__ */ jsxs(
            Box,
            {
              display: "flex",
              style: { alignItems: "center", gap: "12px", position: "relative", width: "100%" },
              children: [
                /* @__PURE__ */ jsx("div", { style: { position: "relative", flex: 1 }, children: /* @__PURE__ */ jsx(
                  Button,
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
                    children: /* @__PURE__ */ jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        },
                        children: [
                          selectedIcon ? /* @__PURE__ */ jsxs(Fragment, { children: [
                            /* @__PURE__ */ jsx(Icon, { icon: selectedIcon, style: { height: "24px", display: "block" } }),
                            /* @__PURE__ */ jsx(Typography, { variant: "pi", children: (() => {
                              const found = allIcons.find((icon) => icon.svg === selectedIcon);
                              return found ? found.name : "Unknown icon";
                            })() })
                          ] }) : /* @__PURE__ */ jsx(Typography, { style: { fontWeight: "400" }, children: placeholder ?? intl.formatMessage({
                            id: "icons-field.select",
                            defaultMessage: "Select an icon"
                          }) }),
                          /* @__PURE__ */ jsx(
                            CaretDown,
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
                selectedIcon && /* @__PURE__ */ jsx(
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
                    children: /* @__PURE__ */ jsx(Cross, { color: theme.colors?.neutral500, style: { height: "100%", width: "100%" } })
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs(Modal.Content, { children: [
            /* @__PURE__ */ jsx(Modal.Header, { children: /* @__PURE__ */ jsx(Typography, { fontWeight: "bold", textColor: "neutral800", as: "h2", id: "title", children: intl.formatMessage({
              id: "icons-field.modal.title",
              defaultMessage: "Select an icon"
            }) }) }),
            /* @__PURE__ */ jsx(Modal.Body, { children: icons.map((group) => /* @__PURE__ */ jsxs(Box, { marginBottom: 6, children: [
              /* @__PURE__ */ jsx(
                Typography,
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
              /* @__PURE__ */ jsx(Box, { display: "flex", marginTop: 2, style: { flexWrap: "wrap", gap: 6 }, children: group.icons.map((icon) => /* @__PURE__ */ jsxs(
                Box,
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
                    /* @__PURE__ */ jsx(
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
                    /* @__PURE__ */ jsx(Typography, { variant: "pi", fontWeight: "bold", style: { marginTop: 8 }, children: icon.name })
                  ]
                },
                icon.name
              )) })
            ] }, group.folder)) }),
            /* @__PURE__ */ jsx(Modal.Footer, { children: /* @__PURE__ */ jsx(Modal.Close, { children: /* @__PURE__ */ jsx(Button, { variant: "tertiary", children: intl.formatMessage({
              id: "icons-field.modal.close",
              defaultMessage: "Close window"
            }) }) }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(Field.Hint, {})
  ] });
};
export {
  IconSelect as default
};
