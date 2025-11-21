import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import type { Dipendente } from "@/types";

declare module "next-auth" {
  interface User {
    id: string;
    ruolo: string;
  }
  interface Session {
    user: {
      id: string;
      ruolo: string;
    } & import("next-auth").DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    ruolo: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(1) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          // Query diretta al DB
          const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM dipendenti WHERE email = ?', 
            [email]
          );
          
          const user = rows[0] as Dipendente;

          if (!user) return null;
          
          // Verifica password (se l'utente ha una password impostata)
          if (user.password) {
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) {
              // Ritorniamo l'oggetto utente per la sessione (convertendo ID a stringa per NextAuth)
              return {
                id: user.id.toString(),
                name: `${user.nome} ${user.cognome}`,
                email: user.email,
                ruolo: user.ruolo,
              };
            }
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // Aggiungiamo ruolo e id al token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.ruolo = user.ruolo;
      }
      return token;
    },
    // Rendiamo ruolo e id disponibili nella sessione lato client/server
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.ruolo = token.ruolo;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // La nostra pagina di login personalizzata
  },
});