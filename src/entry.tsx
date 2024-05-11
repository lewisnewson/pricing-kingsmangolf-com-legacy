import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider, AuthContext } from "./utils/contexts/auth"
import { getAuth, signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import styles from "./entry.module.scss"

// UI components
import { LogoutOutlined, PieChartOutlined, UserOutlined } from "@ant-design/icons"
import Logo from "./assets/images/kingsman_logo.webp"
import { Layout, Menu } from "antd"

// Routes
import Login from "./routes/login/login"
import Dashboard from "./routes/dashboard/dashboard"
import Partners from "./routes/partners/partners"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBin6Nme7HzvHgdYe43DdgYmQWin6K-pww",
	authDomain: "pricing-kingsmangolf-com.firebaseapp.com",
	projectId: "pricing-kingsmangolf-com",
	storageBucket: "pricing-kingsmangolf-com.appspot.com",
	messagingSenderId: "267670357763",
	appId: "1:267670357763:web:45e9289cddf07c867f8b36",
	measurementId: "G-VRQ49BM6Z0",
}

// Initialize Firebase
initializeApp(firebaseConfig)

const { Header, Content, Sider } = Layout

const items: any[] = [
	{ key: "dashboard", label: "Dashboard", icon: <PieChartOutlined /> },
	{ key: "partners", label: "Partners", icon: <UserOutlined /> },
	{ key: "sign_out", label: "Sign out", icon: <LogoutOutlined /> },
]

function AppRoutes() {
	// Get the isLoggedIn state from the AuthContext
	const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)

	const navigate = useNavigate()

	const onMenuClick = async (item: any) => {
		if (item.key === "sign_out") {
			const auth = getAuth()
			try {
				await signOut(auth)
				setIsLoggedIn(false)
				window.location.href = "/login"
			} catch (error) {
				console.error("Sign-out Error: ", error)
			}
		} else {
			navigate(`/${item.key}`)
		}
	}

	if (isLoggedIn) {
		return (
			<Layout style={{ minHeight: "100vh" }}>
				<Sider>
					<img
						className={styles.logo}
						src={Logo}
						alt="Kingsman Golf"
					/>

					<Menu
						theme="dark"
						defaultSelectedKeys={["1"]}
						mode="inline"
						items={items}
						onClick={onMenuClick}
					/>
				</Sider>
				<Layout>
					<Header style={{ padding: 0, background: "#ffffff" }} />
					<Content style={{ padding: "12px 16px" }}>
						<Routes>
							<Route
								path="/dashboard"
								element={<Dashboard />}
							/>
							<Route
								path="/partners"
								element={<Partners />}
							/>
						</Routes>
					</Content>
				</Layout>
			</Layout>
		)
	} else {
		return (
			<Routes>
				<Route
					path="/login"
					element={<Login />}
				/>
			</Routes>
		)
	}
}

function RouterWrapper() {
	return (
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	)
}

// Default app entry
export default function App() {
	return (
		<AuthProvider>
			<RouterWrapper />
		</AuthProvider>
	)
}
