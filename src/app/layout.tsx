// Global site styles
import "../assets/styles/global.scss"

// Returns the html markup for the websites entry & context wrappers
export default function RootLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
	return (
		<html lang={params.lang}>
			<body>{children}</body>
		</html>
	)
}
