import express from 'express'
import { login, register, getUserInfo, logout } from '../controllers/auth.controller.js'

import authenticateToken from '../auth.middleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/getUserInfo', authenticateToken ,getUserInfo)

export default router
