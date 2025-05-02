import { StringUtils } from "~/utils/StringUtils";
import { BooleanUtils } from "~/utils/BooleanUtils";
import { DefaultValueUtils } from "~/utils/DefaultValueUtils";

export const DEV = "development";

if (!process.env?.NODE_ENV || BooleanUtils.areEqual(process.env.NODE_ENV, DEV)) console.log("Running in dev mode");

export default {
  Environment: DefaultValueUtils.evaluateAndGet(process.env.NODE_ENV, DEV),
  Controllers: {
    Ignore: [StringUtils.pathFromOS("**/base")],
    DefaultPath: [StringUtils.pathFromOS(StringUtils.absolutePath(__dirname, "../api/modules/**/controllers/**.controller.??"))],
  },
  Server: {
    Port: DefaultValueUtils.evaluateAndGet(Number(process.env.PORT), 5500),
    Root: DefaultValueUtils.evaluateAndGet(process.env.SERVER_ROOT, "/api"),
    Host: DefaultValueUtils.evaluateAndGet(process.env.SERVER_HOST, "localhost"),
    ServiceName: DefaultValueUtils.evaluateAndGet(process.env.SERVICE_NAME, "Indicina Url Shortener"),
  },
  Params: {
    DefaultHealthRemoteService: DefaultValueUtils.evaluateAndGet(process.env.REMOTE_HEALTH_SERVICE, "https://google.com"),
  },
};
