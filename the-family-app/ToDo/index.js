const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require("mongoose");

//models
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

//connection to db
mongoose.set('returnOriginal', false);

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
  console.log('Connected to db!');
  app.listen(3000, () => console.log('Server Up and running'));
});

//view engine configuration
app.set("view engine", "ejs");

// GET METHOD
app.get("/", async (req, res) => {
  try {
    const tasks = await TodoTask.find();
    res.render("todo.ejs", { todoTasks: tasks });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

//POST METHOD
app.post('/',async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

//UPDATE
app.route("/edit/:id")
.get(async (req, res) => {
  const id = req.params.id;
  try {
    const tasks = await TodoTask.find();
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
})
.post(async (req, res) => {
  const id = req.params.id;
  try {
    const updatedTask = await TodoTask.findOneAndUpdate(
      { _id: id },
      { content: req.body.content },
      { new: true }
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

//DELETE
app.route("/remove/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    await TodoTask.findByIdAndRemove(id);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});