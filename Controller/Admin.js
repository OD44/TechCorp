const User = require("../Model/User");

const addAdmin = async (req, res) => {
    try {
      const { username } = req.params;
  
      const existingUser = await User.findOne({ username });
  
      if (!existingUser) {
        throw new Error("No user with this username found!!");
      }
  
      if (existingUser.isAdmin) {
        return res.status(400).json({
          message: 'User is already an admin!'
        });
      }
  
      await userModel.findOneAndUpdate({ username }, {isAdmin: true });
  
      res.status(201).json({
        message: 'User successfully added as admin!'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Server error!!'
      });
    }
  };



  module.exports = {addAdmin}