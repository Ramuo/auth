import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.EMAIL_PASS
    }

})


const sendEmail = async (to, subject, body) => {

    let mailOptions = {
        to,
        from: process.env.USER_EMAIL,
        subject,
        html: body
    }


    await new Promise((resolve, reject) => {

        transporter.sendMail(mailOptions, (err, res) => {

            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                console.log(res);
                resolve(res)
            }

        })


    })

}

export default sendEmail





// import nodemailer from "nodemailer";
// import dotenv from 'dotenv';
// dotenv.config();


// const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         service: gmail,
//         auth: {
//             user: process.env.USER_EMAIL,
//             pass: process.env.EMAIL_PASS
//         },

//     });

//     //Send email with defined transport object
//     const message = {
//         from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
//         to: options.email,
//         subject: options.subject,
//         html: options.message
//     };

//     const info = await transporter.sendMail(message);

//     console.log("Message sent: %s", info.messageId);
// };

// export default sendEmail;