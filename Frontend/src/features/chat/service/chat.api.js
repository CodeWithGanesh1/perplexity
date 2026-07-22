import axios from "axios";

const api = axios.create({
    baseURL: "https://perplexity-a4uh.onrender.com",
    withCredentials: true,
})

export const sendMessage = async ({ message, chatId, image }) => {
    const response = await api.post("/api/chats/message", { message, chat: chatId, image })
    return response.data
}

export const getChats = async () => {
    const response = await api.get("/api/chats")
    return response.data
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`)
    return response.data
}