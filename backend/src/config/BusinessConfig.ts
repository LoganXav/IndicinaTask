import { DefaultValueUtils } from "~/utils/DefaultValueUtils";

export default {
  URL_SHORTENER_LENGTH: DefaultValueUtils.evaluateAndGet(Number(process.env.URL_SHORTENER_LENGTH), 6),
  URL_BASE_PATH: DefaultValueUtils.evaluateAndGet(process.env.URL_BASE_PATH, "http://s.url/"),
};
