import { NextResponse } from "next/server";
import crypto from "crypto";

// optional if you want to restrict methods
export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
        }

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            console.warn("Invalid signature", { generated_signature, razorpay_signature });
            return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
        }

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err: any) {
        console.error("verify-payment error:", err);
        return NextResponse.json(
            { ok: false, error: err.message || "Server error" },
            { status: 500 }
        );
    }
}

export function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
