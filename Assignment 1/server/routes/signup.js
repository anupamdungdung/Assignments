import express from 'express'
import { postUser } from '../controllers/auth.js'

const router = express.Router()

router.get('/',(req,res)=>{
    res.send('This is the signup page')
})
router.post('/',postUser)

export default router;