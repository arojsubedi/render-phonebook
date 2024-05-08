const express = require('express')
require('dotenv').config()
const cors = require('cors');
const morgan = require('morgan')
morgan('tiny')

const app = express()
const Phonebook = require('./models/phonebook');
const phonebook = require('./models/phonebook');
const PORT = process.env.PORT

app.use(express.json())
app.use(cors());
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));


app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(persons => {
        response.json(persons)
    })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body) {
        return response.status(400).json({
            error: 'body is missing'
        })
    }
    else {
        Phonebook.findOne({ name: body.name })
            .then((existingPerson) => {
                if (existingPerson) {
                    existingPerson.number = body.number
                    existingPerson.save()
                        .then(updatedPerson => {
                            response.json(updatedPerson)
                        })
                        .catch(error => {
                            response.status(500).json({ error: 'Internal Server Error' })
                        })
                }
                else {
                    const phonebook = new Phonebook({
                        name: body.name,
                        number: body.number,
                    })

                    phonebook.save().then(result => {
                        response.json(result)
                    })
                        .catch(error => next(error))
                }
            })
    }
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const body = request.body;

    // Check if body is missing
    if (!body) {
        return response.status(400).json({
            error: 'Body is missing'
        });
    }

    // Update the phonebook entry
    Phonebook.findByIdAndUpdate(id, { $set: body }, { new: true })
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson);
            } else {
                response.status(404).json({ error: 'Entry not found' });
            }
        })
        .catch(error => {
            response.status(500).json({ error: 'Internal Server Error' });
        });
});

app.get('/api/persons/:id', (request, response) => {
    phonebook.findById(request.params.id)
        .then(foundPerson => {
            if (foundPerson) {
                response.json(foundPerson)
            }
            else {
                response.status(404).json({ error: "Entry not found" })
            }
        })
        .catch(error => {
            response.status(500).json({ error: "Internal Server Error" })
        })
})

app.get('/info', (request, response) => {
    const noOfPeople = persons.length
    response.send(`<p>Phonebook has info for ${noOfPeople} people</p><br/><p>${new Date().toString()}</p>`)
})

// Define custom morgan token to log person object attributes
morgan.token('person', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body); // Log request body for POST requests
    }
    return '-';
});

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body) {
        return response.status(400).json({
            error: 'body is missing'
        })
    }
    else {


        const phonebook = new Phonebook({
            name: body.name,
            number: body.number,
        })

        phonebook.save().then(result => {
            response.json(result)
        })

    }
})

app.delete('/api/persons/:id', (request, response, next) => {
    Phonebook.findByIdAndDelete(request.params.id)
        .then(result => {
            if (result) {
                response.json(result)
            }
            else
                response.status(204).end()
        })
        .catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        console.log('error.message', error.message)
        return response.status(400).send({ newError: error.message });
    }

    next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});