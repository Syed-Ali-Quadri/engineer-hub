"use client";

import { useCallback } from "react";
import axios from "axios";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface CheckoutArgs {
    amount: number;       // rupees
    items?: any[];
    userId?: string;
}

export function useRazorpayCheckout() {

    const checkout = useCallback(async ({ amount }: CheckoutArgs) => {
        try {
            // Create order → amount in paise
            const { data } = await axios.post("/api/create-order", {
                amount: Math.round(amount * 100),
            });

            const { order } = data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Your Marketplace",
                description: "Order Payment",
                order_id: order.id,
                handler: async function (response: any) {
                    await axios.post("/api/verify-order", {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    window.location.href = "/order-success";
                },
                theme: { color: "#3399cc" },
            };

            // Load Razorpay script
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;

            script.onload = () => {
                const rzp = new window.Razorpay(options);

                rzp.on("payment.failed", function (response: any) {
                    console.error("Payment failed", response);
                });

                rzp.open();
            };

            document.body.appendChild(script);

        } catch (err) {
            console.error("Checkout error:", err);
        }
    }, []);

    return { checkout };
}
