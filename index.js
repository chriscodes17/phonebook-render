const express = require("express");
const cors = require("cors");
const app = express();
const Person = require("./models/person");
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

const errorHandler = (error, req, res, next) => {
  console.log(error);
  if (error.name === "CastError") {
    res.status(400).send({ error: "Malformatted id" });
  }
  next(error);
};

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

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => {
      return next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => {
      return next(error);
    });
});

app.post("/api/persons", async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.name || !body.number) {
      return res.status(400).json({
        error: "name or number is missing, please fill in all required fields",
      });
    }
    let persons = await Person.find({});
    const checkName = persons.find((p) => p.name === body.name) ? true : false;
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
    const savedPerson = await person.save();
    res.json(savedPerson);
  } catch (error) {
    return next(error);
  }
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => {
      return next(error);
    });
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
