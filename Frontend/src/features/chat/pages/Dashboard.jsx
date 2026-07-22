// import React, { useEffect, useState } from 'react'
// import ReactMarkdown from 'react-markdown'
// import { useSelector } from 'react-redux'
// import { useChat } from '../hooks/useChat'
// import remarkGfm from 'remark-gfm'
// import { formatRelativeTime } from '../../../utils/formatTime'


// const Dashboard = () => {
//   const chat = useChat()
//   const [ chatInput, setChatInput ] = useState('')
//   const [ searchQuery, setSearchQuery ] = useState('')
//   const chats = useSelector((state) => state.chat.chats)
//   const currentChatId = useSelector((state) => state.chat.currentChatId)

//   useEffect(() => {
//     chat.initializeSocketConnection()
//     chat.handleGetChats()
//   }, [])

//   const handleSubmitMessage = (event) => {
//     event.preventDefault()

//     const trimmedMessage = chatInput.trim()
//     if (!trimmedMessage) {
//       return
//     }

//     chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
//     setChatInput('')
//   }

//   const openChat = (chatId) => {
//     chat.handleOpenChat(chatId,chats)
//   }

//   return (
//     <main className='min-h-screen w-full bg-[#07090f] p-3 text-white md:p-5'>
//       <section className='mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 rounded-3xl border   p-1 md:h-[calc(100vh-2.5rem)] md:gap-6 md:p-1 border-none'>
//       <aside className='hidden h-full w-72 shrink-0 rounded-3xl border  bg-[#080b12] p-4 md:flex md:flex-col'>
//   <h1 className='mb-5 text-3xl font-semibold tracking-tight'>Perplexity</h1>

//   <button
//     onClick={() => chat.handleNewChat()}
//     type='button'
//     className='mb-4 flex w-full cursor-pointer items-center gap-2 rounded-xl border border-white/60 bg-white/10 px-3 py-2 text-left text-base font-semibold text-white transition hover:bg-white/20'
//   >
//     + New Chat
//   </button>

//   <input
//     type='text'
//     value={searchQuery}
//     onChange={(e) => setSearchQuery(e.target.value)}
//     placeholder='Search chats...'
//     className='mb-4 w-full rounded-xl border border-white/30 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/70'
//   />

//   <div className='flex-1 space-y-1 overflow-y-auto'>
//     {Object.values(chats)
//       .filter((c) => c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
//       .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
//       .map((c) => (
//         <button
//           onClick={() => { openChat(c.id) }}
//           key={c.id}
//           type='button'
//           className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition hover:bg-white/10 ${
//             currentChatId === c.id ? 'bg-white/15 text-white' : 'text-white/80'
//           }`}
//         >
//           <span className='truncate'>{c.title}</span>
//           <span className='ml-2 shrink-0 text-xs text-white/40'>
//             {formatRelativeTime(c.lastUpdated)}
//           </span>
//         </button>
//       ))}
//   </div>
// </aside> 
       

//         <section className='relative max-w-3/5 mx-auto flex h-full min-w-0 flex-1 flex-col gap-4'>

//           <div className='messages flex-1 space-y-3 overflow-y-auto pr-1 pb-30'>
//             {chats[ currentChatId ]?.messages.map((message) => (
//               <div
// key={message.id || index}
//                 className={`max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base ${message.role === 'user'
//                     ? 'ml-auto rounded-br-none bg-white/12 text-white'
//                     : 'mr-auto border-none text-white/90'
//                   }`}
//               >
//                 {message.role === 'user' ? (
//                   <p>{message.content}</p>
//                 ) : (
//                   <ReactMarkdown
//                     components={{
//                       p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
//                       ul: ({ children }) => <ul className='mb-2 list-disc pl-5'>{children}</ul>,
//                       ol: ({ children }) => <ol className='mb-2 list-decimal pl-5'>{children}</ol>,
//                       code: ({ children }) => <code className='rounded bg-white/10 px-1 py-0.5'>{children}</code>,
//                       pre: ({ children }) => <pre className='mb-2 overflow-x-auto rounded-xl bg-black/30 p-3'>{children}</pre>
//                     }}
//                     remarkPlugins={[remarkGfm]}
//                   >
//                     {message.content}
//                   </ReactMarkdown>
//                 )}
//               </div>
//             ))}
//           </div>

