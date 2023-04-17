const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());

app.use(cors());

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :isPost"
  )
);

morgan.token("isPost", function (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "n/a";
});

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
  res.json(persons);
});

app.get("/info", (req, res) => {
  const time = Date();
  res.send(`
    Phonebook has info for ${persons.length} people
    <br/>
    ${time}
    `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  console.log(req.method);
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
  const person = {
    id: Math.random() * (10000 - 10) + 10,
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  res.json(person);
});

app.listen(3001, () => console.log("Port 3001"));
