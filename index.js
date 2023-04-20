const express = require("express");
const cors = require("cors");
const app = express();
const Person = require("./models/person");
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res) => {
  const time = Date();
  return Person.find({}).then((personsArr) => {
    res.send(`
      Phonebook has info for ${personsArr.length} people
      <br />
      ${time}
    `);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById(id).then((person) => {
    res.json(person);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const checkName = persons.find((p) => p.name === body.name) ? true : false;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number is missing, please fill in all required fields",
    });
  }
  if (checkName) {
    return res.status(400).json({
      error:
        "name already exists in the phonebook, please use a different name",
    });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
