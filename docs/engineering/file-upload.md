# 大文件上传方案：预签名 URL 直传 OSS

在企业级应用中，大文件上传是常见的技术挑战。本文将分享如何通过预签名 URL 直传 OSS，减少服务器压力，实现高性能、高可靠的大文件上传方案。

## 核心思路

为减少服务器压力，前端直接上传到 OSS，后端仅负责签名和校验。

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│   Backend   │────▶│     OSS     │
│             │     │  (签名服务)  │     │   (存储)    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                        ▲
       └────────────────────────────────────────┘
                   直接上传 (预签名URL)
```

## 预签名 URL 获取

### 后端签名接口

```typescript
// 1. 先从后端获取签名 URL
const signResult = await requestClient.get('/sign-upload-url', {
  params: { type: props.type, suffix, size }
})

const { signUploadUrl } = signResult
```

### 直接上传到 OSS

```typescript
// 2. 直接上传到 OSS
const xhr = new XMLHttpRequest()
xhr.open('PUT', signUploadUrl, true)
xhr.send(file)
```

## 大文件哈希计算

使用 SparkMD5 分片计算大文件哈希，避免浏览器内存溢出。

```typescript
import SparkMD5 from 'spark-md5'

async function calculateHash(file: File): Promise<string> {
  const chunkSize = 2 * 1024 * 1024  // 2MB 分片
  const chunks = Math.ceil(file.size / chunkSize)
  const spark = new SparkMD5.ArrayBuffer()
  const reader = new FileReader()

  let currentChunk = 0

  return new Promise((resolve) => {
    reader.onload = (e) => {
      spark.append(e.target?.result as ArrayBuffer)
      currentChunk++

      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(spark.end())
      }
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      reader.readAsArrayBuffer(file.slice(start, end))
    }

    loadNext()
  })
}
```

## 上传进度追踪

基于 XMLHttpRequest 实现上传进度实时追踪与取消控制（fetch 无法获取上传进度）。

### 进度监听

```typescript
xhr.upload.addEventListener('progress', (e) => {
  if (e.lengthComputable) {
    const progress = Math.round((e.loaded / e.total) * 100)
    console.log(`上传进度: ${progress}%`)
  }
})
```

### 取消上传

```typescript
// 取消上传
xhr?.abort()
```

## 完整上传封装

```typescript
interface UploadOptions {
  file: File
  signUrl: string
  onProgress?: (percent: number) => void
  onSuccess?: (url: string) => void
  onError?: (error: Error) => void
}

function uploadFile(options: UploadOptions): { abort: () => void } {
  const { file, signUrl, onProgress, onSuccess, onError } = options
  const xhr = new XMLHttpRequest()

  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      onProgress?.(Math.round((e.loaded / e.total) * 100))
    }
  })

  xhr.onload = () => {
    if (xhr.status === 200) {
      onSuccess?.(signUrl.split('?')[0])
    } else {
      onError?.(new Error(`上传失败: ${xhr.status}`))
    }
  }

  xhr.onerror = () => {
    onError?.(new Error('网络错误'))
  }

  xhr.open('PUT', signUrl, true)
  xhr.setRequestHeader('Content-Type', file.type)
  xhr.send(file)

  return {
    abort: () => xhr.abort()
  }
}
```

## React Hook 封装

```tsx
import { useState, useCallback, useRef } from 'react'

interface UseFileUploadResult {
  upload: (file: File) => Promise<string>
  progress: number
  uploading: boolean
  cancel: () => void
}

export function useFileUpload(): UseFileUploadResult {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const abortRef = useRef<(() => void) | null>(null)

  const upload = useCallback(async (file: File): Promise<string> => {
    setUploading(true)
    setProgress(0)

    // 获取签名 URL
    const { signUploadUrl } = await fetch('/api/sign-upload-url', {
      method: 'GET',
      params: { type: file.type, size: file.size }
    }).then(r => r.json())

    return new Promise((resolve, reject) => {
      const { abort } = uploadFile({
        file,
        signUrl: signUploadUrl,
        onProgress: setProgress,
        onSuccess: (url) => {
          setUploading(false)
          resolve(url)
        },
        onError: (error) => {
          setUploading(false)
          reject(error)
        }
      })

      abortRef.current = abort
    })
  }, [])

  const cancel = useCallback(() => {
    abortRef.current?.()
    setUploading(false)
    setProgress(0)
  }, [])

  return { upload, progress, uploading, cancel }
}
```

## 使用示例

```tsx
function FileUploader() {
  const { upload, progress, uploading, cancel } = useFileUpload()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const url = await upload(file)
      console.log('上传成功:', url)
    } catch (error) {
      console.error('上传失败:', error)
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={uploading} />
      {uploading && (
        <div>
          <progress value={progress} max={100} />
          <span>{progress}%</span>
          <button onClick={cancel}>取消</button>
        </div>
      )}
    </div>
  )
}
```

## 可优化点

### 分片上传

当前方案为单文件上传，可改进为分片上传以支持超大文件：

```typescript
interface ChunkUploadOptions {
  file: File
  chunkSize?: number  // 默认 5MB
  onProgress?: (percent: number) => void
  onChunkComplete?: (index: number, total: number) => void
}

async function chunkUpload(options: ChunkUploadOptions) {
  const { file, chunkSize = 5 * 1024 * 1024 } = options
  const totalChunks = Math.ceil(file.size / chunkSize)
  const chunks: Blob[] = []

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    chunks.push(file.slice(start, end))
  }

  // 逐个上传分片...
}
```

### 断点续传

```typescript
// 本地存储上传状态
interface UploadState {
  fileId: string
  uploadedChunks: number[]
  timestamp: number
}

function saveUploadState(fileId: string, state: UploadState) {
  localStorage.setItem(`upload_${fileId}`, JSON.stringify(state))
}

function loadUploadState(fileId: string): UploadState | null {
  const data = localStorage.getItem(`upload_${fileId}`)
  return data ? JSON.parse(data) : null
}
```

## 总结

通过预签名 URL 直传 OSS 方案，我们实现了：

1. **减轻服务器压力**：文件直接上传到 OSS，不经过应用服务器
2. **实时进度追踪**：基于 XMLHttpRequest 的进度事件
3. **取消控制**：支持用户随时取消上传
4. **内存安全**：SparkMD5 分片计算哈希，避免内存溢出

这套方案已在环卫管理平台稳定运行，支持单文件最大 5GB 上传。
