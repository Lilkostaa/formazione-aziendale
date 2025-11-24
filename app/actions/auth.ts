'use server'
 
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
 
// Definiamo il tipo di stato per chiarezza
type AuthState = {
  error?: string
  success?: boolean
} | undefined

export async function authenticate(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  try {
    const email = formData.get('email')
    const password = formData.get('password')

    // redirect: false evita che signIn lanci l'errore NEXT_REDIRECT lato server
    await signIn('credentials', {
      email,
      password,
      redirect: false, 
    })
    
    // Se siamo arrivati qui, il login è riuscito!
    return { success: true }

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Credenziali non valide.' }
        default:
          return { error: 'Qualcosa è andato storto.' }
      }
    }
    // Se c'è un altro errore, lo rilanciamo
    throw error
  }
}