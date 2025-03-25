import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'
import { UserDatabase } from '@/database/useUserDatabase';
import { useSQLiteContext } from 'expo-sqlite';

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
    const database = useSQLiteContext();

    const login = async (email: string, password: string) => {
        setError(null)
        setIsPending(true)

        try {
            const query = "SELECT * FROM users WHERE email LIKE ? AND password LIKE ?";
            const user = await database.getFirstAsync<UserDatabase>(query, [email, password]);
            await AsyncStorage.setItem("@Auth:user", JSON.stringify(user))

            dispatch({ type: 'LOGIN', payload: user })

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

    return { login, isPending, error }
}