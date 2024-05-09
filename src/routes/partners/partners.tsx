import { getFirestore, collection, getDocs } from "firebase/firestore"
import { Button, Space, Table, Modal, Input } from "antd"
import { useEffect, useState } from "react"

export default function Partners() {
	const [allPartners, setAllPartners] = useState<any>([])
	const [isModalOpen, setIsModalOpen] = useState(false)

	const [addTo, setAddTo] = useState<any>({})
	const [adding, setAdding] = useState(false)
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")

	const showModal = (record: any) => {
		setAddTo(record)
		setIsModalOpen(true)
	}

	const handleOk = async () => {
		setAdding(true)

		await new Promise((resolve) => setTimeout(resolve, 1000))

		setIsModalOpen(false)
	}

	const handleCancel = () => {
		setName("")
		setEmail("")
		setAddTo({})
		setIsModalOpen(false)
	}

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
		<>
			<Table
				dataSource={allPartners}
				columns={[
					{
						title: "Partner Name",
						dataIndex: "name",
						key: "name",
					},
					{
						title: "Open Requests",
						dataIndex: "requests",
						key: "requests",
					},
					{
						title: "Actions",
						key: "actions",
						render: (_: any, record: any) => (
							<Space size="middle">
								<Button onClick={() => showModal(record)}>Add User</Button>
							</Space>
						),
					},
				]}
			/>

			<Modal
				title={`Adding user to: ${addTo.name}`}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button
						key="back"
						onClick={handleCancel}>
						Cancel
					</Button>,
					<Button
						key="submit"
						type="primary"
						loading={adding}
						onClick={handleOk}>
						Add User
					</Button>,
				]}>
				<Input
					type="text"
					placeholder="Name"
					value={name}
					required
					onChange={(e) => setName(e.target.value)}
				/>
				<Input
					type="email"
					placeholder="Email"
					value={email}
					required
					onChange={(e) => setEmail(e.target.value)}
				/>
			</Modal>
		</>
	)
}
