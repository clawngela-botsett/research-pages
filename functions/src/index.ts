// Firebase Cloud Functions
// Add your Cloud Functions here

import * as functions from "firebase-functions"

// Example: HTTP function
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!")
})

// Example: Callable function
export const echo = functions.https.onCall((data, context) => {
  // Verify authentication if needed
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    )
  }

  return {
    message: "Echo",
    data: data,
    userId: context.auth.uid,
  }
})
