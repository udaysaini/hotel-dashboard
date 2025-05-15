'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { TaskProvider } from '@/contexts/TaskContext'
import GlobalActions from '@/components/GlobalActions'
import dynamic from 'next/dynamic'

const ClientThemeProvider = dynamic(
  () => import('@/components/ClientThemeProvider'),
  { ssr: false }
)

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body className={inter.className}>
        <ClientThemeProvider>
          <TaskProvider>
            {children}
            <GlobalActions />
          </TaskProvider>
        </ClientThemeProvider>
      </body>
    </html>
  )
}
