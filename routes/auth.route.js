import express from 'express'
import { login, register, getUserInfo, logout, updateUserInfo } from '../controllers/auth.controller.js'

import authenticateToken from '../auth.middleware.js'

const router = express.Router()

router.get('/', async (req, res) => {
  res.send('Auth service route is working')
})

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/getUserInfo', authenticateToken, getUserInfo)
router.put('/update', authenticateToken, updateUserInfo)

export default router
