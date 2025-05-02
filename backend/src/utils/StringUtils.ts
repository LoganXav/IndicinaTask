import { join } from "path";
import { type } from "os";
import { BooleanUtils } from "~/utils/BooleanUtils";

export class StringUtils {
  static pathFromOS(path: string): string {
    return BooleanUtils.areEqual(type(), "Windows_NT") ? path.replace(/\\/g, "/") : path;
  }

  static absolutePath(dirName: string, path: string): string {
    return join(dirName, path);
  }
}
