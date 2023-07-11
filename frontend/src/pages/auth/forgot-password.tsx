import { useRouter } from 'next/router'

interface ILogin {
    isAuth: boolean
    userId: number | null
}

const ForgotPasswordPage = ({ isAuth, userId }: ILogin) => {
    const router = useRouter()

    if (isAuth) {
        return router.push('/feed')
    }

    return <div className=""></div>
}
export default ForgotPasswordPage
