"use strict";
const fs = require("fs");
const path = require("path");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const path__default = /* @__PURE__ */ _interopDefault(path);
const register = ({ strapi }) => {
  strapi.customFields.register({
    name: "icon",
    plugin: "icons-field",
    type: "text"
  });
};
function getSvgIconsFromDir(dirPath) {
  return fs__default.default.readdirSync(dirPath).filter((file) => file.endsWith(".svg")).map((file) => ({
    name: path__default.default.basename(file, ".svg"),
    svg: fs__default.default.readFileSync(path__default.default.join(dirPath, file), "utf8")
  }));
}
const iconSelector = ({ strapi }) => ({
  async getIcons(ctx) {
    const subDir = strapi.config.get("plugin.icons-field.publicPath", "icons");
    const publicDir = path__default.default.join(strapi.dirs.static.public, subDir);
    const selection = ctx?.query?.selection;
    let result = [];
    try {
      if (selection) {
        let selections = [];
        if (Array.isArray(selection)) {
          selections = selection;
        } else if (typeof selection === "string") {
          selections = selection.split(",").map((s) => s.trim()).filter(Boolean);
        }
        for (const sel of selections) {
          const folderPath = path__default.default.join(publicDir, sel);
          if (fs__default.default.existsSync(folderPath) && fs__default.default.statSync(folderPath).isDirectory()) {
            const icons = getSvgIconsFromDir(folderPath);
            if (icons.length) {
              result.push({ folder: sel, icons });
            }
          }
        }
      } else {
        const rootIcons = getSvgIconsFromDir(publicDir);
        if (rootIcons.length) {
          result.push({ folder: "global", icons: rootIcons });
        }
        const folders = fs__default.default.readdirSync(publicDir).filter((file) => fs__default.default.statSync(path__default.default.join(publicDir, file)).isDirectory()).sort((a, b) => a.localeCompare(b, "fr"));
        for (const folder of folders) {
          const folderPath = path__default.default.join(publicDir, folder);
          const icons = getSvgIconsFromDir(folderPath);
          if (icons.length) {
            result.push({ folder, icons });
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
    ctx.body = result;
  }
});
const controllers = {
  iconSelector
};
const adminAPIRoutes = [
  {
    method: "GET",
    path: "/icons",
    handler: "iconSelector.getIcons",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    }
  }
];
const routes = {
  admin: {
    type: "admin",
    routes: adminAPIRoutes
  }
};
const index = {
  register,
  controllers,
  routes
};
module.exports = index;
