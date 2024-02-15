const passport = require("passport");
const User = require("../Model/User");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')

const SignUp = async (req, res)=>{
    const {username, email, password, confirmPassword} = req.body;
    
    if(password !== confirmPassword) return res.json({error: "Password and Confirm Password does not match"})

    if(!username || !email || !password || !confirmPassword){
        return res.status(400).json({error: "All fields are required "})
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(404).json({error: "User already exist"})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        email: email,
        username: username,
        password: hashedPassword
    })

    await User.register(newUser, password, function(err){
        if(err){
            console.log(err);
        }

        passport.authenticate('local')(req, res, function(err){
            res.json({message: "You're succesfully signed up"})
        })

        const transport = nodemailer.createTransport({
            service: "Gmail",
            auth : {
                user: process.env.my_email,
                pass: process.env.my_password
            },
        });
        const mailOptions = {
            from : process.env.my_email,
            to : email,
            subject: 'Welcome to our App',
            text: 'Hello! Welcome to our app. We hope you enjoy your experience',
        };
        transport.sendMail(mailOptions, function(error, info){
            if(error){
                console.error(error);
            }
        });
    })
}


const SignIn = async (req,res)=>{
    const {username, password} = req.body;
    if(!username){
        return res.json({error: "username is required"})
    } 
    if(!password){
        return res.json({eror: "Password is required"})
    }

    const existingUser = await User.findOne({username});
    if(!existingUser){
        return res.status(404).json({error: "User not found! Kindly Signup to continue"})
    }
    const matchedPassword = await bcrypt.compare(password, existingUser.password);
    if(!matchedPassword){
        return res.json({error: "Password is Invalid"})
    }

    const user = new User({
        username,
        password
    })
    req.login(user, function(err){
        if(err){
            return res.json(err)
        }
        passport.authenticate("local")(req, res, function(){
            res.json({message: "You have succssfully logged in"})
        })
    })
}

//forget Password here
const forgetPassword = async (req, res) => {
    const { email } = req.body
    const id = req.params.id
    console.log(id)
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //reset token here
        const token = generateRandom();
        user.resetToken = token
        //set the time for the token to expire
        user.resetExpires = Date.now() + 3600000

        await user.save()

        //function to send the reset link via email 
        const resetLink = `${process.env.LOCALHOST_URL}/reset/${token}`
        console.log("reset link", resetLink)

        //nodemailer function here
        const transporter = nodemailer.createTransport({
            host: 'Gmail',
            port: 465,
            secure: true,
            auth: {
                user: process.env.my_email, // Correct the variable name here
                pass: process.env.my_password,
            },
        });

        const mailOptions = {
            from: process.env.my_email,
            to: user.email,
            subject: 'Forget password Link ',
            text: `Dear ${user?.username}, this link is to be followed to reset your password ${resetLink}`, // Change the email content as needed
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
                res.status(500).send('Failed to send email');
            } else {
                console.log('Email sent: ' + info.response);
                // res.status(200).send('Email sent successfully');
                res.status(200).json({ message: "Reset link sent successfully" })
            }
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "server Error" })
    }

}

const updatePassword = async (req, res) => {

    try {
        const { password, confirm } = req.body;

        if (password !== confirm) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const user = await User.findOne({
            resetToken: req.params.token,
            resetExpires: { $gte: Date.now() }
        });

        if (!user) {
            return res.json({ message: "Password reset token invalid or has expired" });
        }

        const newPassword = req.body.password;
        const confirmPassword = req.body.confirm;

        if (newPassword !== confirmPassword) {
            return res.json({ message: "Passwords do not match" });
        }

        // Set the new password and reset token
        await user.setPassword(password);
        user.resetToken = undefined;
        user.resetExpires = undefined;
        await user.save();

        return res.json({ message: "Password successfully reset" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const Logout = async(req, res)=>{
    req.logout(function(err){
        if(err){
            return res.json(err)
        }
        res.json({message: "Logout successful"})
    })
}



module.exports = {
    SignUp,
    SignIn,
    forgetPassword,
    updatePassword,
    Logout
}