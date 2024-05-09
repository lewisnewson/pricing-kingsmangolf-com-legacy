import { getFirestore, collection, getDocs } from "firebase/firestore"
import { Button, Space, Table } from "antd"
import { useEffect, useState } from "react"

export default function Partners() {
	const [allPartners, setAllPartners] = useState<any>([])

	useEffect(() => {
		const fetchPartners = async () => {
			const db = getFirestore()
			const partnersRef = collection(db, "partners")

			try {
				const querySnapshot = await getDocs(partnersRef)
				const partners = querySnapshot.docs.map((doc) => ({
					key: doc.id,
					...doc.data(),
				}))

				setAllPartners(partners)

				return true
			} catch (error) {
				console.error("Error fetching partners: ", error)
			}
		}
		fetchPartners()
	}, [])

	return (
		<Table
			dataSource={allPartners}
			columns={[
				{
					title: "Partner Name",
					dataIndex: "name",
					key: "name",
					render: (text: any) => <a href={`/partners/test`}>{text}</a>,
				},
				{
					title: "Open Requests",
					dataIndex: "requests",
					key: "requests",
				},
				{
					title: "Action",
					key: "action",
					render: (_: any, record: any) => (
						<Space size="middle">
							<Button>Add User</Button>
						</Space>
					),
				},
			]}
		/>
	)
}
