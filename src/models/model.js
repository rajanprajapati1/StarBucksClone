const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");


const StrabucksSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        },
    },
    phone: {
        type: Number,
        required: true,
        validate(value) {
            if (!validator.isMobilePhone(String(value), "any", { strictMode: false })) {
                throw new Error("Invalid Phone Number");
            }
        },
    },
    password: {
        required: true,
        type: String,
    },
    cpassword: {
        required: true,
        type: String,
    }, tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]

});


StrabucksSchema.methods.generateAuthToken = async function () {
    try {
        const genertoken = jwt.sign(
            { _id: this._id.toString() },
            process.env.SECRET_KEY
        );
        this.tokens = this.tokens.concat({ token: genertoken });
        await this.save();
        console.log(genertoken)
        return genertoken;
    } catch (error) {

    }
}



const RegisterSBs = new mongoose.model('StarbuckDatas', StrabucksSchema);



module.exports = RegisterSBs;