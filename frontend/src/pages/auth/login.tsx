import { useRouter } from "next/router";
import { useState } from "react";


interface ILogin {
    isAuth: boolean;
    userId: number | null,
}


 const LoginPage = ({ isAuth, userId }: ILogin) => {

    const router = useRouter();

    if (isAuth) {
        return router.push('/feed')
    }

    return (
                <div className="">
                    

                </div>
    )
}
export default LoginPage