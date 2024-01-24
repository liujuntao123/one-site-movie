
export const setToken=async ()=>{
    const aliToken=getLocalstorage('ali_token')
    await useFetch('/api/get_token',{query:{aliToken}})
}