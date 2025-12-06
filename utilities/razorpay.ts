import Razorpay from "razorpay";

const instance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default instance;
