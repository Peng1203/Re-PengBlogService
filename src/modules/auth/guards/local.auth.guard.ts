import { Injectable } from "@nestjs/common";
import { PassPortStrategyEnum } from "@/helper/enums";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard(PassPortStrategyEnum.LOCAL) { }