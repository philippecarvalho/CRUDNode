const express = require('express')
const app = express()
const bodyparser = require('body-parser')

const ObjectId = require('mongodb').ObjectID

const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://USER:PASS@cluster0.c0o5s.mongodb.net/DATABASE?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

client.connect(err => {
    db = client.db('desafio-crud')

    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
})

const port = 3000

app.use(express.static(__dirname + '/public'));

app.use(bodyparser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.route('/show')
    .get((req, res) => {
        db.collection('users').find().toArray((err, results) => {
            if (err) return console.log(err)
            res.render('show', { data: results })
        })
    })
    .post((req, res) => {
        db.collection('users').insertOne(req.body, (err, result) => {
            if (err) return console.log(err)

            console.log('Salvo no Banco de Dados')
            res.redirect('/show')
        })
    });

app.route('/edit/:id')
    .get((req, res) => {
        var id = req.params.id

        db.collection('users').find(ObjectId(id)).toArray((err, result) => {
            if (err) return res.send(err)
            res.render('edit', { data: result })
        })
    })
    .post((req, res) => {
        const id = req.params.id
        const nome = req.body.nome
        const email = req.body.email
        const nascimento = req.body.nascimento
        const telefone = req.body.telefone
        const cpf = req.body.cpf
        const cidade = req.body.cidade
        const estado = req.body.estado


        db.collection('users').updateOne({ _id: ObjectId(id) }, {
            $set: {
                nome: nome,
                email: email,
                nascimento: nascimento,
                telefone: telefone,
                cpf: cpf,
                cidade: cidade,
                estado: estado
            }
        }, (err, result) => {
            if (err) return res.send(err)
            res.redirect('/show')
            console.log('Atualizado no Banco de Dados')
        })
    })

app.route('/delete/:id')
    .get((req, res) => {
        let id = req.params.id


        db.collection('users').deleteOne({ _id: ObjectId(id) }, (err, result) => {
            if (err) return res.send(500, err)
            console.log('Deletado do Banco de Dados!')
            res.redirect('/show')
        })
    })
