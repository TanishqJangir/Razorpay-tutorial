import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";


const generatedSignature = (
    razorpayOrderId: string,
    razorpayPaymentId: string
) => {

    const keySecret = process.env.RAZORPAY_SECRET_ID    ;

    const sig = crypto
        .createHmac("sha256", keySecret!)
        .update(razorpayOrderId + "|" + razorpayPaymentId)
        .digest("hex");

    return sig;
};

export const POST = async (req: NextRequest) => {
    const { orderId, razorpayPaymentId, razorpaySignature } = await req.json();

    const signature = generatedSignature(orderId, razorpayPaymentId);
    if (signature !== razorpaySignature) {
        return NextResponse.json({
            message: "Payment Verified Failed",
            isOk: false
        }, { status: 400 });
    }


    return NextResponse.json({
        message: "payment verified successfully",
        isOk: true
    }, { status: 200 });
}