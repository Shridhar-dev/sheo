import { Router } from 'express';
import { checkIfUserIsAuthenticated, verifyJWT } from '../middlewares/user.middleware.js';
import { createChannel, getChannel } from '../controllers/channel.controllers.js';
import { resize, uploadImage } from '../middlewares/channel.middleware.js';
import { subscribe } from '../controllers/user.controllers.js';

const router:Router = Router();

router.route("/create")
      .post(verifyJWT, uploadImage, resize, createChannel)
router.route("/:id/subscribe")
      .post(checkIfUserIsAuthenticated, subscribe)
router.route("/:id")
      .get(checkIfUserIsAuthenticated, getChannel)

export default router