import connectDB from "@/db";
import { User } from "@/models/user.model";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
    if (!WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    await connectDB();

    const headerPayload = headers();
    const svix_id = (await headerPayload).get("svix-id");
    const svix_timestamp = (await headerPayload).get("svix-timestamp");
    const svix_signature = (await headerPayload).get("svix-signature");

    if (!svix_id || !svix_signature || !svix_timestamp) {
        return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);
    const webhook = new Webhook(WEBHOOK_SECRET);

    let webhookEvent: WebhookEvent;

    try {
        webhookEvent = webhook.verify(body, {
            "svix-id": svix_id,
            "svix-signature": svix_signature,
            "svix-timestamp": svix_timestamp,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Webhook verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle user creation or update
    if (webhookEvent.type === "user.created") {
        const user = webhookEvent.data;
        const primaryEmail = user.email_addresses.find(
            (e) => e.id === user.primary_email_address_id
        )?.email_address;

        try {
                // Create new user
                await User.create({
                    email: primaryEmail,
                    name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
                    profilePicture: user.image_url,
                    role: user.unsafe_metadata?.role,
                    username: user.username,
                    employeeType: user.unsafe_metadata?.employeeType,
                    engineeringField: user.unsafe_metadata?.engineeringField,
                });

            return NextResponse.json({ success: true }, { status: 200 });
        } catch (dbErr) {
            console.error("Database error:", dbErr);
            return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
        }
    } else if (webhookEvent.type === "user.updated") {
        const user = webhookEvent.data;
        const primaryEmail = user.email_addresses.find((e) => e.id === user.primary_email_address_id)?.email_address;

        try {
            // Update existing user
            await User.findOneAndUpdate(
                { email: primaryEmail },
                {
                    name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
                    profilePicture: user.image_url,
                    role: user.unsafe_metadata?.role,
                    username: user.username,
                    employeeType: user.unsafe_metadata?.employeeType,
                    engineeringField: user.unsafe_metadata?.engineeringField,
                },
                { new: true, runValidators: true }
            );

            return NextResponse.json({ success: true }, { status: 200 });
        } catch (dbErr) {
            console.error("Database error:", dbErr);
            return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
        }
    }

    return NextResponse.json({ success: true }, { status: 200 });
}
