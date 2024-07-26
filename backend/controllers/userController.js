import crypto from "crypto";
import User from "../models/userModel.js";
import asyncHandler from '../middleware/asyncHandler.js';
import bcrypt from "bcryptjs";
import generateToken from '../utils/generateToken.js';
import otp_generator from "otp-generator";
import sendEmail from "../utils/sendEmail.js";
import {getResetPasswordTemplate} from "../utils/emailTemplates.js";




//@desc     Register User
//@route    POST /api/users/register
//@access   Public
const register = asyncHandler(async(req, res)=>{
    const {name, email, password} = req.body;

    const userExist = await User.findOne({email});

    if(userExist){
        res.status(400);
        throw new Error("L'utilistaur existe déjà");
    };

    const verficationToken = otp_generator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false
    });

    const expires = new Date

    expires.setMinutes(expires.getMinutes() + 5)

    
    const user = await User({
        name: name,
        email: email,
        password: password,
        verficationToken: {
            token: verficationToken,
            expires: expires
        }
    });

    await user.save();

    const message = `<p>Please click on the link to verify your account <a href=${process.env.FRONTEND_URL}/verify/${verficationToken}>here</a></p>`
    
    const subject = `Verification Email`

    await sendEmail(user.email, subject, message)

    if(user){
        res.status(200).json({ msg: "Verfication link sent to your email." });  
    }else{
        res.status(400);
        throw new Error("Information invalide");
    };
});

//@desc     Email verification
//@route    GET /api/users/verify/:token
//@access   Public
const verifyUser = asyncHandler( async (req, res)=>{
    try {
        const { token } = req.params

        const isTokenValid = await User.findOne(
            {
                'verficationToken.token': token,
                'verficationToken.expires': { $gt: new Date() }
            })

    
        if (!isTokenValid) {
            //ask to Resend verification link if it expired or not verified
            return res.send(`<p>Token Invalid or Expired</p><a href="${process.env.FRONTEND_URL}/resend/verification/${token}">Resend Verification Mail</a>`)
            
        }

        if (isTokenValid.isVerified) {
            res.status(400);
            throw new Error("Account already verified successfully. Please Login")
        };

        isTokenValid.isVerified = true;

        await isTokenValid.save();

        res.status(200).json({ message: "Account verified successfully" });  
    } catch (error) {
        res.status(404);
        throw new Error("Vérification failed");
    }
});

//@desc     Resend email verification
//@route    POST /api/users/verify/:token
//@access   Public
const resendVerification = asyncHandler( async (req, res)=>{
    try {
        const { token } = req.params

        const user = await User.findOne(
            {
                'verficationToken.token': token,
                'isVerified': false
            })

        const verficationToken = otp_generator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false
        });

        const expires = new Date;

        expires.setMinutes(expires.getMinutes() + 5)

        user.verficationToken = {
            expires: expires,
            token: verficationToken
        };

        await user.save();

         const emailBody = `<p>Please click on the link to verify your account <a href=${process.env.FRONTEND_URL}/verify/${verficationToken}>Click here</a> Valid For 5 mins.</p>`

        const subject = `Resend Email Verification`

        await sendEmail(user.email, subject, emailBody)

        res.status(200).json({ message: "Please check your email for a new verification link" });  
    } catch (error) {
        res.status(404);
        throw new Error("Resend Email Vérification failed");
    }
})

//@desc     Login User
//@route    POST /api/auth/login
//@access   Public
const login = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;

    const user = await User.findOne({email});


    if(!user){
        res.status(400);
        throw new Error(`User with don't exist`);
    }

    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
        })
    }else{
        res.status(401);
        throw new Error("Email ou mot de passe invalide");
    };
});


//@desc     Login with google
//@route    POST /api/users/google
//@access   Public
const google = asyncHandler(async (req, res) => {
    const { email, name} = req.body;

    const user = await User.findOne({ email });

    if(user){
        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: true,
        });

        return;
    }

    if(!user){
        const generatedPassword = 
            Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(generatedPassword, 10);


        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: true,
        });

        await user.save();

        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: true,
        })
       
    }else{
        res.status(400);
        throw new Error("Une erreur s'est produite avec google"); 
    };  
});
//@desc     Login with facebook
//@route    POST /api/users/facebook
//@access   Public
const facebook = asyncHandler(async (req, res) => {
    const { email, name} = req.body;

    const user = await User.findOne({ email });

    if(user){
        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: true,
        });

        return;
    }

    if(!user){
        const generatedPassword = 
            Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(generatedPassword, 10);


        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: true,
        });

        await user.save();

        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: true,
        })
       
    }else{
        res.status(400);
        throw new Error("Une erreur s'est produite avec google"); 
    };  
});

//@desc     Logout / Clear the cookie
//@route    POST /api/auth/logout
//@access   Private
const logout = asyncHandler(async(req, res)=>{
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Déconnecté avec succès' });
});

// @desc      Forgot password
// @route     POST /api/auth/forgotpassword
// @access    Public
const forgotPassword = asyncHandler(async(req, res) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        res.status(404);
        throw new Error("There is no user with that email");
    };

    //Get reset token 
    const resetToken = user.getResetTokenPassword();
    console.log(resetToken); 

    await user.save({validateBeforeSave: false});

    //Create reset Url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name, resetUrl);

    const subject = `Fogot password`
                
    //Sending Email
    try {
        await sendEmail(user.email, subject, message);

        res.status(200).json({
            success: true,
            data: "Email sent"
        });
    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined,
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave: false});

        res.status(500);
        throw new Error("Email for forgot password could not be sent")
    };
});


// @desc      Reset password
// @route     PUT /api/users/resetpassword/:token
// @access    Public
const  resetpassword = asyncHandler(async(req, res) => {
    //Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
  
    //Find the user by token only if the expiration is greatter than right now
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()} //Expiry is greatter than right now
    });
  
  
    if(!user){
        res.status(400);
        throw new Error("Invalid Token")
    };
  
    //If we find the user & the token is not expired, then set new Password 
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
  
    await user.save();
  
    generateToken(res, user._id);
  
    res.status(200).json({
        _id: user._id,
        email: user.email,
        password: user.password
    });
});

export {
    register,
    verifyUser,
    resendVerification,
    login,
    google,
    facebook,
    logout,
    forgotPassword,
    resetpassword,
};
