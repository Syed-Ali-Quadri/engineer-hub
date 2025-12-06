import instance from "@/utilities/razorpay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { amount, userId } = await req.json();

        if (!amount) {
            return NextResponse.json({ error: "amount required" }, { status: 400 });
        }

        const options = {
            amount: amount, // amount in paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            payment_capture: 1, // auto capture
            userId
        };

        const order = await instance.orders.create(options);


        return NextResponse.json({ ok: true, order }, { status: 200 });
    } catch (err: any) {
        console.error("create-order error:", err);
        return NextResponse.json(
            { error: err.message || "server error" },
            { status: 500 }
        );
    }
}
