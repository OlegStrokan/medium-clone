import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


interface ILogin {
    isAuth: boolean;
    userId: number | null,
}

const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
  });


const SigninPage = ({ isAuth, userId }: ILogin) => {


    const router = useRouter();

    if (isAuth) {
        return router.push('/feed')
    }

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
      });
    
      const onSubmit = (data: any) => {
        console.log(data); // Handle form submission
      };
    

    return (
                <div className="">
 <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700">Email</label>
        <input type="text" id="email" {...register('email')} className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`} />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700">Password</label>
        <input type="password" id="password" {...register('password')} className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`} />
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot password?</a>
        </div>
        <div>
          <a href="/register" className="text-blue-500 hover:underline">Don't have an account?</a>
        </div>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600">Sign In</button>
    </form>
                </div>
    )
}

export default SigninPage