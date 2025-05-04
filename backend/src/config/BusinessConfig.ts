import { DefaultValueUtils } from "~/utils/DefaultValueUtils";

export default {
  URL_SHORTENER_LENGTH: DefaultValueUtils.evaluateAndGet(Number(process.env.URL_SHORTENER_LENGTH), 6),
  URL_BASE_PATH: DefaultValueUtils.evaluateAndGet(process.env.URL_BASE_PATH, "http://localhost:5500/"),
  URL_EXPIRTY_MINUTES: DefaultValueUtils.evaluateAndGet(Number(process.env.URL_EXPIRTY_MINUTES), 1),
};
