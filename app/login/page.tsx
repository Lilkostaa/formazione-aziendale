'use client'

import { useActionState, useState, useEffect } from 'react'
import { authenticate } from '@/app/actions/auth'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/app/components/ui/Input'
import { Button } from '@/app/components/Button'
import { Alert } from '@/app/components/ui/Alert'

export default function Page() {
  // Inizializziamo lo stato
  const [state, formAction, isPending] = useActionState(authenticate, undefined)
  const [showPassword, setShowPassword] = useState(false)

  // EFFETTO: Se il login ha successo, ricarica la pagina verso la Home
  useEffect(() => {
    if (state?.success) {
      // Questo forza un redirect "reale" del browser
      window.location.href = '/'
    }
  }, [state])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e40af]">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md animate-fade-in">
        
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="text-2xl font-bold text-gray-700 flex items-center">
              <span className="text-blue-500 text-3xl mr-1">d</span>dieffe.tech
            </div>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">design your future</p>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Accedi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Inserisci le tue credenziali per accedere al portale
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          
          <Input 
            label="Email"
            id="email"
            type="email"
            name="email"
            placeholder="nome.cognome@dieffe.tech"
            required
            autoComplete="email"
          />

          <div className="relative">
            <Input
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••••••••••"
              required
              minLength={6}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label={showPassword ? "Nascondi password" : "Mostra password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Mostra errore solo se presente nello stato */}
          {state?.error && (
            <Alert variant="danger" title="Errore di accesso">
              {state.error}
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isPending || state?.success} // Disabilita anche se successo (sta reindirizzando)
            isLoading={isPending || state?.success}
            className="w-full"
          >
            {state?.success ? 'Accesso eseguito...' : 'Accedi'}
          </Button>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link href="/reset-password" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
                Password dimenticata?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}