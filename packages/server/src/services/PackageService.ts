import { Inject, Injectable } from "@tsed/di";
import { DEFAULT_CONNECTION } from "./connections/DefaultConnection";

@Injectable()
export class PackageService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(@Inject(DEFAULT_CONNECTION) _connection: DEFAULT_CONNECTION) {}
}
