import { query, collection, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "src/firebase.config"
import { useParams, useNavigate } from "react-router-dom"
import { Breadcrumb, Spin, Table } from "antd"
import { useEffect, useState } from "react"

export default function PartnerUsers() {
	const [users, setUsers] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [partnerName, setPartnerName] = useState<string | null>(null)

	const { partnerID } = useParams()

	const navigate = useNavigate()

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				if (!partnerID) {
					navigate("/partners")
					return
				}

				const usersRef = collection(db, "users")
				const q = query(usersRef, where("partnerID", "==", partnerID))
				const querySnapshot = await getDocs(q)
				const usersData = querySnapshot.docs.map((doc) => doc.data())
				setUsers(usersData)

				// Fetch partner name
				const partnerDocRef = doc(db, "partners", partnerID)
				const partnerDocSnap = await getDoc(partnerDocRef)

				if (partnerDocSnap.exists()) {
					setPartnerName(partnerDocSnap.data().name)
				}
			} catch (error) {
				console.error("Error fetching users:", error)
			} finally {
				setLoading(false)
			}
		}

		if (partnerID) {
			fetchUsers()
		}
	}, [partnerID, navigate])

	if (loading) {
		return (
			<div>
				Loading users... <Spin size="small" />
			</div>
		)
	}

	return (
		<>
			<Breadcrumb>
				<Breadcrumb.Item onClick={() => navigate("/partners")}>Partners</Breadcrumb.Item>
				<Breadcrumb.Item>{partnerName}</Breadcrumb.Item>
				<Breadcrumb.Item>Users</Breadcrumb.Item>
			</Breadcrumb>

			<br />

			<Table
				dataSource={users}
				columns={[
					{
						title: "Name",
						dataIndex: "full_name",
						key: "full_name",
					},
					{
						title: "Email",
						dataIndex: "email",
						key: "email",
					},
				]}
			/>
		</>
	)
}
