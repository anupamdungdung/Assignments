import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
//update a user

export const updateUser = async (req, res) => {
  const { name, email, dateOfBirth, description, address, password, userId } =
    req.body;
  if (userId === req.params.id) {
    if (password) {
      try {
        password = await bcrypt.hash(password, 12);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body, //Set other fields of the user data
      });
      if (!user) {
        res.status(404).json("User not found");
      } else {
        res.status(200).json("Account details successfully updated");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can only update your account");
  }
};
//delete a user
export const deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const result = await User.findByIdAndDelete(req.params.id);
      if (!result) {
        res.status(404).json("Account not found");
      } else {
        res.status(200).json("Account has been deleted");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
};
//get a user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.send(404).json("User Not Found");
    } else {
      const { password, ...other } = user._doc; //Ignoring the password field show all the data
      res.status(200).json(other);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
//Send a friend request
export const sendRequest = async (req, res) => {
  const { userId } = req.body;
  if (!(userId === req.params.id)) {
    try {
      const user = await User.findById(req.params.id); //The one whom we are sending friend request
      const currentUser = await User.findById(userId); //The one sending the request
      if (!user || !currentUser) {
        res.status(404).json("User not found");
      } else {
        if (
          !user.friendRequestsReceived.includes(userId) &&
          !currentUser.friends.includes(req.params.id)
        ) {
          await user.updateOne({ $push: { friendRequestsReceived: userId } });
          await currentUser.updateOne({
            $push: { friendRequestsSent: req.params.id },
          });
          res.status(200).json("Friend request sent!");
        } else {
          res.status(403).json("You have already sent a request to this user or you are already friends!");
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't send a friend request to yourself!");
  }
};
//Delete a friend request
export const deleteRequest = async (req, res) => {
  const { userId } = req.body;
  if (userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); //The one whom we are sending friend request
      const currentUser = await User.findById(userId); //The one sending the request
      if (!user || !currentUser) {
        res.status(404).json("User not found");
      } else {
        if (user.friendRequestsReceived.includes(userId)) {
          await user.updateOne({ $pull: { friendRequestsReceived: userId } });
          await currentUser.updateOne({
            $pull: { friendRequestsSent: req.params.id },
          });
          res.status(200).json("Friend request deleted!");
        } else {
          res.status(403).json("No request to delete!");
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't delete a friend request to yourself!");
  }
};

//Accept a friend request
export const acceptRequest = async (req, res) => {
  const { userId } = req.body;
  if (userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); //The one whose request we have to accept
      const currentUser = await User.findById(userId); //The one who is accepting the request
      if (!user || !currentUser) {
        res.status(404).json("User not found");
      } else {
        if (currentUser.friendRequestsReceived.includes(req.params.id)) {
          //Pull the ids from the friend requests sent and received
          await currentUser.updateOne({
            $pull: { friendRequestsReceived: req.params.id },
            $push: {
              friends: req.params.id,
            },
          });
          await user.updateOne({
            $pull: { friendRequestsSent: userId },
            $push: {
              friends: userId,
            },
          });

          res.status(200).json("Friend request accepted!");
        } else {
          res.status(403).json("No request to accept!");
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't accept a request to yourself!");
  }
};
//Reject a friend request
export const rejectRequest = async (req, res) => {};
