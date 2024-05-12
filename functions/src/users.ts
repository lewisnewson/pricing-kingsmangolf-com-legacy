import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

admin.initializeApp()

// Generate a random password
function generateRandomPassword(): string {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
	let password = ""
	for (let i = 0; i < 8; i++) {
		password += characters.charAt(Math.floor(Math.random() * characters.length))
	}
	return password
}

export const createNewAuthAccount = functions.runWith({ minInstances: 1 }).https.onCall(async (data, context) => {
	// Check if the request is authenticated
	if (!context.auth) return { message: "Authentication required", code: 401 }

	// Pull the data required to create a user
	const { email, displayName, partnerID } = data

	// Generate a random password
	const password = generateRandomPassword()

	// Input validation (crucial!)
	if (!email || !displayName || !password || !partnerID) {
		throw new functions.https.HttpsError("invalid-argument", "Missing required parameters")
	}

	try {
		// Create user in Firebase Authentication
		const userRecord = await admin.auth().createUser({
			displayName,
			email,
			password,
		})

		// Associate with partner in Firestore
		await admin.firestore().collection("users").doc(userRecord.uid).set({
			full_name: displayName,
			email,
			partnerID,
			created: admin.firestore.FieldValue.serverTimestamp(),
		})

		// Send password reset email
		await admin
			.auth()
			.generatePasswordResetLink(email)
			.then((link) => {
				// @TODO: Send email to the user with the reset link
			})
			.catch((error) => {
				console.error("Error sending password reset email:", error)
			})

		// Return the user ID
		return { message: "User created successfully", userID: userRecord.uid }
	} catch (error) {
		throw new functions.https.HttpsError("internal", "Error creating user", error)
	}
})
