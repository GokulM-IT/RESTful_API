const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + 'public'));

const url = 'mongodb://127.0.0.1:27017/wikiDB';

mongoose.connect(url)
    .then(() => {
        console.log('MongoDB successfully connected...');
    })

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
    .get((req, res) => {
        Article.find()
            .then(foundArticles => {
                res.send(foundArticles);
            })
            .catch(err => {
                res.send(err);
            });
    })
    .post((req, res) => {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });

        article.save()
            .then(() => {
                res.send('Successfully added a new article.');
            })
            .catch(err => {
                res.send(err);
            });
    })
    .delete((req, res) => {
        Article.deleteMany()
            .then(() => {
                res.send('Successfully deleted all articles.');
            })
            .catch(err => {
                res.send(err);
            });
    });

app.route('/articles/:specificArticle')
    .get((req, res) => {
        Article.findOne({ title: req.params.specificArticle })
            .then(matchedArticle => {
                if (matchedArticle) {
                    res.send(matchedArticle);
                } else {
                    res.send('No articles matching that title was found.')
                }
            })
            .catch(err => {
                res.send(err);
            });
    })
    .put((req, res) => {
        Article.replaceOne(
            { title: req.params.specificArticle },
            { title: req.body.title, content: req.body.content },
        )
            .then((docs) => {
                res.send('successfully updated.');
            })
            .catch(err => {
                res.send(err);
            });
    })
    .patch((req, res) => {
        Article.updateOne(
            { title: req.params.specificArticle },
            { $set: req.body }
        )
            .then(() => {
                res.send('Successfully updated.');
            })
            .catch(err => {
                res.send(err);
            });
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.specificArticle })
            .then(() => {
                res.send('Successfully deleted');
            })
            .catch(err => {
                res.send(err);
            });
    });

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port 3000....');
});