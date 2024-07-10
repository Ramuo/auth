import express from 'express';
import {
    register,
    login,
    logout, 
    verifyUser,
    resendVerification,
} from '../controllers/userController.js';
import {protect, admin} from '../middleware/authMiddleware.js';
import checkObjectId from "../middleware/checkObjectId.js"

const router = express.Router();


router.route('/login').post(login);
router.route('/register').post(register);
router.route('/logout').post(logout);
router.route('/verify/:token').get(verifyUser);
router.route("/resend/verify/:token").get(resendVerification)





export default router;