import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider, AuthContext } from "./utils/contexts/auth"
import { getAuth, signOut } from "firebase/auth"
import { useNavigate, useLocation } from "react-router-dom"
import { useContext } from "react"
import styles from "./entry.module.scss"

// UI components
import { BookOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons"
import Logo from "./assets/images/kingsman_logo.webp"
import { Layout, Menu, Typography } from "antd"

// Routes
import Login from "./routes/login/login"
import Partners from "./routes/partners/partners"
import PartnerUsers from "./routes/partner/users"
import Suppliers from "./routes/suppliers/suppliers"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import SupplierDetails from "./routes/supplier/supplier"

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
	{ key: "suppliers", label: "Suppliers", icon: <BookOutlined /> },
	{ key: "partners", label: "Partners", icon: <UserOutlined /> },
	{ key: "sign_out", label: "Sign out", icon: <LogoutOutlined /> },
]

function AppRoutes() {
	// Get the isLoggedIn state from the AuthContext
	const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)

	const navigate = useNavigate()
	const location = useLocation()

	const { Title } = Typography

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

	const getRouteName = (pathname: string) => {
		switch (pathname) {
			case "/":
				return "Home"
			case "/partners":
				return "Partners"
			case "/suppliers":
				return "Suppliers"
			default:
				if (pathname.startsWith("/partner/") && pathname.endsWith("/users")) {
					return "Partner Users"
				}
				if (pathname.startsWith("/supplier/")) {
					return "Supplier Details"
				}
				return "Unknown" // or a default route name
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
					<Header style={{ padding: 0, background: "#ffffff", display: "flex", alignItems: "center" }}>
						<Title
							level={5}
							style={{ margin: 0, paddingLeft: "16px" }}>
							{getRouteName(location.pathname)}
						</Title>
					</Header>
					<Content style={{ padding: "12px 16px" }}>
						<Routes>
							<Route
								path="/partners"
								element={<Partners />}
							/>
							<Route
								path="/partner/:partnerID/users"
								element={<PartnerUsers />}
							/>
							<Route
								path="/suppliers"
								element={<Suppliers />}
							/>
							<Route
								path="supplier/:supplierID"
								element={<SupplierDetails />}
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
