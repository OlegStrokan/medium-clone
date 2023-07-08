import { useRouter } from "next/router";


interface ILogin {
    isAuth: boolean;
    userId: number | null,
}


export const LoginPage = ({ isAuth, userId }: ILogin) => {


    const router = useRouter();



    return (
                <div className="">

                </div>
    )
}