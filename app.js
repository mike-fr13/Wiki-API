//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get((req, res) => {
  Article.find({})
    .then(foundArticles => res.status(200).send(foundArticles))
    .catch(err => res.status(500).send("Internal Server Error"));
})

.post((req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save()
    .then(() => res.status(201).send("Successfully added a new article."))
    .catch(err => res.status(500).send("Internal Server Error"));
})

.delete((req, res) => {
  Article.deleteMany({})
    .then(() => res.status(200).send("Successfully deleted all articles."))
    .catch(err => res.status(500).send("Internal Server Error"));
});

app.route("/articles/:articleTitle")

.get((req, res) => {
  Article.findOne({title: req.params.articleTitle})
    .then(foundArticle => {
      if (foundArticle) {
        res.status(200).send(foundArticle);
      } else {
        res.status(404).send("No articles matching that title were found.");
      }
    })
    .catch(err => res.status(500).send("Internal Server Error"));
})

.put((req, res) => {
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true})
    .then(() => res.status(200).send("Successfully updated the selected article."))
    .catch(err => res.status(500).send("Internal Server Error"));
})

.patch((req, res) => {
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body})
    .then(() => res.status(200).send("Successfully updated article."))
    .catch(err => res.status(500).send("Internal Server Error"));
})

.delete((req, res) => {
  Article.deleteOne({title: req.params.articleTitle})
    .then(() => res.status(200).send("Successfully deleted the corresponding article."))
    .catch(err => res.status(500).send("Internal Server Error"));
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
