import en from "../locales/en";
import zhCN from "../locales/zh_CN";
import antdLangEn from "antd/lib/locale/en_US";
import antdLangZhCN from "antd/lib/locale/zh_CN";

export function getMessages(locales: string | string[] = ["en"]): any {
  if (!Array.isArray(locales)) {
    locales = [locales];
  }
  let langBundle;
  let antdLang;
  let locale;
  for (let i = 0; i < locales.length && !locale; i++) {
    locale = locales[i];
    switch (locale) {
      case "zh-Hant-HK":
      case "zh-HK":
      case "zh-TW":
      case "zh-Hans-CN":
      case "zh-CN":
      case "zh":
        langBundle = zhCN;
        antdLang = antdLangZhCN;
        break;
      case "en-GB":
      case "en":
        langBundle = en;
        antdLang = antdLangEn;
        break;
      default:
        break;
    }
  }
  if (!langBundle) {
    return [en, antdLangEn];
  }
  return [langBundle, antdLang];
}
