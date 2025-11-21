'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Lock, CheckCircle, AlertCircle } from 'lucide-react'

function SetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (password !== confirm) {
      setStatus('error')
      setMessage('Le password non coincidono')
      return
    }

    if (!token) {
      setStatus('error')
      setMessage('Token mancante. Controlla il link nella mail.')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/set-password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Errore generico')

      setStatus('success')
      setTimeout(() => router.push('/login'), 3000) // Redirect al login dopo 3 sec
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message)
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Impostata!</h2>
        <p className="text-gray-600">Verrai reindirizzato al login tra pochi secondi...</p>
      </div>
    )
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Imposta Password</h1>
        <p className="text-sm text-gray-500 mt-1">
          Crea una password sicura per il tuo account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nuova Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              required
              minLength={8}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Conferma Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            <AlertCircle className="h-5 w-5" />
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {status === 'loading' ? 'Salvataggio...' : 'Imposta Password'}
        </button>
      </form>
    </>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <Suspense fallback={<div>Caricamento...</div>}>
          <SetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}