import { useContext } from "react";

import { I18nContext } from "../i18n";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useI18n() {
  const i18n = useContext(I18nContext);
  return i18n;
}
