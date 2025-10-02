import express from 'express'
import { uploadSingleImage } from '../multer.js'
import {
  login,
  register,
  getUserInfo,
  logout,
  updateUserInfo,
  uploadProfilePic,
  getUserInfoById
} from '../controllers/auth.controller.js'
import authenticateToken from '../auth.middleware.js'

const router = express.Router()

router.get('/', async (req, res) => {
  res.send('Auth service route is working')
})

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/getUserInfo/:id', getUserInfo)
router.put('/update/:id', updateUserInfo)
router.get('/getUserInfoById/:userId',getUserInfoById)

router.put('/upload/:id', uploadSingleImage, uploadProfilePic)

export default router
