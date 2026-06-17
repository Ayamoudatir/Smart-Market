import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadProductImage(
  file: File,
  productName: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `products/${Date.now()}_${productName.replace(/\s+/g, '_')}.${ext}`
  const storageRef = ref(storage, path)

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file)
    task.on(
      'state_changed',
      snap => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      }
    )
  })
}

export async function deleteProductImage(url: string) {
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch {
    // ignore si déjà supprimé
  }
}
