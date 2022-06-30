// const useHistory = require("react-router");

const router = require("express").Router();
const User = require("../models/User");
const LoginUser = require("../models/LoginUser");
const bcrypt = require("bcrypt");


//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    console.log("Inside register");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log("After password generation");

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    console.log("After user creation");
    console.log(newUser);
    //save user and respond
    const user = await newUser.save();
    console.log("save");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("Inside Login");
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");
    console.log("After user check");
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")
    console.log("After password check");

    const loginUser = new LoginUser({
      username: user.username,
      email: req.body.email,
      password: user.password,
    });

    console.log("After user creation");
    console.log(loginUser);
    //save user and respond
    const SavedLoginuser = await loginUser.save();
    console.log("save");
    res.status(200).json(SavedLoginuser)
  } catch (err) {
    res.status(500).json(err)
  }
});


router.post("/logout", async (req, res) => {
  // const history = useHistory();
  try {
    // const navigate = useNavigate();
    console.log("Inside Logout");
    console.log(req.body.email);
    const user = await LoginUser.findOne({ email: req.body.email });
    //save user and respond
    // const SavedLoginuser = await loginUser.save();
    // console.log("save");
    console.log(user);
    const deletedData = await LoginUser.deleteOne({_id: user._id});
    console.log("after deletion");
    console.log(deletedData);
    // history.push("/login");
    console.log("Hi");
    // res.writeHead(200,{"Location": "http://localhost:3000/login"});
    // res.redirect("http://localhost:3000/login");
    // res.end(req.body.email);
    res.status(200).json(req.body.email);
    console.log("Bye");
    // history.push("/login");
    // navigate("/login");
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
