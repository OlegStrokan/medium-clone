import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { signinSchema } from '@/helpers/validators/signin.schema'
import { useLoginMutation } from '@/api/auth.api'

interface SigninFormValues {
    email: string
    password: string
    userName: string
    fullName: string
}

const LoginPage = () => {
    const router = useRouter()
    const [login, { data, isLoading, error }] = useLoginMutation()

    if (data) {
        return router.push('/feed')
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signinSchema),
    })

    const onSubmit = (formData: SigninFormValues) => {
        login({ ...formData })
    }

    return (
        <div className="">
            {isLoading ? (
                <div className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : null}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md mx-auto"
            >
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">
                        Email
                    </label>
                    <input
                        type="text"
                        id="email"
                        {...register('email')}
                        className={`w-full px-4 py-2 border ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded`}
                    />
                    {errors.email && (
                        <span className="text-red-500">
                            {errors.email.message}
                        </span>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        {...register('password')}
                        className={`w-full px-4 py-2 border ${
                            errors.password
                                ? 'border-red-500'
                                : 'border-gray-300'
                        } rounded`}
                    />
                    {errors.password && (
                        <span className="text-red-500">
                            {errors.password.message}
                        </span>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700">
                        Password
                    </label>
                    <input
                        id="userName"
                        {...register('userName')}
                        className={`w-full px-4 py-2 border ${
                            errors.userName
                                ? 'border-red-500'
                                : 'border-gray-300'
                        } rounded`}
                    />
                    {errors.userName && (
                        <span className="text-red-500">
                            {errors.userName.message}
                        </span>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="fullName" className="block text-gray-700">
                        Password
                    </label>
                    <input
                        id="fullName"
                        {...register('fullName')}
                        className={`w-full px-4 py-2 border ${
                            errors.fullName
                                ? 'border-red-500'
                                : 'border-gray-300'
                        } rounded`}
                    />
                    {errors.fullName && (
                        <span className="text-red-500">
                            {errors.fullName.message}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <a
                            href="login"
                            className="text-blue-500 hover:underline"
                        >
                            Already have a account?
                        </a>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-600"
                >
                    Sign In
                </button>
            </form>
        </div>
    )
}

export default LoginPage
