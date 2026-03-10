/**
 * Server-side Firestore helper using Firebase Admin SDK
 * This bypasses security rules and should only be used in API routes
 */

let adminDb: FirebaseFirestore.Firestore | null = null
let initAttempted = false
let initError: string | null = null

async function getAdminDb(): Promise<FirebaseFirestore.Firestore | null> {
  // Return cached db if we have it
  if (adminDb) {
    return adminDb
  }

  // Don't retry if we already tried and failed
  if (initAttempted) {
    if (initError) {
      console.error("[FIRESTORE SERVER] Previous init failed:", initError)
    }
    return null
  }

  initAttempted = true

  // Log environment for debugging
  console.log("[FIRESTORE SERVER] === INIT START ===")
  console.log("[FIRESTORE SERVER] Environment:", JSON.stringify({
    K_SERVICE: process.env.K_SERVICE || "not set",
    FUNCTION_NAME: process.env.FUNCTION_NAME || "not set",
    GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT || "not set",
    FIREBASE_CONFIG: process.env.FIREBASE_CONFIG ? "set" : "not set",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "not set",
    NODE_ENV: process.env.NODE_ENV || "not set",
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS ? "set" : "not set",
    GCLOUD_PROJECT: process.env.GCLOUD_PROJECT || "not set",
    // Check for App Hosting specific env vars
    FIREBASE_APP_HOSTING: process.env.FIREBASE_APP_HOSTING || "not set",
  }))

  try {
    console.log("[FIRESTORE SERVER] Importing firebase-admin...")
    const admin = await import("firebase-admin")
    console.log("[FIRESTORE SERVER] firebase-admin imported, apps count:", admin.apps.length)

    // Initialize admin if not already done
    if (admin.apps.length === 0) {
      // Try multiple sources for project ID
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
                       process.env.GOOGLE_CLOUD_PROJECT ||
                       process.env.GCLOUD_PROJECT

      console.log("[FIRESTORE SERVER] Project ID resolved to:", projectId)

      if (!projectId) {
        initError = "No project ID found in environment variables (checked NEXT_PUBLIC_FIREBASE_PROJECT_ID, GOOGLE_CLOUD_PROJECT, GCLOUD_PROJECT)"
        console.error("[FIRESTORE SERVER] ERROR:", initError)
        return null
      }

      try {
        // In Firebase App Hosting, the default service account is automatically available
        // We just need to initialize without explicit credentials - the SDK will use the
        // service account attached to the App Hosting environment
        console.log("[FIRESTORE SERVER] Initializing Admin SDK with default service account...")
        
        // For App Hosting/Cloud Run: Initialize without credentials (uses default service account)
        // For local dev: Will try applicationDefault() if available
        try {
          // Strategy 1: No explicit credential (works in App Hosting with default service account)
          // This should work automatically in App Hosting - the service account is provided by the runtime
          admin.initializeApp({
            projectId: projectId,
          })
          console.log("[FIRESTORE SERVER] Admin SDK initialized with default service account (App Hosting/Cloud Run)")
        } catch (initErr: any) {
          if (initErr?.code === 'app/duplicate-app') {
            console.log("[FIRESTORE SERVER] Admin SDK already initialized (duplicate app - this is OK)")
          } else {
            // Strategy 1 failed, try Strategy 2: applicationDefault() for local dev
            console.log("[FIRESTORE SERVER] Strategy 1 failed:", initErr?.message || initErr?.code)
            console.log("[FIRESTORE SERVER] Trying applicationDefault()...")
            try {
              admin.initializeApp({
                projectId: projectId,
                credential: admin.credential.applicationDefault(),
              })
              console.log("[FIRESTORE SERVER] Admin SDK initialized with applicationDefault() (local dev)")
            } catch (credError: any) {
              if (credError?.code === 'app/duplicate-app') {
                console.log("[FIRESTORE SERVER] Admin SDK already initialized (duplicate app - this is OK)")
              } else {
                // Both strategies failed - log detailed error info
                console.error("[FIRESTORE SERVER] ===== INITIALIZATION FAILED =====")
                console.error("[FIRESTORE SERVER] Strategy 1 (no credential) error:", {
                  code: initErr?.code,
                  message: initErr?.message,
                  stack: initErr?.stack
                })
                console.error("[FIRESTORE SERVER] Strategy 2 (applicationDefault) error:", {
                  code: credError?.code,
                  message: credError?.message,
                  stack: credError?.stack
                })
                console.error("[FIRESTORE SERVER] This usually means:")
                console.error("[FIRESTORE SERVER] - In App Hosting: Service account may not have proper permissions")
                console.error("[FIRESTORE SERVER] - In local dev: Run 'gcloud auth application-default login'")
                console.error("[FIRESTORE SERVER] ========================================")
                throw credError
              }
            }
          }
        }
      } catch (err: any) {
        if (err?.code === 'app/duplicate-app') {
          console.log("[FIRESTORE SERVER] Admin SDK already initialized (duplicate app - this is OK)")
        } else {
          initError = `Admin SDK init failed: ${err?.code || 'unknown'} - ${err?.message || err}`
          console.error("[FIRESTORE SERVER] ERROR:", initError)
          console.error("[FIRESTORE SERVER] Error stack:", err?.stack)
          return null
        }
      }
    } else {
      console.log("[FIRESTORE SERVER] Admin SDK already has", admin.apps.length, "app(s) initialized")
    }

    if (admin.apps.length > 0) {
      console.log("[FIRESTORE SERVER] Creating Firestore instance...")
      adminDb = admin.firestore()
      console.log("[FIRESTORE SERVER] Firestore instance created successfully")
      console.log("[FIRESTORE SERVER] === INIT SUCCESS ===")
      return adminDb
    } else {
      initError = "No admin apps available after initialization attempt"
      console.error("[FIRESTORE SERVER] ERROR:", initError)
    }
  } catch (error: any) {
    initError = `Failed to import/initialize Admin SDK: ${error?.message || error}`
    console.error("[FIRESTORE SERVER] ERROR:", initError)
    console.error("[FIRESTORE SERVER] Error stack:", error?.stack)
  }

  console.log("[FIRESTORE SERVER] === INIT FAILED ===")
  return null
}

