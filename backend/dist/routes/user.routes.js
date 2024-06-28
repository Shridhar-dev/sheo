import { Router } from 'express';
import { changeUserPassword, getHistory, getUser, login, logout, signup, updateUser } from '../controllers/user.controllers.js';
import { checkIfUserIsAuthenticated, resize, uploadImage, verifyJWT } from '../middlewares/user.middleware.js';
const router = Router();
router.route("/signup")
    .post(signup);
router.route("/login")
    .post(login);
router.route("/logout")
    .get(verifyJWT, logout);
router.route("/update/password")
    .patch(verifyJWT, changeUserPassword);
router.route("/update")
    .patch(verifyJWT, uploadImage, resize, updateUser);
router.route("/history")
    .get(checkIfUserIsAuthenticated, getHistory);
router.route("/")
    .get(checkIfUserIsAuthenticated, getUser);
export default router;
