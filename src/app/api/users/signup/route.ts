import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";

import {NextRequest, NextResponse} from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";


connectDB();


export async function POST(request: NextRequest, response: NextResponse){
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody;
        // validation
        console.log(reqBody);

        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        console.log("Saved user", savedUser);

        // Send Verification email
        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id});
        return NextResponse.json({
            message: "User registration successful",
            succes: true,
            savedUser
        });

    } catch (error: any) {
        return NextResponse.json(
            {error: error.message},
            {status: error.status}
        );
    }
}