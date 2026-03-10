import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  addDoc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore"
import { db } from "./config"

/**
 * Get a single document by ID
 */
export const getDocument = async <T = DocumentData>(
  collectionName: string,
  documentId: string
): Promise<T | null> => {
  if (!db) throw new Error("Firestore is not initialized")
  const docRef = doc(db, collectionName, documentId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T
  }
  return null
}

/**
 * Get all documents from a collection
 */
export const getDocuments = async <T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  if (!db) throw new Error("Firestore is not initialized")
  const collectionRef = collection(db, collectionName)
  const q = query(collectionRef, ...constraints)
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[]
}

/**
 * Create or update a document
 */
export const setDocument = async <T = DocumentData>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> => {
  if (!db) throw new Error("Firestore is not initialized")
  const docRef = doc(db, collectionName, documentId)
  await setDoc(docRef, data as DocumentData, { merge: true })
}

/**
 * Add a new document with auto-generated ID
 */
export const addDocument = async <T = DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  if (!db) throw new Error("Firestore is not initialized")
  const docRef = await addDoc(collection(db, collectionName), data as DocumentData)
  return docRef.id
}

/**
 * Update a document
 */
export const updateDocument = async <T = Partial<DocumentData>>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> => {
  if (!db) throw new Error("Firestore is not initialized")
  const docRef = doc(db, collectionName, documentId)
  await updateDoc(docRef, data as DocumentData)
}

/**
 * Delete a document
 */
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  if (!db) throw new Error("Firestore is not initialized")
  const docRef = doc(db, collectionName, documentId)
  await deleteDoc(docRef)
}

/**
 * Subscribe to a collection for real-time updates
 */
export const subscribeToCollection = <T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (docs: T[]) => void
): Unsubscribe => {
  if (!db) {
    callback([])
    return () => {}
  }
  const q = query(collection(db, collectionName), ...constraints)
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[]
    callback(docs)
  })
}

/**
 * Query helper functions
 */
export const queryHelpers = {
  where,
  orderBy,
  limit,
}

// Re-export Firebase functions that may be needed
export { addDoc, collection, doc, where, orderBy, limit }
