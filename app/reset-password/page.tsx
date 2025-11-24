'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle, Copy, Check } from 'lucide-react'
// Componenti UI
import { Input } from '@/app/components/ui/Input'
import { Button } from '@/app/components/Button'
import { Alert } from '@/app/components/ui/Alert'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [magicLink, setMagicLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    setMagicLink(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-formazione/dipendenti/reset_password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Errore durante la richiesta')

      setStatus('success')
      // Se il backend restituisce il debug_link, lo mostriamo
      if (data.debug_link) {
        setMagicLink(data.debug_link)
      }
    } catch (error: any) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  const copyToClipboard = () => {
    if (magicLink) {
      navigator.clipboard.writeText(magicLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e40af] px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md animate-fade-in">
        
        {/* Success State */}
        {status === 'success' ? (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Controlla la tua email</h2>
              <p className="text-gray-500 mt-2">
                Abbiamo inviato le istruzioni per reimpostare la password a <span className="font-medium text-gray-900">{email}</span>.
              </p>
            </div>

            {/* DEBUG: Box Link Simulato */}
            {magicLink && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Debug (Simulazione Email)</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-blue-600 break-all flex-1 bg-white p-2 rounded border border-gray-100">
                    {magicLink}
                  </code>
                  <button onClick={copyToClipboard} className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-500">
                    {copied ? <Check size={16} className="text-green-600"/> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Clicca il link sopra per simulare il click dalla mail.
                </p>
              </div>
            )}

            <Link href="/login">
              <Button variant="outline" className="w-full">
                Torna al Login
              </Button>
            </Link>
          </div>
        ) : (
          // Form State
          <>
            <div className="mb-8">
              <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" /> Torna indietro
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Password dimenticata?</h1>
              <p className="text-sm text-gray-500 mt-2">
                Nessun problema. Inserisci la tua email e ti invieremo un link per reimpostarla.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Input
                  label="Email Aziendale"
                  type="email"
                  required
                  placeholder="nome.cognome@dieffe.tech"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
                {/* Icona mail decorativa */}
                <div className="absolute right-3 top-[34px] text-gray-400 pointer-events-none">
                  <Mail className="h-5 w-5" />
                </div>
              </div>

              {status === 'error' && (
                <Alert variant="danger" title="Errore">
                  {message}
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                isLoading={status === 'loading'}
              >
                Invia link di reset
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}