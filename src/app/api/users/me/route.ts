import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";

import {NextRequest, NextResponse} from "next/server";

import { getDataFromToken } from "@/helpers/getDataFromToken";

connectDB();

export async function POST(request: NextRequest, response: NextResponse){
    //EXTRACT DATA FROM TOKEN
    const userId = await getDataFromToken(request);
    const user =  await User.findOne({_id: userId}).select("-password");

    console.log("After extracting data from token, quering the db...");
    console.log(user);

    if(!user){
            return NextResponse.json(
                {error: "User not found"},
                {status: 400}
            );
        }
    return NextResponse.json({
        message: "User Found",
        data: user
    });
}