/**
 * Get a document from Firestore (server-side, uses Admin SDK)
 * Falls back to client SDK if Admin SDK not available (for local dev)
 */
export async function getDocumentServer<T = any>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  const db = await getAdminDb()
  if (db) {
    try {
      const docRef = db.collection(collectionName).doc(documentId)
      const docSnap = await docRef.get()
      
      if (!docSnap.exists) {
        return null
      }
      
      return { id: docSnap.id, ...docSnap.data() } as T
    } catch (error: any) {
      console.warn("[FIRESTORE SERVER] Admin SDK query failed, falling back to client SDK:", error?.message)
      // Fall through to client SDK
    }
  }
  
  // Fallback to client SDK (for local development without Admin SDK)
  console.warn("[FIRESTORE SERVER] Falling back to client SDK")
  try {
    const { getDocument } = await import("./firestore")
    return getDocument<T>(collectionName, documentId)
  } catch (error: any) {
    console.error("[FIRESTORE SERVER] Client SDK fallback also failed:", error?.message)
    throw new Error(`Firebase Admin SDK is required for server-side Firestore access. Client SDK fallback failed: ${error?.message}`)
  }
}

/**
 * Get documents from Firestore (server-side, uses Admin SDK)
 * Falls back to client SDK if Admin SDK not available (for local dev)
 */
export async function getDocumentsServer<T = any>(
  collectionName: string,
  constraints: Array<{ field: string; operator: string; value: any } | { field: string; direction: 'asc' | 'desc' }> = []
): Promise<T[]> {
  const db = await getAdminDb()
  if (db) {
    try {
      let query: any = db.collection(collectionName)
      
      // Apply constraints - where clauses first, then orderBy
      const whereClauses: Array<{ field: string; operator: string; value: any }> = []
      const orderByClauses: Array<{ field: string; direction: 'asc' | 'desc' }> = []
      
      for (const constraint of constraints) {
        if ('operator' in constraint) {
          whereClauses.push(constraint)
        } else if ('direction' in constraint) {
          orderByClauses.push(constraint)
        }
      }
      
      // Apply where clauses
      for (const whereClause of whereClauses) {
        query = query.where(whereClause.field, whereClause.operator as any, whereClause.value)
      }
      
      // Apply orderBy clauses
      for (const orderByClause of orderByClauses) {
        query = query.orderBy(orderByClause.field, orderByClause.direction)
      }
      
      const snapshot = await query.get()
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as T[]
    } catch (error: any) {
      console.warn("[FIRESTORE SERVER] Admin SDK query failed, falling back to client SDK:", error?.message)
      // Fall through to client SDK
    }
  }
  
  // Fallback to client SDK (for local development without Admin SDK)
  console.warn("[FIRESTORE SERVER] Falling back to client SDK")
  try {
    const { getDocuments, queryHelpers } = await import("./firestore")
    const clientConstraints = constraints.map(c => {
      if ('operator' in c) {
        return queryHelpers.where(c.field, c.operator as any, c.value)
      } else {
        return queryHelpers.orderBy(c.field, c.direction)
      }
    })
    return getDocuments<T>(collectionName, clientConstraints)
  } catch (error: any) {
    console.error("[FIRESTORE SERVER] Client SDK fallback also failed:", error?.message)
    throw new Error(`Firebase Admin SDK is required for server-side Firestore access. Client SDK fallback failed: ${error?.message}`)
  }
}

/**
 * Add a document to Firestore (server-side, uses Admin SDK)
 * Falls back to client SDK if Admin SDK not available (for local dev)
 */
