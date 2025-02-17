import { Router, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { TransferFileService } from '../services/transferFile/TransferFileService'

const router = Router()
const transferFileService = new TransferFileService()

// Configure multer storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(process.cwd(), 'storage', 'transferFiles'))
    },
    filename: (_req, file, cb) => {
        const uniquePrefix = `${Date.now()}-${uuidv4()}`
        const sanitizedName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9]/g, '_')
        const extension = path.parse(file.originalname).ext
        cb(null, `${uniquePrefix}-${sanitizedName}${extension}`)
    }
})

const upload = multer({ 
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
})

// Upload route
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' })
        }

        const metadata = await transferFileService.createFromUpload(req.file)
        return res.json({ id: metadata.id, metadata })
    } catch (error) {
        console.error('Upload error:', error)
        return res.status(500).json({ error: 'Upload failed' })
    }
})

// Download route
router.get('/download/:id', async (req: Request, res: Response) => {
    try {
        const { metadata, stream } = await transferFileService.downloadFile(req.params.id)
        
        res.setHeader('Content-Type', metadata.mimeType)
        res.setHeader('Content-Disposition', `attachment; filename="${metadata.filename}"`)
        
        return stream.pipe(res)
    } catch (error) {
        console.error('Download error:', error)
        if (error.message === 'File metadata not found' || error.message === 'File not found on disk') {
            return res.status(404).json({ error: error.message })
        }
        return res.status(500).json({ error: 'Download failed' })
    }
})

export default router 