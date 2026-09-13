import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Person from './models/person.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'
  )
)

const MONGO_URI = process.env.MONGODB_URI

if (!MONGO_URI) {
  console.log('error: MONGODB_URI not set')
  process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

app.get('/api/persons', async (request, response) => {
  const persons = await Person.find({})
  response.json(persons)
})

app.get('/api/persons/:id', async (request, response) => {
  const person = await Person.findById(request.params.id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).json({ error: 'person not found' })
  }
})

app.get('/info', async (request, response) => {
  const count = await Person.countDocuments({})
  const now = new Date()
  response.send(
    `<p>Phonebook has info for ${count} people</p>` +
      `<p>${now.toString()}</p>`
  )
})

app.delete('/api/persons/:id', async (request, response) => {
  await Person.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

app.post('/api/persons', async (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  const savedPerson = await person.save()
  response.status(201).json(savedPerson)
})

app.put('/api/persons/:id', async (request, response) => {
  const { name, number } = request.body

  const updatedPerson = await Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )

  if (updatedPerson) {
    response.json(updatedPerson)
  } else {
    response.status(404).json({ error: 'person not found' })
  }
})

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static(path.join(__dirname, 'frontend/dist')))
app.use(unknownEndpoint)

const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})