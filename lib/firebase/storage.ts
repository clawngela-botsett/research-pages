import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadResult,
  UploadTask,
} from "firebase/storage"
import { storage } from "./config"

/**
 * Upload a file to Firebase Storage
 * Note: File extends Blob, so Blob type works for both File and Blob instances
 */
export const uploadFile = async (
  path: string,
  file: Blob
): Promise<UploadResult> => {
  if (!storage) throw new Error("Firebase Storage is not initialized")
  const storageRef = ref(storage, path)
  return uploadBytes(storageRef, file)
}

/**
 * Upload a file with progress tracking
 * Note: File extends Blob, so Blob type works for both File and Blob instances
 */
export const uploadFileWithProgress = (
  path: string,
  file: Blob
): UploadTask => {
  if (!storage) throw new Error("Firebase Storage is not initialized")
  const storageRef = ref(storage, path)
  return uploadBytesResumable(storageRef, file)
}

/**
 * Get download URL for a file
 */
export const getFileURL = async (path: string): Promise<string> => {
  if (!storage) throw new Error("Firebase Storage is not initialized")
  const storageRef = ref(storage, path)
  return getDownloadURL(storageRef)
}

/**
 * Delete a file from Firebase Storage
 */
export const deleteFile = async (path: string): Promise<void> => {
  if (!storage) throw new Error("Firebase Storage is not initialized")
  const storageRef = ref(storage, path)
  return deleteObject(storageRef)
}