export async function addDocumentServer<T = any>(
  collectionName: string,
  data: Omit<T, "id">
): Promise<string> {
  const db = await getAdminDb()
  if (db) {
    try {
      const docRef = await db.collection(collectionName).add(data)
      return docRef.id
    } catch (error: any) {
      console.warn("[FIRESTORE SERVER] Admin SDK add failed, falling back to client SDK:", error?.message)
      // Fall through to client SDK
    }
  }
  
  // Fallback to client SDK (for local development without Admin SDK)
  // Note: This should rarely be needed in production - Admin SDK should be available
  console.warn("[FIRESTORE SERVER] Admin SDK not available for addDocument, attempting client SDK fallback")
  if (initError) {
    console.error("[FIRESTORE SERVER] Admin SDK initialization error:", initError)
  }
  console.warn("[FIRESTORE SERVER] For local development, run: gcloud auth application-default login")
  try {
    const { addDoc, collection, db: clientDb } = await import("./firestore")
    if (!clientDb) {
      const errorMsg = initError 
        ? `Firestore Admin SDK initialization failed: ${initError}. For local development, run: gcloud auth application-default login. In production, check App Hosting service account permissions.`
        : "Firestore Admin SDK is required for server-side writes. For local development, run: gcloud auth application-default login. In production, ensure Firebase App Hosting service account has proper permissions."
      throw new Error(errorMsg)
    }
    const docRef = await addDoc(collection(clientDb, collectionName), data)
    return docRef.id
  } catch (fallbackError: any) {
    console.error("[FIRESTORE SERVER] Client SDK fallback also failed:", fallbackError?.message)
    const errorMsg = initError 
      ? `Firestore Admin SDK initialization failed: ${initError}. Client SDK fallback also failed: ${fallbackError?.message}`
      : `Firestore Admin SDK is required for server-side writes. Client SDK fallback failed: ${fallbackError?.message}. For local development, run: gcloud auth application-default login. In production, ensure Firebase App Hosting service account has proper permissions.`
    throw new Error(errorMsg)
  }
}

/**
 * Update a document in Firestore (server-side, uses Admin SDK)
 * Falls back to client SDK if Admin SDK not available (for local dev)
 */
export async function updateDocumentServer(
  collectionName: string,
  documentId: string,
  data: Partial<any>
): Promise<void> {
  const db = await getAdminDb()
  if (db) {
    try {
      await db.collection(collectionName).doc(documentId).update(data)
      return
    } catch (error: any) {
      console.warn("[FIRESTORE SERVER] Admin SDK update failed, falling back to client SDK:", error?.message)
      // Fall through to client SDK
    }
  }
  
  // Fallback to client SDK (for local development without Admin SDK)
  // Note: This should rarely be needed in production - Admin SDK should be available
  console.warn("[FIRESTORE SERVER] Admin SDK not available for updateDocument, attempting client SDK fallback")
  console.warn("[FIRESTORE SERVER] For local development, run: gcloud auth application-default login")
  try {
    const { updateDocument } = await import("./firestore")
    await updateDocument(collectionName, documentId, data)
  } catch (fallbackError: any) {
    console.error("[FIRESTORE SERVER] Client SDK fallback also failed:", fallbackError?.message)
    throw new Error("Firestore Admin SDK is required for server-side writes. For local development, run: gcloud auth application-default login. In production, ensure Firebase App Hosting service account has proper permissions.")
  }
}

/**
 * Set a document in Firestore (server-side, uses Admin SDK)
 * Falls back to client SDK if Admin SDK not available (for local dev)
 */
export async function setDocumentServer<T = any>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> {
  const db = await getAdminDb()
  if (db) {
    try {
      await db.collection(collectionName).doc(documentId).set(data)
      return
    } catch (error: any) {
      console.warn("[FIRESTORE SERVER] Admin SDK set failed, falling back to client SDK:", error?.message)
      // Fall through to client SDK
    }
  }
  
  // Fallback to client SDK (for local development without Admin SDK)
  const { setDocument } = await import("./firestore")
  await setDocument(collectionName, documentId, data)
}

/**
 * Delete a document from Firestore (server-side, uses Admin SDK)
 * Falls back to client SDK if Admin SDK not available (for local dev)
 */
export async function deleteDocumentServer(
  collectionName: string,
  documentId: string
): Promise<void> {
  const db = await getAdminDb()
  if (db) {
    try {
      await db.collection(collectionName).doc(documentId).delete()
      return
    } catch (error: any) {
      console.warn("[FIRESTORE SERVER] Admin SDK delete failed, falling back to client SDK:", error?.message)
      // Fall through to client SDK
    }
  }
  
  // Fallback to client SDK (for local development without Admin SDK)
  const { deleteDocument } = await import("./firestore")
  await deleteDocument(collectionName, documentId)
}

