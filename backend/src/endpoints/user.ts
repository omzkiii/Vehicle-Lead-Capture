import { Router } from "express";
import type { Request, Response } from "express";

export const user = Router();

user.get("/users", (req: Request, res: Response) => {
  res.send("USERS");
});
