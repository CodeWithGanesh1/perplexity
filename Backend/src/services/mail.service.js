import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
);

export async function sendEmail({ to, subject, html, text }) {
    try {
        const result = await mailjet
            .post("send", { version: "v3.1" })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "gk9605873@gmail.com", // apna verified sender email
                            Name: "Perplexity",
                        },
                        To: [
                            {
                                Email: to,
                            },
                        ],
                        Subject: subject,
                        HTMLPart: html,
                        TextPart: text,
                    },
                ],
            });

        console.log("Email sent:", result.body);
        return result.body;
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
}