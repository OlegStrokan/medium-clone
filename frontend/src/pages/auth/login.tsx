import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from '@/helpers/validators/login.schema'
import { useLoginMutation } from '@/api/auth.api'
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

interface ILogin {
    isAuth: boolean
    userId: number | null
}

interface LoginFormValues {
    email: string
    password: string
}

function first() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        console.log('first(): called')
    }
}

function second() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        console.log('second(): called')
    }
}

class ExampleClass {
    @first()
    @second()
    method() {
        console.log('method')
    }
}

const exampe = new ExampleClass()

exampe.method()

const LoginPage = ({ isAuth, userId }: ILogin) => {
    const authContext = useContext(AuthContext)

    const router = useRouter()

    if (isAuth) {
        return router.push('/feed')
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    })

    const [login, { data, isLoading, error }] = useLoginMutation()

    const onSubmit = (formData: LoginFormValues) => {
        login({ email: formData.email, password: formData.password })
            .then(() => {
                authContext.setAuthState({
                    isAuth: true,
                    user: data,
                    error: null,
                })
                router.push('/feed')
            })
            .catch(() => {
                authContext.setAuthState({
                    isAuth: false,
                    error: error,
                    user: null,
                })
            })
    }

    return (
        <div className="">
            {isLoading && <div>..loading</div>}
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
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <a
                            href="forgot-password"
                            className="text-blue-500 hover:underline"
                        >
                            Forgot password?
                        </a>
                    </div>
                    <div>
                        <a
                            href="signin"
                            className="text-blue-500 hover:underline"
                        >
                            Don't have an account?
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
