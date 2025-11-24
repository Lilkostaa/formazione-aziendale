'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
// Componenti UI
import { Input } from '@/app/components/ui/Input'
import { Button } from '@/app/components/Button'
import { Alert } from '@/app/components/ui/Alert'

function SetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // --- FUNZIONE DI VALIDAZIONE ---
  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return "La password deve essere di almeno 8 caratteri."
    }
    if (!/[A-Z]/.test(pwd)) {
      return "La password deve contenere almeno una lettera Maiuscola."
    }
    if (!/[a-z]/.test(pwd)) {
      return "La password deve contenere almeno una lettera minuscola."
    }
    if (!/[0-9]/.test(pwd)) {
      return "La password deve contenere almeno un Numero."
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return "La password deve contenere almeno un carattere speciale (es. ! @ # $)."
    }
    return null // Nessun errore
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('idle')
    setMessage('')

    // 1. Controllo validità password forte
    const passwordError = validatePassword(password)
    if (passwordError) {
      setStatus('error')
      setMessage(passwordError)
      return
    }
    
    // 2. Controllo corrispondenza
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
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message)
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center animate-fade-in">
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
        <Input
          label="Nuova Password"
          type="password"
          required
          // Rimuovi minLength HTML per lasciare gestire l'errore alla nostra funzione custom
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // Mostra un piccolo suggerimento sotto l'input
          helperText="Min. 8 caratteri, 1 Maiuscola, 1 Numero, 1 Speciale"
        />

        <Input
          label="Conferma Password"
          type="password"
          required
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {status === 'error' && (
          <Alert variant="danger" title="Attenzione">
            {message}
          </Alert>
        )}

        <Button
          type="submit"
          isLoading={status === 'loading'}
          className="w-full"
        >
          Imposta Password
        </Button>
      </form>
    </>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <Suspense fallback={<div className="text-center text-gray-500">Caricamento...</div>}>
          <SetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}