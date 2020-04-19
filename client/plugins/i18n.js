import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: 'de',
    fallbackLocale: 'en',
    messages: {
      en: require('~/lang/en.json'),
      de: require('~/lang/de.json')
    }
  })

  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }

    return `/${app.i18n.locale}/${link}`
  }
}