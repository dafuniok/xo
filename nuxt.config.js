module.exports = {
  srcDir: "client/",
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  watch: ["~/server/*.js"],
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~/plugins/eventBus.js"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: ["~/io"],
  env: {
    WS_URL: process.env.WS_URL || "0.0.0.0"
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: "#1976d2",
          accent: "#37474f",
          secondary: "#ff8f00",
          info: "#26a69a",
          warning: "#ffc107",
          error: "#dd2c00",
          success: "#00e676"
        }
      }
    }
  }
}
