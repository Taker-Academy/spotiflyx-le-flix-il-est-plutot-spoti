import { UserController } from "./controller/UserController"

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "post",
    route: "/register",
    controller: UserController,
    action: "register"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}]