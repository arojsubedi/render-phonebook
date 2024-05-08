const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then((result) => {
        console.log('Connected tot he DB')
    })
    .catch((error) => {
        console.log('error while connecting to MongoDB: ', error.message)
    })

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function (v) {
                return /^\d{2}-\d+$/.test(v); // Added ^ and $ to match entire string
            },
            message: props => `${props.value} is not a valid phone number! Please provide a number in the format 02-XXXXXXX.`
        }
    }
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)