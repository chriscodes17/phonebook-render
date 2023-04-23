const express = require("express")
const cors = require("cors")
const app = express()
const Person = require("./models/person")
app.use(express.json())
app.use(cors())
app.use(express.static("build"))

const errorHandler = (error, req, res, next) => {
  console.log(error)
  if (error.name === "CastError") {
    return res.status(400).send({ error: "Malformatted id" })
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get("/info", (req, res) => {
  const time = Date()
  return Person.find({}).then((personsArr) => {
    res.send(`
      Phonebook has info for ${personsArr.length} people
      <br />
      ${time}
    `)
  })
})

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then((person) => {
      res.json(person)
    })
    .catch((error) => {
      return next(error)
    })
})

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => {
      return next(error)
    })
})

app.post("/api/persons", async (req, res, next) => {
  try {
    const { name, number } = req.body
    if (!name || !number) {
      return res.status(400).json({
        error: "name or number is missing, please fill in all required fields",
      })
    }
    let persons = await Person.find({})
    const checkName = persons.find((p) => p.name === name) ? true : false
    if (checkName) {
      return res.status(400).json({
        error:
          "name already exists in the phonebook, please use a different name",
      })
    }
    const person = new Person({
      name: name,
      number: number,
    })
    const savedPerson = await person.save()
    res.json(savedPerson)
  } catch (error) {
    return next(error)
  }
})

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  const { name, number } = req.body
  const person = {
    name: name,
    number: number,
  }
  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => {
      return next(error)
    })
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
