require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
require('./src/db/connection')
const hbs = require('hbs');
const path = require('path');
const jwt = require('jsonwebtoken')
const staticpath = path.join(__dirname, "./public");
const template = path.join(__dirname, "./template/views")
const partials = path.join(__dirname, "./template/partials")
const RegisterSBs = require('./src/models/model');
const auth = require('./src/oauth/auth');
const cookieParser = require('cookie-parser');
hbs.registerPartials(partials);
app.use(express.static(staticpath));
app.set("view engine", "hbs");
app.set('views', template);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())


app.post("/login", async (req, res) => {
    try {
        const email = req.body.username;
        const upassword = req.body.userpassword;
        if (!email || !upassword) {
            return res.status(400).send("Email and password are required.");
        }
        const user = await RegisterSBs.findOne({ email: email });
        if (user && user.password === upassword) {
            const channelname = user.email || ' ';
            const token = await user.generateAuthToken();
            console.log(token)
            res.cookie("jwt", token, {
                httpOnly: true,
            });

            console.log("successfully login " + user.email.slice(0, 13))
            res.status(200).render("dashboard", { channelname });
        } else {
            res.status(404).send("Invalid login details");
        }
    } catch (error) {
        console.log("Error during login:", error);
        res.status(500).send("An error occurred: " + error.message); // Display the error message
    }

});
console.log(process.env.SECRET_KEY);

app.post("/register", async (req, res) => {
    try {
        const email = req.body.email;
        const phone = req.body.phone;
        const pass = req.body.password;
        const conpas = req.body.cpassword;

        // Check if any required fields are empty
        if (!email || !phone || !pass || !conpas) {
            return res.status(400).send("All fields are required.");
        }

        if (pass === conpas) {
            const starbuckreg = new RegisterSBs({
                email: email,
                phone: phone,
                password: pass,
                cpassword: conpas,
            });
            const token = await starbuckreg.generateAuthToken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000)
            })
            console.log(token);
            await starbuckreg.save();
            res.render("login");
        } else {
            res.status(400).send("Passwords do not match.");
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).send("An error occurred.");
    }
});

app.get("/logout", auth, async (req, res) => {
    if (req.user) {
        req.user.token = req.user.token.filter((currElem) => {
            return currElem.tokens !== req.token;
        });
        await req.user.save();
        console.log("logout successfully");
    } else {
        console.log("User not authenticated");
    }
    res.render("login");
});

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/menu", (req, res) => {
    res.render("menu")
})
app.get("/rewards", (req, res) => {
    res.render("rewards")
})
app.get("/Pay", auth, (req, res) => {
    res.render("Pay")
})
app.get("/store", auth, (req, res) => {
    res.render("store")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.listen(port, () => {
    console.log(`running on port ${port}`)
})
