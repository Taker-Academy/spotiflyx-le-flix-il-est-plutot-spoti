import { SpotifyController } from "./controller/SpotifyController";
import { YoutubeController } from "./controller/YoutubeController";
import { UserController } from "./controller/UserController"
import { PostController } from "./controller/PostController";
import * as multer from 'multer';

const userController = new UserController();
const spotifyController = new SpotifyController();
const youtubeController = new YoutubeController();
const postController = new PostController();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    action: "updateProfile",
    middleware: upload.single('profileImage')
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
    method: "get",
    route: "/profile",
    controller: userController,
    action: "printGeneralValues"
}, {
    method: "get",
    route: "/profile/account-info",
    controller: userController,
    action: "printInfoValues"
}, {
    method: "get",
    route: "/profile/account-social-links",
    controller: userController,
    action: "printSocialLinksValues"
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
    route: "/api/youtube/trending",
    controller: youtubeController,
    action: "getPopularVideos"
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
    route: "/api/youtube/categories",
    controller: youtubeController,
    action: "allCategoriesYoutube"
}, {
    method: "get",
    route: "/api/youtube/categories/videos",
    controller: youtubeController,
    action: "categoryVideos"
}, {
    method: "get",
    route: "/api/spotify/categories/tracks",
    controller: spotifyController,
    action: "categoryTracks"
}, {
    method: "get",
    route: "/api/spotify/categories/errorhandling",
    controller: spotifyController,
    action: "errorhandlingCategory"
}, {
    method: "get",
    route: "/api/spotify/search/track",
    controller: spotifyController,
    action: "searchTrack"
}, {
    method: "get",
    route: "/api/spotify/search/track",
    controller: spotifyController,
    action: "getUserInfo"
}, {
    method: "post",
    route: "/forum/post",
    controller: postController,
    action: "createPost",
}]