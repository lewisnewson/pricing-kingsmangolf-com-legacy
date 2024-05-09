// authContext.tsx
import { createContext, useState, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

const AuthContext = createContext<any>(null)

const AuthProvider = ({ children }: { children: any }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const auth = getAuth()

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsLoggedIn(!!user)
		})
		return unsubscribe
	}, [auth])

	return <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
