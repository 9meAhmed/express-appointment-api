import * as express from "express";
import { UserController } from "../controllers/user.controller";
import { userValidator } from "../middleware/user.validator";
const Router = express.Router();

Router.get("/users", UserController.getAllUsers);
Router.post("/users", userValidator, UserController.createUser);
Router.put("/users/:id", userValidator, UserController.updateUser);
Router.delete("/users/:id", UserController.deleteUser);

export { Router as userRouter };
