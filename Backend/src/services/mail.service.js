import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, text }) {
    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev", // testing ke liye; production mein apna verified domain daalna
        to,
        subject,
        html,
        text,
    });

    if (error) {
        console.error("Email sending failed:", error);
        throw error;
    }

    console.log("Email sent:", data);
    return data;
}