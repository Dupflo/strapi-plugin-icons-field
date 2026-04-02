import fs from "fs";
import path from "path";
const register = ({ strapi }) => {
  strapi.customFields.register({
    name: "icon",
    plugin: "icons-field",
    type: "text"
  });
};
function getSvgIconsFromDir(dirPath) {
  return fs.readdirSync(dirPath).filter((file) => file.endsWith(".svg")).map((file) => ({
    name: path.basename(file, ".svg"),
    svg: fs.readFileSync(path.join(dirPath, file), "utf8")
  }));
}
const iconSelector = ({ strapi }) => ({
  async getIcons(ctx) {
    const subDir = strapi.config.get("plugin.icons-field.publicPath", "icons");
    const publicDir = path.join(strapi.dirs.static.public, subDir);
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
          const folderPath = path.join(publicDir, sel);
          if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
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
        const folders = fs.readdirSync(publicDir).filter((file) => fs.statSync(path.join(publicDir, file)).isDirectory()).sort((a, b) => a.localeCompare(b, "fr"));
        for (const folder of folders) {
          const folderPath = path.join(publicDir, folder);
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
export {
  index as default
};
