import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";

import {NextRequest, NextResponse} from "next/server";


connectDB();

export async function POST(request: NextRequest, response: NextResponse){
    try {
        const reqBody = await request.json();
        const {token} = reqBody;

        console.log("From request Body below is the token value");
        console.log(token)

        const user = await User.findOne({verifyToken: token, verifyTokenExpiry:{$gt: Date.now()}});
        console.log("Do user with this token exist?", user);

        if(!user){
            return NextResponse.json({error: "Invalid Token"}, {status: 400});
        }
        console.log("Got the user", user);

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();
        
        return NextResponse.json({message: "Email verified Successfully", success: true},{status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message},{status: 500})
    }
}