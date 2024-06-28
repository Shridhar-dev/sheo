import { Router } from 'express';
import { checkIfUserIsAuthenticated, verifyJWT } from '../middlewares/user.middleware.js';
import { createVideo, getAllVideos, getComments, getVideo, getVideoBySearch, likeVideo, replyToVideo, saveVideoToUser, updateVideo } from '../controllers/video.controllers.js';
import { resize, saveVideo, thumbnailResize, uploadThumbnail, uploadVideo } from '../middlewares/video.middleware.js';

const router:Router = Router();

router.route("/create")
      .post(verifyJWT, uploadVideo, saveVideo, resize, createVideo)
router.route("/update")
      .patch(verifyJWT, uploadThumbnail, thumbnailResize, updateVideo)
router.route("/all")
      .get(getAllVideos)
router.route("/reply")
      .post(verifyJWT,replyToVideo)
router.route("/like")
      .post(verifyJWT,likeVideo)
router.route("/search")
      .get(getVideoBySearch)
router.route("/:id/save")
      .post(verifyJWT,saveVideoToUser)
router.route("/:id/comments")
      .get(getComments)
router.route("/:id")
      .get(checkIfUserIsAuthenticated, getVideo)


export default router