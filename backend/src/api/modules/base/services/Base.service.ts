import { Result } from "~/api/shared/result/Result";
import { IResult } from "~/api/shared/result/IResult";

export abstract class BaseService<T> {
  result = new Result();

  constructor(public readonly CONTEXT: string) {}

  abstract execute(args?: T): Promise<IResult>;
}
