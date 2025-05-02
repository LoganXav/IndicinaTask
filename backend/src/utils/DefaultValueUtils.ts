import { Nulldefined } from "../types/Nulldefined";

export class DefaultValueUtils {
  static evaluateAndGet<T>(value: T | Nulldefined, defaultValue: T): T {
    if (typeof value === "number" && isNaN(value)) {
      return defaultValue;
    }
    return value ?? defaultValue;
  }
}
