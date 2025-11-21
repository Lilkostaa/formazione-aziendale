'use client'

import { useActionState } from 'react'
import { authenticate } from '@/app/actions/auth'
import { User, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function Page() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e40af]"> {}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        
        {/* Header con Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            {}
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

        {/* Form di Login */}
        <form action={formAction} className="space-y-4">
          
          {/* Input Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              id="email"
              type="email"
              name="email"
              placeholder="nome.cognome@dieffe.tech"
              required
            />
          </div>

          {/* Input Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••••••••••"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* Messaggio di Errore */}
          {errorMessage && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md text-sm">
              <AlertCircle className="h-5 w-5" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Bottone Submit */}
          <button
            type="submit"
            aria-disabled={isPending}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Accesso in corso...' : 'Accedi'}
          </button>

          {/* Password Dimenticata */}
          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-500 hover:text-blue-400">
                Password dimenticata?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}