import {Inject, Injectable} from "@tsed/di";
import {DEFAULT_CONNECTION} from "./connections/DefaultConnection";

@Injectable()
export class PackageService {
  constructor(@Inject(DEFAULT_CONNECTION) connection: DEFAULT_CONNECTION) {

  }
}