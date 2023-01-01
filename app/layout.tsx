import './globals.css'

import { Roboto } from '@next/font/google';

const inter = Roboto({
  subsets: ['latin'],
  weight: '500'
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="h-full w-full flex items-center justify-center flex-col bg-gradient-to-tr from-gradient-end to-gradient-start">{children}</body>
    </html>
  )
}
