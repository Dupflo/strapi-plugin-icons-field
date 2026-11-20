import fs from "fs";
import path from "path";
const register = ({ strapi }) => {
  strapi.customFields.register({
    name: "icon",
    plugin: "icons-field",
    type: "text"
  });
};
const DEFAULT_SYNONYMS_FILE = "_synonyms.json";
function toTerms(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(toTerms);
  if (value && typeof value === "object") return Object.values(value).flatMap(toTerms);
  return [];
}
function loadSynonyms(dirPath, fileName) {
  const filePath = path.join(dirPath, fileName);
  if (!fileName || !fs.existsSync(filePath)) return {};
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      console.warn(`[icons-field] ${filePath}: expected an object of "icon-name": ["synonym", ...]`);
      return {};
    }
    const map = {};
    for (const [key, value] of Object.entries(raw)) {
      if (key.startsWith("_")) continue;
      const cleaned = Array.from(new Set(toTerms(value).map((s) => s.trim()).filter(Boolean)));
      if (cleaned.length) map[key] = cleaned;
    }
    return map;
  } catch (err) {
    console.warn(`[icons-field] Could not read synonyms file ${filePath}:`, err);
    return {};
  }
}
function mergeSynonyms(...maps) {
  const merged = {};
  for (const map of maps) {
    for (const [name, list] of Object.entries(map)) {
      merged[name] = Array.from(/* @__PURE__ */ new Set([...merged[name] || [], ...list]));
    }
  }
  return merged;
}
function getSvgIconsFromDir(dirPath, synonyms = {}) {
  return fs.readdirSync(dirPath).filter((file) => file.endsWith(".svg")).map((file) => {
    const name = path.basename(file, ".svg");
    const icon = {
      name,
      svg: fs.readFileSync(path.join(dirPath, file), "utf8")
    };
    if (synonyms[name]?.length) icon.keywords = synonyms[name];
    return icon;
  });
}
const iconSelector = ({ strapi }) => ({
  async getIcons(ctx) {
    const subDir = strapi.config.get("plugin.icons-field.publicPath", "icons");
    const synonymsFile = strapi.config.get("plugin.icons-field.synonymsFile", DEFAULT_SYNONYMS_FILE);
    const publicDir = path.join(strapi.dirs.static.public, subDir);
    const selection = ctx?.query?.selection;
    const rootSynonyms = loadSynonyms(publicDir, synonymsFile);
    const synonymsFor = (folderPath) => mergeSynonyms(rootSynonyms, loadSynonyms(folderPath, synonymsFile));
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
            const icons = getSvgIconsFromDir(folderPath, synonymsFor(folderPath));
            if (icons.length) {
              result.push({ folder: sel, icons });
            }
          }
        }
      } else {
        const rootIcons = getSvgIconsFromDir(publicDir, rootSynonyms);
        if (rootIcons.length) {
          result.push({ folder: "global", icons: rootIcons });
        }
        const folders = fs.readdirSync(publicDir).filter((file) => fs.statSync(path.join(publicDir, file)).isDirectory()).sort((a, b) => a.localeCompare(b, "fr"));
        for (const folder of folders) {
          const folderPath = path.join(publicDir, folder);
          const icons = getSvgIconsFromDir(folderPath, synonymsFor(folderPath));
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