//           <footer className='rounded-3xl w-full absolute bottom-2 border border-white/60 bg-[#080b12] p-4 md:p-5'>
//             <form onSubmit={handleSubmitMessage} className='flex flex-col gap-3 md:flex-row'>
//               <input
//                 type='text'
//                 value={chatInput}
//                 onChange={(event) => setChatInput(event.target.value)}
//                 placeholder='Type your message...'
//                 className='w-full rounded-2xl border border-white/50 bg-transparent px-4 py-3 text-lg text-white outline-none transition placeholder:text-white/45 focus:border-white/90'
//               />
//               <button
//                 type='submit'
//                 disabled={!chatInput.trim()}
//                 className='rounded-2xl border border-white/60 px-6 py-3 text-lg font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50'
//               >
//                 Send
//               </button>
//             </form>
//           </footer>
//         </section>
//       </section>
//     </main>
//   )
// }

// export default Dashboard

import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import remarkGfm from 'remark-gfm'
import { setUser } from '../../auth/auth.slice'
import { SettingsModal, useLanguage } from './SettingsModal'

const Dashboard = () => {
  const chat = useChat()
  const dispatch = useDispatch()
  const [ chatInput, setChatInput ] = useState('')
  const [ searchQuery, setSearchQuery ] = useState('')
  const [ sidebarOpen, setSidebarOpen ] = useState(false)
  const [ menuOpen, setMenuOpen ] = useState(false)
  const [ settingsOpen, setSettingsOpen ] = useState(false)
const { lang, changeLang, t } = useLanguage()
  const sidebarRef = useRef(null)
  const menuRef = useRef(null)

  const isLoading = useSelector((state) => state.chat.isLoading)

  const [ selectedImage, setSelectedImage ] = useState(null)   // base64 string
const [ attachMenuOpen, setAttachMenuOpen ] = useState(false)
const fileInputRef = useRef(null)
const attachMenuRef = useRef(null)


  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const currentUser = useSelector((state) => state.auth?.user)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false)
      }
    }
    if (sidebarOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ sidebarOpen ])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ menuOpen ])

  // close the attach ("+") dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target)) {
        setAttachMenuOpen(false)
      }
    }
    if (attachMenuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ attachMenuOpen ])

  // convert the selected file to a base64 data URL for preview + sending
  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setSelectedImage(reader.result)
    reader.readAsDataURL(file)
    setAttachMenuOpen(false)
    e.target.value = ''
  }

  const handleSubmitMessage = (event) => {
    event.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage && !selectedImage) return
    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId, image: selectedImage })
    setChatInput('')
    setSelectedImage(null)
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
    setSidebarOpen(false)
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Logout failed', err)
    }
    dispatch(setUser(null))
    setMenuOpen(false)
    window.location.href = '/login'
  }

  const currentMessages = chats[ currentChatId ]?.messages || []

  const sortedChats = Object.values(chats)
    .filter((c) => c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))

  const firstName = currentUser?.username || 'Guest'
  const email = currentUser?.email || ''

  // shared image preview chip shown above the input when an image is attached
  const ImagePreviewChip = () => (
    selectedImage && (
      <div className='mb-2 flex items-center gap-2'>
        <div className='relative'>
          <img src={selectedImage} alt='preview' className='h-16 w-16 rounded-lg object-cover' />
          <button
            type='button'
            onClick={() => setSelectedImage(null)}
            className='absolute -right-1.5 -top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black text-white'
          >
            <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round'>
              <path d='M18 6 6 18M6 6l12 12' />
            </svg>
          </button>
        </div>
      </div>
    )
  )

  // shared "+" attach button + dropdown + hidden file input
  const AttachButton = () => (
    <div className='relative' ref={attachMenuRef}>
      <button
        type='button'
        onClick={() => setAttachMenuOpen((v) => !v)}
        className='flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white'
      >
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
          <path d='M12 5v14M5 12h14' />
        </svg>
      </button>

      {attachMenuOpen && (
        <div className='absolute bottom-[calc(100%+8px)] left-0 w-[220px] rounded-xl border border-white/[0.09] bg-[#1c1d1c] p-1.5 shadow-[0_16px_50px_rgba(0,0,0,0.55)]'>
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[14px] text-white/85 transition-colors hover:bg-white/[0.07]'
          >
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><rect x='3' y='3' width='18' height='18' rx='2' /><circle cx='8.5' cy='8.5' r='1.5' /><path d='m21 15-5-5L5 21' /></svg>
            Add files or photos
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleImageSelect}
        className='hidden'
      />
    </div>
  )

  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-[#0b0c0c] text-[#ece9e1]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Slim rail */}
      <div className='hidden h-full w-[64px] shrink-0 flex-col items-center justify-between border-r border-white/[0.05] py-5 md:flex'>
        <div className='flex flex-col items-center gap-5'>
          <button
            type='button'
            onClick={() => setSidebarOpen(true)}
            aria-label='Open sidebar'
            className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-white/50 transition-all duration-150 hover:bg-white/[0.06] hover:text-white'
          >
            <svg width='19' height='19' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round'>
              <path d='M3 6h18M3 12h18M3 18h18' />
            </svg>
          </button>

          <button
            onClick={() => chat.handleNewChat()}
            type='button'
            aria-label='New chat'
            className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-white/50 transition-all duration-150 hover:bg-white/[0.06] hover:text-white'
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
              <path d='M12 5v14M5 12h14' />
            </svg>
          </button>
        </div>

        <button
          type='button'
          onClick={() => setSidebarOpen(true)}
          className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[13px] font-semibold text-white/85 transition-all duration-150 hover:bg-white/15'
        >
          {firstName[0]?.toUpperCase()}
        </button>
      </div>

      {/* Overlay drawer */}
      <div
        className={`fixed inset-0 z-30 bg-black/55 backdrop-blur-[3px] transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <aside
          ref={sidebarRef}
          className={`flex h-full w-[320px] flex-col border-r border-white/[0.08] bg-[#111212] px-5 py-6 shadow-[0_0_80px_rgba(0,0,0,0.65)] transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className='mb-8 flex items-center justify-between'>
            <span
              className='text-[35px] font-semibold tracking-tight text-white'
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Perplexity
            </span>
            <button
              type='button'
              onClick={() => setSidebarOpen(false)}
              className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.07] hover:text-white/80'
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
                <path d='M18 6 6 18M6 6l12 12' />
              </svg>
            </button>
          </div>

          <button
            onClick={() => { chat.handleNewChat(); setSidebarOpen(false) }}
            type='button'
            className='mb-4 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/[0.09] px-4 py-3 text-[15px] font-medium text-white/85 transition-all duration-150 hover:border-white/25 hover:bg-white/[0.04]'
          >
            <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
              <path d='M12 5v14M5 12h14' />
            </svg>
            New chat
          </button>

          <div className='relative mb-6'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'
              className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30'>
              <circle cx='11' cy='11' r='8' />
              <path d='m21 21-4.3-4.3' />
            </svg>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search chats'
              className='w-full rounded-xl bg-white/[0.04] py-2.5 pl-10 pr-3 text-[15px] text-white outline-none transition-colors placeholder:text-white/30 focus:bg-white/[0.07]'
            />
          </div>

          <p className='mb-2 text-[12px] font-medium uppercase tracking-wide text-white/30'>Recents</p>

          <div className='flex-1 space-y-1 overflow-y-auto pb-2'>
            {sortedChats.map((c) => (
              <button
                onClick={() => openChat(c.id)}
                key={c.id}
                type='button'
                className={`block w-full cursor-pointer truncate rounded-xl px-3.5 py-3 text-left text-[15px] transition-colors ${
                  currentChatId === c.id
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/55 hover:bg-white/[0.05] hover:text-white/85'
                }`}
              >
                {c.title}
              </button>
            ))}
            {sortedChats.length === 0 && (
              <p className='px-3.5 py-2 text-[14px] text-white/25'>No chats yet</p>
            )}
          </div>

          <div className='relative border-t border-white/[0.07] pt-4' ref={menuRef}>
            {menuOpen && (
              <div className='absolute bottom-[calc(100%+10px)] left-0 w-[260px] rounded-2xl border border-white/[0.09] bg-[#1c1d1c] p-2 shadow-[0_16px_50px_rgba(0,0,0,0.55)]'>
                {email && (
                  <p className='truncate px-3.5 py-2.5 text-[13.5px] text-white/40'>{email}</p>
                )}

                <button
  type='button'
  onClick={() => { setSettingsOpen(true); setMenuOpen(false) }}
  className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[14.5px] text-white/85 transition-colors hover:bg-white/[0.07]'
>
  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='12' cy='12' r='3' /><path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' /></svg>
  {t('settings')}
</button>

               <button
  type='button'
  onClick={() => { setSettingsOpen(true); setMenuOpen(false) }}
  className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[14.5px] text-white/85 transition-colors hover:bg-white/[0.07]'
>
  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='12' cy='12' r='3' /><path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' /></svg>
  {t('Language')}
</button>

                <button type='button' className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[14.5px] text-white/85 transition-colors hover:bg-white/[0.07]'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='12' cy='12' r='10' /><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01' /></svg>
                  Get help
                </button>

                <div className='my-1.5 h-px bg-white/[0.08]' />

                <button type='button' className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[14.5px] text-white/85 transition-colors hover:bg-white/[0.07]'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M12 19V5M5 12l7-7 7 7' /></svg>
                  Upgrade plan
                </button>

                <div className='my-1.5 h-px bg-white/[0.08]' />

                <button
                  type='button'
                  onClick={handleLogout}
                  className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[14.5px] text-white/85 transition-colors hover:bg-white/[0.07]'
                >
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' /><path d='M16 17l5-5-5-5M21 12H9' /></svg>
                  Log out
                </button>
              </div>
            )}

            <button
              type='button'
              onClick={() => setMenuOpen((v) => !v)}
              className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-white/[0.06]'
            >
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[13px] font-semibold text-white/90'>
                {firstName[0]?.toUpperCase()}
              </div>
              <div className='flex flex-1 flex-col leading-tight'>
                <span className='truncate text-[15px] font-medium text-white/90'>{firstName}</span>
                <span className='text-[12.5px] text-white/35'>Free plan</span>
              </div>
              <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' className='text-white/30'>
                <path d='m18 15-6-6-6 6' />
              </svg>
            </button>
          </div>
        </aside>
      </div>

      {/* Main chat area */}
      <section className='relative flex h-full flex-1 flex-col overflow-hidden'>
       <div
  className='pointer-events-none absolute inset-0 transition-opacity duration-500'
  style={{
    background: `
      radial-gradient(45% 40% at 35% 25%, rgba(90,02,241,0.16) 0%, transparent 70%),
      radial-gradient(40% 35% at 65% 30%, rgba(168,85,247,0.12) 0%, transparent 70%)
    `
  }}
/>
        {currentMessages.length === 0 ? (
          <div className='relative z-10 flex h-full flex-col items-center justify-center px-6'>
            <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]'>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' className='text-white/60'>
                <circle cx='12' cy='12' r='9' />
                <path d='M9 9a3 3 0 0 1 5.83 1c0 2-2.83 2.5-2.83 4M12 17h.01' />
              </svg>
            </div>

            <h1
              className='mb-3 text-center text-[44px] font-medium leading-[1.15] tracking-tight text-white md:text-[52px]'
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {currentUser?.username ? `Welcome back, ${currentUser.username}` : 'Where should we begin?'}
            </h1>
            <p className='mb-12 text-[16px] text-white/40'>Ask anything, backed by real-time search.</p>

            <form onSubmit={handleSubmitMessage} className='w-full max-w-2xl'>
              <ImagePreviewChip />
              <div className='flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.025] px-3 py-2 transition-all duration-150 focus-within:border-white/25 focus-within:bg-white/[0.04]'>
                <AttachButton />
                <input
                  type='text'
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder='Ask anything...'
                  className='flex-1 bg-transparent py-2.5 text-[17px] text-white outline-none placeholder:text-white/35'
                />
                <button
                  type='submit'
                  disabled={!chatInput.trim() && !selectedImage}
                  className='flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#ece9e1] text-[#0b0c0c] transition-all duration-150 hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:scale-100 disabled:bg-white/[0.08] disabled:text-white/20'
                >
                  <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M12 19V5M5 12l7-7 7 7' />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className='relative z-10 flex-1 overflow-y-auto px-6 pb-44 pt-12 md:px-10'>
              <div className='mx-auto flex w-full max-w-3xl flex-col gap-9'>
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`animate-[fadeIn_0.25s_ease-out] ${message.role === 'user' ? 'flex justify-end' : ''}`}
                  >
                    {message.role === 'user' ? (
                      <div className='max-w-[80%] rounded-2xl bg-white/[0.07] px-5 py-3 text-[16.5px] leading-relaxed text-white'>
                        {message.image && (
                          <img src={message.image} alt='uploaded' className='mb-2 max-h-64 rounded-xl object-contain' />
                        )}
                        {message.content}
                      </div>
                    ) : (
                      <div className='text-[16.5px] leading-[1.7] text-white/90'>
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className='mb-3.5 last:mb-0'>{children}</p>,
                            ul: ({ children }) => <ul className='mb-3.5 list-disc space-y-2 pl-5'>{children}</ul>,
                            ol: ({ children }) => <ol className='mb-3.5 list-decimal space-y-2 pl-5'>{children}</ol>,
                            strong: ({ children }) => <strong className='font-semibold text-white'>{children}</strong>,
                            code: ({ children }) => <code className='rounded-md bg-white/[0.09] px-1.5 py-0.5 text-[14.5px] text-white/95'>{children}</code>,
                            pre: ({ children }) => <pre className='mb-3.5 overflow-x-auto rounded-xl border border-white/[0.07] bg-black/40 p-4'>{children}</pre>
                          }}
                          remarkPlugins={[remarkGfm]}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
  <div className='flex items-center gap-1.5 py-1'>
    <span className='h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:-0.3s]'></span>
    <span className='h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:-0.15s]'></span>
    <span className='h-2 w-2 animate-bounce rounded-full bg-white/40'></span>
  </div>
)}
              </div>
            </div>

            <div className='absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-[#0b0c0c] via-[#0b0c0c]/95 to-transparent pb-7 pt-12'>
              <div className='mx-auto w-full max-w-2xl px-6 md:px-10'>
                <form
                  onSubmit={handleSubmitMessage}
                  className='flex flex-col gap-2 rounded-2xl border border-white/[0.09] bg-[#151615] px-3 py-2 shadow-[0_12px_45px_rgba(0,0,0,0.45)] transition-all duration-150 focus-within:border-white/25'
                >
                  <div className='px-2'>
                    <ImagePreviewChip />
                  </div>
                  <div className='flex items-center gap-3 px-2 pb-1'>
                    <AttachButton />
                    <input
                      type='text'
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      placeholder='Ask anything...'
                      className='flex-1 bg-transparent py-2.5 text-[17px] text-white outline-none placeholder:text-white/35'
                    />
                    <button
                      type='submit'
                      disabled={!chatInput.trim() && !selectedImage}
                      className='flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#ece9e1] text-[#0b0c0c] transition-all duration-150 hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:scale-100 disabled:bg-white/[0.08] disabled:text-white/20'
                    >
                      <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M12 19V5M5 12l7-7 7 7' />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

{settingsOpen && (
  <SettingsModal
    onClose={() => setSettingsOpen(false)}
    currentUser={currentUser}
    lang={lang}
    changeLang={changeLang}
    t={t}
  />
)}

    </main>
  )
}

export default Dashboard