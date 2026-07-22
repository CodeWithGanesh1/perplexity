import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()

    function handleNewChat() {
        dispatch(setCurrentChatId(null))
    }

    async function handleSendMessage({ message, chatId, image }) {
        // agar existing chat hai, user ka message turant dikhao (AI response ka wait kiye bina)
        if (chatId) {
            dispatch(addNewMessage({
                chatId,
                content: message,
                role: "user",
                image: image || null,
                id: crypto.randomUUID(),
            }))
        }

        dispatch(setLoading(true))

        const data = await sendMessage({ message, chatId, image })
        const { chat, aiMessage } = data

        const resolvedChatId = chatId || chat?._id

        // naya chat tha — ab banega, aur user ka message bhi ab dikhega
        if (!chatId && chat) {
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title,
            }))
            dispatch(addNewMessage({
                chatId: resolvedChatId,
                content: message,
                role: "user",
                image: image || null,
                id: crypto.randomUUID(),
            }))
        }

        dispatch(addNewMessage({
            chatId: resolvedChatId,
            content: aiMessage.content,
            role: aiMessage.role,
            id: crypto.randomUUID(),
        }))

        dispatch(setCurrentChatId(resolvedChatId))
        dispatch(setLoading(false))
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[ chat._id ] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId, chats) {

        console.log(chats[ chatId ]?.messages.length)

        if (chats[ chatId ]?.messages.length === 0) {
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                id: msg._id || crypto.randomUUID(),
                content: msg.content,
                role: msg.role,
                image: msg.image || null,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }
        dispatch(setCurrentChatId(chatId))
    }


    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleNewChat
    }

}