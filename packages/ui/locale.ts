import { createI18n } from "vue-i18n";

export type LocaleStrings = typeof en;

const en = {
  siteList: {
    searchSites: "Search sites...",
    create: "Create",
  },
  createSite: {
    title: "Create site",
    siteName: "Site name",
    siteNamePlaceholder: "e.g. localhost, my-site",
    siteNameTip: "Site name should be a valid domain prefix.",
    siteNameTipServe: "This site will be served at <code><em>%{prefix}</em>%{suffix}</code>.",
    invalidNameError: "Site name should be a valid domain prefix.",
    duplicatedNameError: "This site name has already been taken.",
    create: "Create",
  },
  site: {
    overview: "Overview",
    settings: "Settings",
  },
  dangerZone: {
    title: "Danger zone",
    removeSite: "Remove this site",
    confirmPlaceholder: 'Enter "{name}" to confirm',
    confirm: "Confirm",
    cancel: "Cancel",
  },
};

const zh: LocaleStrings = {
  siteList: {
    searchSites: "搜索站点...",
    create: "创建",
  },
  createSite: {
    title: "创建站点",
    siteName: "站点名称",
    siteNamePlaceholder: "例如 localhost, my-site",
    siteNameTip: "站点名称应当是合法的域名前缀。",
    siteNameTipServe: "该站点将被服务于 <code><em>%{prefix}</em>%{suffix}</code>。",
    invalidNameError: "站点名称应当是合法的域名前缀。",
    duplicatedNameError: "该站点名称已被占用。",
    create: "创建",
  },
  site: {
    overview: "概览",
    settings: "设置",
  },
  dangerZone: {
    title: "危险区",
    removeSite: "移除该站点",
    confirmPlaceholder: '输入 "{name}" 确认',
    confirm: "确认",
    cancel: "取消",
  },
};

export default createI18n({
  locale: navigator.language,
  fallbackLocale: [...navigator.languages, "en"],
  messages: { en, zh },
});
