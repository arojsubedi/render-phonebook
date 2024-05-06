const express = require('express')
const cors = require('cors');


const morgan = require('morgan')


const app = express()
morgan('tiny')

app.use(express.json())
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));

const persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find((p) => p.id === id)
    console.log('person', person)
    if (!person) {
        response.status(404).end()
    }
    else {
        response.json(person)
    }
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
    console.log('body',body)
    if (!body) {
        return response.status(400).json({
            error: 'body is missing'
        })
    }
    else {
        const isPersonThere = persons.find((p) => p.name == body.name)
        if (isPersonThere) {
            return response.status(400).json({
                error: 'name must be unique'
            })
        } else {
            const person = {
                "id": Math.random(1, 10000),
                "name": body.name,
                "number": body.number
            }
            perons = persons.concat(person)
            response.json(person)
        }
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter((p) => p.id !== id)
    response.status(204).end()

})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});