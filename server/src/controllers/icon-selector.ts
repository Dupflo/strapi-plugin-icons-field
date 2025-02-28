import type { Core } from "@strapi/strapi"

type IconType = {
  name: string
  svg: string
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getIcons(): IconType[] {
    return strapi.config.get("plugin.icons-field.icons", [])
  },
})
