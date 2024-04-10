import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";

import {NextRequest, NextResponse} from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest, response: NextResponse){
    try {
        const reqBody = await request.json();
        const {email, password} = reqBody;

        console.log("ReqBody Console from Login api", reqBody)

        const user = await User.findOne({ email});

        if(!user){
            return NextResponse.json(
                {error: "No User found with the provided details, check and try again"},
                {status: 400}
            );
        }
        console.log("User Exists");

        const validPassword = await bcryptjs.compare(password, user.password);
        if(!validPassword) {
             return NextResponse.json(
                {error: "Credentials do not match, check your email and password"},
                {status: 400}
            );
        }
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        }

        const token  = await jwt.sign(tokenData, process.env.TOKEN_SECERET!, {expiresIn: '1h'});

        const response = NextResponse.json({
            message: "Logged in successfully",
            success: true,
        });

        response.cookies.set("token", token,{
            httpOnly: true,
        });

        return response;
    } catch (error: any) {
         return NextResponse.json(
            {error: error.message},
            {status: error.status}
        );
    }
}