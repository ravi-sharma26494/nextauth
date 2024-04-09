import User from "@/models/user.model";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async({email, emailType, userId}:{email: string, emailType: string, userId:string})=>{
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(),10);

        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId,{
                verifyToken: hashedToken, 
                verifyTokenExpiry: Date.now()+3600000
            });
        }else if(emailType === "RESET"){
             await User.findByIdAndUpdate(userId,{
                forgotPasswordToken: hashedToken, 
                forgotPasswordTokenExpiry: Date.now()+3600000
            });
        }
        
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "bb9f5768171e26",
                pass: "327ad05b3ec564"
            }
        });

        const mailOptions = {
            from: "ravi@ravi.ai",
            to: email,
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset Your Password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here to ${emailType === "VERIFY" ? "verify your email": "reset your password"} or copy paste the link below in your browser. <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</a></p>`,
        }

        // const mailResponse = await transporter.send(mailOptions);
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        throw new Error(error.message)
    }
}