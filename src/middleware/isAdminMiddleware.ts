import { NextFunction, Response } from "express";

import { AuthRequest } from "../utils/types";

const isAdminUserMiddleware = function(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user && req.user.Roles.nombre === 'admin') {
      next();
  } else {
      return res.status(401).json({ success: false, error: "User is not an admin" });
  }
};

export default isAdminUserMiddleware;