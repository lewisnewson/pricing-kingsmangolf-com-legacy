import { getFirestore, doc, getDoc } from "firebase/firestore"
import { useParams, useNavigate } from "react-router-dom"
import { Badge, Card, Descriptions, Divider, Table } from "antd"
import { useEffect, useState } from "react"

export default function SupplierDetails() {
	const [supplier, setSupplier] = useState<any>({})

	const navigate = useNavigate()

	const { supplierID } = useParams()

	useEffect(() => {
		const fetchSupplierData = async () => {
			const db = getFirestore()

			try {
				if (!supplierID) {
					navigate("/suppliers")
					return
				}

				const supplierDocRef = doc(db, "suppliers", supplierID)
				const supplierDocSnap = await getDoc(supplierDocRef)

				if (supplierDocSnap.exists()) {
					setSupplier(supplierDocSnap.data())
				}
			} catch (error) {
				console.error("Error fetching supplier: ", error)
			}
		}
		fetchSupplierData()
	}, [supplierID, navigate])

	return (
		<Card>
			<Descriptions
				title={supplier?.name}
				items={[
					{
						key: "1",
						label: "Contact Name",
						children: supplier?.main_contact?.name,
					},
					{
						key: "2",
						label: "Contact Number",
						children: supplier?.main_contact?.phone || "N/A",
					},
					{
						key: "3",
						label: "Contact Email",
						children: supplier?.main_contact?.email,
					},
					{
						key: "4",
						label: "Completed Bookings",
						children: (
							<Badge
								status="success"
								text="4"
							/>
						),
					},
					{
						key: "5",
						label: "Currently Open Requests",
						children: (
							<Badge
								status="processing"
								text="16"
							/>
						),
					},
				]}
			/>

			<Divider />

			<Table
				columns={[
					{
						title: "Booking ID",
						dataIndex: "name",
						key: "name",
					},
				]}
			/>

			<Table
				columns={[
					{
						title: "Request ID",
						dataIndex: "name",
						key: "name",
					},
				]}
			/>

			<Divider />

			<Table
				columns={[
					{
						title: "Hotel Name",
						dataIndex: "name",
						key: "name",
					},
				]}
			/>

			<Table
				columns={[
					{
						title: "Course Name",
						dataIndex: "name",
						key: "name",
					},
				]}
			/>
		</Card>
	)
}
