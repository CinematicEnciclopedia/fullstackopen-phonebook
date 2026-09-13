import 'dotenv/config'
import mongoose from 'mongoose'

const password = process.argv[2]

let url = process.env.MONGODB_URI

if (!url) {
  if (!password) {
    console.log('give password as argument')
    process.exit(1)
  }

  url = `mongodb+srv://networkingbarcelona_db_user:${encodeURIComponent(
    password
  )}@cluster0.ei9c9ig.mongodb.net/phonebook?appName=Cluster0`
}

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person.find({}).then((persons) => {
    console.log('phonebook:')
    persons.forEach((person) => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}