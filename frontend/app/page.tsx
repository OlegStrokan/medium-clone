import Image from 'next/image'
import {LogIn} from "@/app/components/auth/LogIn";
import {SignIn} from "@/app/components/auth/SignIn";

export default function Home() {
  return (
      <div>
          <SignIn />
          <LogIn />
      </div>
  )
}

