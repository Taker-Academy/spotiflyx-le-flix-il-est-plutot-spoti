import { UserController } from "./controller/UserController"

const userController = new UserController();

export const Routes = [{
    method: "post",
    route: "/register",
    controller: userController,
    action: "register"
}, {
    method: "post",
    route: "/login",
    controller: userController,
    action: "login"
}, {
    method: "delete",
    route: "/users/:id",
    controller: userController,
    action: "remove"
}, {
    method: "patch",
    route: "/profile",
    controller: UserController,
    action: "update"
}, {
    method: "post",
    route: "/supportEmail",
    controller: UserController,
    action: "supportMail"
}]