import { useLoginMutation } from '@/api/auth.api'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const FeedPage = () => {
    const router = useRouter()
    const [, { data }] = useLoginMutation()

    useEffect(() => {
        if (!data) {
            router.push('/auth/login')
        }
    }, [data, router])

    return <div>Hello</div>
}

export default FeedPage
