import Razorpay from "razorpay"
import { NextRequest, NextResponse } from "next/server"
const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_ID
})

export const POST = async (req: NextRequest) => {
    const {amount} = await req.json();
    const order = await razorpay.orders.create({
        amount,
        currency: 'INR',

    });

    return NextResponse.json(order);
}