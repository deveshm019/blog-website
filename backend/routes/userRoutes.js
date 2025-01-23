const {Router} = require('express')
const {registerUser,loginUser,getUser,changeAvatar,editUser,getAuthors} = require('../controllers/userControllers.js')
const authMiddleware = require('../middleware/authMiddleware.js')

const router = Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/getAuthors',getAuthors)
router.post('/changeAvatar', authMiddleware, changeAvatar)
router.patch('/editUser', authMiddleware, editUser)
router.get('/:id',getUser)

router.get('/',(req,res,next)=>{
    res.json("This is the user route")
})

module.exports = router;