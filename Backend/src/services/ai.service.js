import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet.")
        })
    }
)

const agent = createAgent({
    model: mistralModel,
    tools: [ searchInternetTool ],
})

export async function generateResponse(messages) {

    const formattedMessages = messages.map(msg => {
        if (msg.role == "user") {
            if (msg.image) {
                // multimodal message — text + image
                return new HumanMessage({
                    content: [
                        { type: "text", text: msg.content || "" },
                        { type: "image_url", image_url: { url: msg.image } }
                    ]
                })
            }
            return new HumanMessage(msg.content)
        } else if (msg.role == "ai") {
            return new AIMessage(msg.content)
        }
    })

    const response = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
                If the user shares an image, analyze it carefully and describe or answer questions about it.
            `),
            ...formattedMessages
        ]
    });

    return response.messages[ response.messages.length - 1 ].text;

}

export async function generateChatTitle(message) {
    const trimmed = message.trim()

    // agar message bahut chhota hai, AI se generic title lene ke bajaye
    // seedha message ko hi title bana do — har chat ka title unique rahega
    if (trimmed.split(/\s+/).length <= 3) {
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
    }

    const response = await mistralModel.invoke([
        new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
        `),
        new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
            `)
    ])

    return response.text;
}