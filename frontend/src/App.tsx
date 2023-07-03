import {useLoginMutation} from "./api/api";

export const App = () => {

    const { data, loading, } = useLoginMutation({ email: "oleg14ua71@gmail.com", password: '258120'})
  return (
    <>
        {data && <div>{data}</div>}
        {loading && <div>{loading}</div>}
    </>
  )
}
