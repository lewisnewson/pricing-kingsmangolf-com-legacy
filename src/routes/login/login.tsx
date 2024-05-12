// Login.tsx
import React, { useState } from "react"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { Input, Button } from "antd"

const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState(null)

	const navigate = useNavigate()

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(null) // Clear errors

		try {
			const auth = getAuth()
			await signInWithEmailAndPassword(auth, email, password)

			// Redirect to requests on success
			navigate("/requests")
		} catch (err: any) {
			setError(err.message)
		}
	}

	return (
		<div className="login-form">
			<h2>Login</h2>
			{error && <p className="error">{error}</p>}
			<form onSubmit={handleLogin}>
				<Input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button
					type="primary"
					htmlType="submit">
					Login
				</Button>
			</form>
		</div>
	)
}

export default Login
