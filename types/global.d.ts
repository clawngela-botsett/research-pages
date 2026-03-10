// Global type declarations for Node.js environment
// Polyfill File for Node.js build environment

declare global {
  // File is available in Next.js API routes via FormData polyfill
  // This declaration makes it available during TypeScript compilation and runtime
  interface File extends Blob {
    readonly name: string
    readonly lastModified: number
  }

  var File: {
    prototype: File
    new (fileBits: BlobPart[], fileName: string, options?: FilePropertyBag): File
  }
}

// Polyfill File in Node.js environment if not available
if (typeof globalThis !== 'undefined' && typeof globalThis.File === 'undefined') {
  // @ts-ignore - Polyfill for build time
  globalThis.File = class File extends Blob {
    name: string
    lastModified: number

    constructor(fileBits: BlobPart[], fileName: string, options?: FilePropertyBag) {
      super(fileBits, options)
      this.name = fileName
      this.lastModified = options?.lastModified ?? Date.now()
    }
  } as typeof File
}

export {}
