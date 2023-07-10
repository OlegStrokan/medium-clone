import { Inter } from 'next/font/google'
import { useLoginMutation } from '@/api/api'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [ login, { data, error }] = useLoginMutation()

  useEffect(() => {
    login({ email: "oleg14ua71@gmail.com", password: "258120"})

  }, [login])


  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
    
    </main>
  )
}
