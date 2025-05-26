import { useState, useEffect } from 'react'
import { UserDatabase, useUserDatabase } from '@/database/useUserDatabase';

export const useSignin = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { create } = useUserDatabase()

    const signin = async (data: UserDatabase) => {
        setError(null)
        setIsPending(true)

        try {
            await create(data)
            if (!isCancelled) {
                setIsPending(false)
                setError(null)
            }
        } catch (err: any) {
            if (!isCancelled) {
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { signin, isPending, error }
}