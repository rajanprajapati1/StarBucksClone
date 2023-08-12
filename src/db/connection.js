const mongoose = require('mongoose');

mongoose.connect(
    'mongodb://127.0.0.1:27017/StarbucksData', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("sucessfully connected to MongoDB")
}).catch((err) => {
    console.log(err)
});