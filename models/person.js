require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);
mongoose.connect(url);

//Schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Name must be at least 3 character long"],
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (phoneNumber) => {
        const regex = /^(0\d{1,2}-\d{7}|\d{3}-\d{8})$/;
        return regex.test(phoneNumber);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
