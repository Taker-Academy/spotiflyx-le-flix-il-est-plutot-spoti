import { SpotifyController } from "./controller/SpotifyController";
import { UserController } from "./controller/UserController"

const userController = new UserController();
const spotifyController = new SpotifyController();

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
    controller: userController,
    action: "supportMail"
}, {
    method: "get",
    route: "/api/spotify/connection",
    controller: spotifyController,
    action: "connectSpotifyAPI"
}, {
    method: "get",
    route: "/api/spotify/popular-content",
    controller: spotifyController,
    action: "popularContent"
}, {
    method: "get",
    route: "/api/spotify/categories",
    controller: spotifyController,
    action: "allCategories"
}, {
    method: "get",
    route: "/api/spotify/categories/tracks",
    controller: spotifyController,
    action: "categoryTracks"
}
]