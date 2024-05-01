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
    controller: userController,
    action: "updateProfile"
}, {
    method: "patch",
    route: "/profile/change-password",
    controller: userController,
    action: "changePassword"
}, {
    method: "patch",
    route: "/profile/account-info",
    controller: userController,
    action: "updateProfileInfo"
}, {
    method: "patch",
    route: "/profile/account-social-links",
    controller: userController,
    action: "updateSocialLinks"
}, {
    method: "post",
    route: "/supportEmail",
    controller: UserController,
    action: "supportMail"
}]