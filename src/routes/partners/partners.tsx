import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"
import { useNavigate } from "react-router-dom"
import { Button, Space, Table, Modal, Input, notification } from "antd"
import { useEffect, useState } from "react"

export default function Partners() {
	const [allPartners, setAllPartners] = useState<any>([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false)

	const [addTo, setAddTo] = useState<any>({})
	const [adding, setAdding] = useState(false)
	const [addingPartner, setAddingPartner] = useState(false)
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")

	const [partnerName, setPartnerName] = useState<string>("")

	const [api, contextHolder] = notification.useNotification()

	const functions = getFunctions()

	const navigate = useNavigate()

	const showModal = (record: any) => {
		setAddTo(record)
		setIsModalOpen(true)
	}

	const handleOk = async () => {
		setAdding(true)

		const partnerID = addTo.key

		try {
			const createUserFn = httpsCallable(functions, "createNewAuthAccount")
			const result: any = await createUserFn({ email, displayName: name, partnerID })

			if (result?.data?.userID) {
				api["success"]({
					message: "User Created",
					description: "The new user account has been setup and an email has been sent to them.",
				})
			}
		} catch (error) {
			api["error"]({
				message: "New User Error",
				description: "There was an error creating the new user account.",
			})
			console.log(error)
		}

		resetAndCloseModal()
	}

	const resetAndCloseModal = () => {
		setName("")
		setEmail("")
		setAddTo({})
		setAdding(false)
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

	const createNewPartnerAccount = async () => {
		setAddingPartner(true)

		try {
			const db = getFirestore()
			const partnersRef = collection(db, "partners")

			await addDoc(partnersRef, { name: partnerName, created: serverTimestamp() })

			const querySnapshot = await getDocs(partnersRef)
			const partners = querySnapshot.docs.map((doc) => ({
				key: doc.id,
				...doc.data(),
			}))

			setAllPartners(partners)

			api["success"]({
				message: "Partner Created",
				description: "The new partner has been added.",
			})
		} catch (error) {
			api["error"]({
				message: "New Partner Error",
				description: "There was an error creating the new partner.",
			})
			console.error("Error creating partner: ", error)
		}

		resetAndClosePartnerModal()
	}

	const resetAndClosePartnerModal = () => {
		setPartnerName("")
		setAddingPartner(false)
		setIsPartnerModalOpen(false)
	}

	return (
		<>
			{contextHolder}

			<Button onClick={() => setIsPartnerModalOpen(true)}>Add New Partner</Button>

			<br />
			<br />

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
								<Button
									type="primary"
									onClick={() => navigate(`/partner/${record.key}/users`)}>
									View Users
								</Button>
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
				onCancel={resetAndCloseModal}
				footer={[
					<Button
						key="back"
						onClick={resetAndCloseModal}>
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

			<Modal
				title="Create New Partner"
				open={isPartnerModalOpen}
				onOk={createNewPartnerAccount}
				onCancel={resetAndClosePartnerModal}
				footer={[
					<Button
						key="back"
						onClick={resetAndClosePartnerModal}>
						Cancel
					</Button>,
					<Button
						key="submit"
						type="primary"
						loading={addingPartner}
						onClick={createNewPartnerAccount}>
						Create Partner
					</Button>,
				]}>
				<Input
					type="text"
					placeholder="Name"
					value={partnerName}
					required
					onChange={(e) => setPartnerName(e.target.value)}
				/>
			</Modal>
		</>
	)
}
