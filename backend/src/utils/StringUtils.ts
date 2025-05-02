import { type } from "os";
import { join } from "path";
import { randomBytes } from "crypto";
import { BooleanUtils } from "~/utils/BooleanUtils";

export class StringUtils {
  static pathFromOS(path: string): string {
    return BooleanUtils.areEqual(type(), "Windows_NT") ? path.replace(/\\/g, "/") : path;
  }

  static absolutePath(dirName: string, path: string): string {
    return join(dirName, path);
  }

  static generateShortPath(length = 6): string {
    const str = randomBytes(length)
      .toString("base64")
      .replace(/[^0-9a-zA-Z]/g, "")
      .slice(0, length);

    if (str.length < length) {
      return this.generateShortPath(length);
    }
    return str;
  }
}
