import dayjs from "dayjs";

import advancedFormat from "dayjs/plugin/advancedFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(localeData);

dayjs.locale("en");

export default dayjs;
