import express from 'express';
import {
    register,
    login,
    google,
    facebook,
    logout, 
    verifyUser,
    resendVerification,
    forgotPassword,
    resetpassword
} from '../controllers/userController.js';
import {protect, admin} from '../middleware/authMiddleware.js';
import checkObjectId from "../middleware/checkObjectId.js"

const router = express.Router();


router.route('/login').post(login);
router.route('/google').post(google);
router.route('/facebook').post(facebook);
router.route('/register').post(register);
router.route('/logout').post(logout);
router.route('/verify/:token').get(verifyUser);
router.route("/resend/verify/:token").get(resendVerification);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").put(resetpassword);





export default router;