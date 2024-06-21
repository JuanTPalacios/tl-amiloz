import { Roles, Usuarios } from "@prisma/client";
import { Request } from "express";

type UserWRoles = Usuarios & { Roles: Roles };

export type AuthRequest = Request & { user?: UserWRoles };

export enum Periodos {
  SEMANAL = 'SEMANAL',
  MENSUAL = 'MENSUAL',
}