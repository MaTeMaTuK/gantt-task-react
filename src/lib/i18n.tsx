import React, { createContext, useEffect, useRef, useState } from "react";
import rosetta from "rosetta";

type LocalLng = string;
type LngDict = any;

type i18nContext = {
  activeLocale: LocalLng;
  t: typeof i18n.t;
  locale: (l: LocalLng, dict?: LngDict) => void;
};

type I18nProvider = (params: {
  children: React.ReactNode;
  locale: LocalLng;
  lngDict: LngDict;
}) => JSX.Element;

export const i18n = rosetta();

export const defaultLanguage = "en";
export const languages = ["zh", "en"];
export const contentLanguageMap = { zh: "zh-CN", en: "en-US" };

export const I18nContext = createContext<i18nContext>({} as i18nContext);

// default language
i18n.locale(defaultLanguage);
const I18n: I18nProvider = ({ children, locale, lngDict }) => {
  const activeLocaleRef = useRef(locale || defaultLanguage);
  const [, setTick] = useState(0);
  const firstRender = useRef(true);

  const i18nWrapper: i18nContext = {
    activeLocale: activeLocaleRef.current,
    t: (...args) => i18n.t(...args),
    locale: (l, dict) => {
      i18n.locale(l);
      activeLocaleRef.current = l;
      if (dict) {
        i18n.set(l, dict);
      }
      // force rerender to update view
      setTick(tick => tick + 1);
    },
  };

  // for initial SSR render
  if (locale && firstRender.current === true) {
    firstRender.current = false;
    i18nWrapper.locale(locale, lngDict);
  }

  useEffect(() => {
    if (locale) {
      i18nWrapper.locale(locale, lngDict);
    }
    // only when locale/lngDict is updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lngDict, locale]);

  return (
    <I18nContext.Provider value={i18nWrapper}>{children}</I18nContext.Provider>
  );
};

export default I18n;
