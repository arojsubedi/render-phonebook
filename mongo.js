const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]


const url =
    `mongodb+srv://arojsubedi:${password}@phonebook.tqrnrs1.mongodb.net/?retryWrites=true&w=majority&appName=phonebook`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
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
});

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

if (process.argv.length > 3) {
    const username = process.argv[3]
    const usrphonenumber = process.argv[4]

    const phonebook = new Phonebook({
        name: username,
        number: usrphonenumber,
    })

    phonebook.save().then(result => {
        console.log(`added ${username} number ${usrphonenumber} to phonebook`)
        mongoose.connection.close()
    })
}
else {
    Phonebook.find({}).then(result => {
        result.forEach(user => {
            console.log(user.name + " " + user.number)
        })
        mongoose.connection.close()
    })
}