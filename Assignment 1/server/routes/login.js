import express from 'express'
import { loginUser } from '../controllers/auth.js'
const router = express.Router()

router.get('/',(req,res)=>{
    res.send('This is the login page')
})

router.post('/',loginUser)

export default router;