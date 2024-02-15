const express = require('express')
const {SignUp, SignIn, updatePassword, Logout, forgetPassword} = require('../Controller/Auth')
const { CreatePost, getPost, singlePost, updatePost, deletePost } = require('../Controller/Blog')
const { isLoggedin, isAdmin} = require('../Middleware/auth')
const {addAdmin} = require("../Controller/Admin")

const router = express.Router()

router.route('/').post(SignUp)
router.route("/sign-in").post(SignIn)
router.route("/reset").post(forgetPassword)
router.route("/reset:token").post(updatePassword)
router.route("/logout").get(Logout)
router.route("/create-post").post([isLoggedin],CreatePost)
router.route("/get-allpost").get([isLoggedin], getPost)
router.route("/get-post/:postId").get([isLoggedin], singlePost)
router.route("/update/:postId").patch([isLoggedin], updatePost)
router.route("/delete/:id").delete(deletePost)
router.route("/add-admin/:username").post([isLoggedin, isAdmin], addAdmin)

module.exports = router