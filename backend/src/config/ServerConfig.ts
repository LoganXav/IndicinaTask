import { DefaultValueUtils } from "~/utils/DefaultValueUtils";
import { StringUtils } from "~/utils/StringUtils";
import { BooleanUtils } from "~/utils/BooleanUtils";

export const DEV = "development";

if (!process.env?.NODE_ENV || BooleanUtils.areEqual(process.env.NODE_ENV, DEV)) console.log("Running in dev mode");

export default {
  Environment: DefaultValueUtils.evaluateAndGet(process.env.NODE_ENV, DEV),
  Controllers: {
    DefaultPath: [StringUtils.pathFromOS(StringUtils.absolutePath(__dirname, "../api/modules/**/controllers/**.controller.??"))],
    Ignore: [StringUtils.pathFromOS("**/base")],
  },
  Server: {
    Root: DefaultValueUtils.evaluateAndGet(process.env.SERVER_ROOT, "/api"),
    Host: DefaultValueUtils.evaluateAndGet(process.env.SERVER_HOST, "localhost"),
    Port: DefaultValueUtils.evaluateAndGet(Number(process.env.PORT), 5500),
    Origins: DefaultValueUtils.evaluateAndGet(process.env.ORIGINS, "http://localhost:3000,http://localhost:3001,"),
    ServiceName: DefaultValueUtils.evaluateAndGet(process.env.SERVICE_NAME, "KENIA"),
  },
  Params: {
    DefaultHealthRemoteService: DefaultValueUtils.evaluateAndGet(process.env.REMOTE_HEALTH_SERVICE, "https://google.com"),
  },
};
