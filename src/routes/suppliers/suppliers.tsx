import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { Button, Space, Table, Modal, Input, notification, Form, Badge } from "antd"
import { useEffect, useState } from "react"

export default function Suppliers() {
	const [allSuppliers, setAllSuppliers] = useState<any>([])
	const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false)

	const [addingSupplier, setAddingSupplier] = useState(false)

	const [supplierName, setSupplierName] = useState<string>("")

	const [mainContactName, setMainContactName] = useState<string>("")
	const [mainContactPhone, setMainContactPhone] = useState<string>("")
	const [mainContactEmail, setMainContactEmail] = useState<string>("")

	const [api, contextHolder] = notification.useNotification()

	const navigate = useNavigate()

	useEffect(() => {
		const fetchSuppliers = async () => {
			const db = getFirestore()
			const suppliersRef = collection(db, "suppliers")

			try {
				const querySnapshot = await getDocs(suppliersRef)
				const suppliers = querySnapshot.docs.map((doc) => ({
					key: doc.id,
					...doc.data(),
					requests: (
						<Badge
							status="processing"
							text="13"
						/>
					),
					bookings: 0,
				}))

				setAllSuppliers(suppliers)

				return true
			} catch (error) {
				console.error("Error fetching suppliers: ", error)
			}
		}
		fetchSuppliers()
	}, [])

	const createNewSupplierAccount = async () => {
		setAddingSupplier(true)

		try {
			const db = getFirestore()
			const suppliersRef = collection(db, "suppliers")

			await addDoc(suppliersRef, {
				name: supplierName,
				main_contact: {
					name: mainContactName,
					phone: mainContactPhone,
					email: mainContactEmail,
				},
				created: serverTimestamp(),
			})

			const querySnapshot = await getDocs(suppliersRef)
			const suppliers = querySnapshot.docs.map((doc) => ({
				key: doc.id,
				...doc.data(),
			}))

			setAllSuppliers(suppliers)

			api["success"]({
				message: "Supplier Created",
				description: "The new supplier has been added.",
			})
		} catch (error) {
			api["error"]({
				message: "New Supplier Error",
				description: "There was an error creating the new supplier.",
			})
			console.error("Error creating supplier: ", error)
		}

		resetAndCloseSupplierModal()
	}

	const resetAndCloseSupplierModal = () => {
		setSupplierName("")
		setAddingSupplier(false)
		setIsSupplierModalOpen(false)
	}

	return (
		<>
			{contextHolder}

			<Button onClick={() => setIsSupplierModalOpen(true)}>Add New Supplier</Button>

			<br />
			<br />

			<Table
				dataSource={allSuppliers}
				columns={[
					{
						title: "Supplier Name",
						dataIndex: "name",
						key: "name",
					},
					{
						title: "Requests",
						dataIndex: "requests",
						key: "requests",
					},
					{
						title: "Bookings",
						dataIndex: "bookings",
						key: "bookings",
					},
					{
						title: "Actions",
						key: "actions",
						render: (_: any, record: any) => (
							<Space size="middle">
								<Button
									type="primary"
									onClick={() => navigate(`/supplier/${record.key}`)}>
									View Details
								</Button>
							</Space>
						),
					},
				]}
			/>

			<Modal
				title="Create New Supplier"
				open={isSupplierModalOpen}
				onOk={createNewSupplierAccount}
				onCancel={resetAndCloseSupplierModal}
				footer={[
					<Button
						key="back"
						onClick={resetAndCloseSupplierModal}>
						Cancel
					</Button>,
					<Button
						key="submit"
						type="primary"
						loading={addingSupplier}
						onClick={createNewSupplierAccount}>
						Create Supplier
					</Button>,
				]}>
				<Form>
					<Form.Item>
						<Input
							type="text"
							placeholder="Supplier Name"
							value={supplierName}
							onChange={(e) => setSupplierName(e.target.value)}
						/>
					</Form.Item>

					<Form.Item>
						<Input
							type="text"
							placeholder="Main Contact Name"
							value={mainContactName}
							required
							onChange={(e) => setMainContactName(e.target.value)}
						/>
					</Form.Item>

					<Form.Item>
						<Input
							type="phone"
							placeholder="Main Contact Phone"
							value={mainContactPhone}
							onChange={(e) => setMainContactPhone(e.target.value)}
						/>
					</Form.Item>

					<Form.Item>
						<Input
							type="email"
							placeholder="Main Contact Email"
							value={mainContactEmail}
							required
							onChange={(e) => setMainContactEmail(e.target.value)}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}
