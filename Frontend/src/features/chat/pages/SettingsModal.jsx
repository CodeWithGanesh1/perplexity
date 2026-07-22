import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../../auth/auth.slice'

const translations = {
  en: {
    settings: 'Settings',
    language: 'Language',
    profile: 'Profile',
    security: 'Security',
    username: 'Username',
    save: 'Save changes',
    currentPassword: 'Current password',
    newPassword: 'New password',
    changePassword: 'Change password',
    selectLanguage: 'Select language',
    close: 'Close',
  },
  hi: {
    settings: 'सेटिंग्स',
    language: 'भाषा',
    profile: 'प्रोफ़ाइल',
    security: 'सुरक्षा',
    username: 'यूज़रनेम',
    save: 'बदलाव सहेजें',
    currentPassword: 'मौजूदा पासवर्ड',
    newPassword: 'नया पासवर्ड',
    changePassword: 'पासवर्ड बदलें',
    selectLanguage: 'भाषा चुनें',
    close: 'बंद करें',
  },
}

export const useLanguage = () => {
  const [ lang, setLang ] = useState(() => localStorage.getItem('appLanguage') || 'en')

  const changeLang = (code) => {
    localStorage.setItem('appLanguage', code)
    setLang(code)
  }

  const t = (key) => translations[ lang ]?.[ key ] || translations.en[ key ] || key

  return { lang, changeLang, t }
}

export const SettingsModal = ({ onClose, currentUser, lang, changeLang, t }) => {
  const dispatch = useDispatch()
  const [ tab, setTab ] = useState('profile') // 'profile' | 'security' | 'language'
  const [ username, setUsername ] = useState(currentUser?.username || '')
  const [ currentPassword, setCurrentPassword ] = useState('')
  const [ newPassword, setNewPassword ] = useState('')
  const [ status, setStatus ] = useState(null) // { type: 'success'|'error', message }
  const [ loading, setLoading ] = useState(false)

  const handleUpdateUsername = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('http://localhost:3000/api/auth/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username }),
      })
      const data = await res.json()
      if (data.success) {
        dispatch(setUser(data.user))
        setStatus({ type: 'success', message: 'Username updated!' })
      } else {
        setStatus({ type: 'error', message: data.message })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Something went wrong' })
    }
    setLoading(false)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('http://localhost:3000/api/auth/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus({ type: 'success', message: 'Password changed!' })
        setCurrentPassword('')
        setNewPassword('')
      } else {
        setStatus({ type: 'error', message: data.message })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Something went wrong' })
    }
    setLoading(false)
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]' onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className='flex h-[480px] w-[560px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#131413] shadow-[0_20px_70px_rgba(0,0,0,0.6)]'
      >
        {/* Tabs */}
        <div className='w-[160px] shrink-0 border-r border-white/[0.07] p-3'>
          <p className='mb-3 px-2 text-[16px] font-semibold text-white'>{t('settings')}</p>
          {[
            { key: 'profile', label: t('profile') },
            { key: 'security', label: t('security') },
            { key: 'language', label: t('language') },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => { setTab(item.key); setStatus(null) }}
              className={`mb-1 block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${
                tab === item.key ? 'bg-white/[0.08] text-white' : 'text-white/55 hover:bg-white/[0.05] hover:text-white/85'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className='relative flex-1 p-6'>
          <button
            onClick={onClose}
            className='absolute right-4 top-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-white/40 hover:bg-white/[0.07] hover:text-white/80'
          >
            <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
              <path d='M18 6 6 18M6 6l12 12' />
            </svg>
          </button>

          {tab === 'profile' && (
            <form onSubmit={handleUpdateUsername} className='flex flex-col gap-4'>
              <h2 className='text-[17px] font-medium text-white'>{t('profile')}</h2>
              <div>
                <label className='mb-1.5 block text-[13px] text-white/50'>{t('username')}</label>
                <input
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='w-full rounded-lg border border-white/[0.09] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white outline-none focus:border-white/25'
                />
              </div>
              <button
                type='submit'
                disabled={loading}
                className='w-fit cursor-pointer rounded-lg bg-[#ece9e1] px-4 py-2 text-[13.5px] font-medium text-[#0b0c0c] transition-colors hover:bg-white disabled:opacity-50'
              >
                {t('save')}
              </button>
            </form>
          )}

          {tab === 'security' && (
            <form onSubmit={handleChangePassword} className='flex flex-col gap-4'>
              <h2 className='text-[17px] font-medium text-white'>{t('security')}</h2>
              <div>
                <label className='mb-1.5 block text-[13px] text-white/50'>{t('currentPassword')}</label>
                <input
                  type='password'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className='w-full rounded-lg border border-white/[0.09] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white outline-none focus:border-white/25'
                />
              </div>
              <div>
                <label className='mb-1.5 block text-[13px] text-white/50'>{t('newPassword')}</label>
                <input
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className='w-full rounded-lg border border-white/[0.09] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white outline-none focus:border-white/25'
                />
              </div>
              <button
                type='submit'
                disabled={loading}
                className='w-fit cursor-pointer rounded-lg bg-[#ece9e1] px-4 py-2 text-[13.5px] font-medium text-[#0b0c0c] transition-colors hover:bg-white disabled:opacity-50'
              >
                {t('changePassword')}
              </button>
            </form>
          )}

          {tab === 'language' && (
            <div className='flex flex-col gap-3'>
              <h2 className='text-[17px] font-medium text-white'>{t('selectLanguage')}</h2>
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी (Hindi)' },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => changeLang(item.code)}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-[14.5px] transition-colors ${
                    lang === item.code
                      ? 'border-white/25 bg-white/[0.06] text-white'
                      : 'border-white/[0.08] text-white/60 hover:bg-white/[0.03]'
                  }`}
                >
                  {item.label}
                  {lang === item.code && (
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
                      <path d='M20 6 9 17l-5-5' />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}

          {status && (
            <p className={`mt-4 text-[13px] ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
              {status.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}