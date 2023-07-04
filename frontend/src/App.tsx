import {useLoginMutation} from "./api/api";

export const App = () => {

    const [login, { data }] = useLoginMutation();

  
  
    return <>
        hello
        <button onClick={() => login({ email: "oleg14ua71@gmail.com", password: "258120"})}>Login</button>
        {data && <div> {data.user.email}</div>}
    </>

}
