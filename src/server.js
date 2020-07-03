const express = require('express')
const server =  express()

// Configurar pasta public
server.use(express.static("public"))

// Habilitar o uso do req.body nessa aplicação
server.use(express.urlencoded({ extended: true }))

// utilizando template engine
const nujuncks = require("nunjucks")
const db = require('./database/db')

nujuncks.configure("src/views", {
    express: server,
    noCache: true
})

// configurar caminhos da minha aplicação
//pagina inicial
// req: Requisição
// res: Resposta
server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-game", (req, res) => {
    return res.render("create-game.html")
})

server.get("/search-results", (req, res) => {
    return res.render("search-results.html")
})

// Rota para inserir dados no banco de dados
server.post("/savepoint", (req, res) => {
    // req.body: o corpo do formulário
    // inserir dados no banco de dados
    // tabela:
    const query = `
    INSERT INTO games (
        name,
        image,
        genre,
        finished
    ) VALUES (?,?,?,?);
    `

    const values = [
        req.body.name,
        req.body.image,
        req.body.genre,
        req.body.finished
    ]

    function afterInserData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-game.html", { saved: true })
    }

    db.run(query, values, afterInserData)
})

// rota para abrir a pagina com todos os jogos cadastrados
server.get("/searchAll", (req, res) => {
    const search = req.query.search
   
    // pegar os dados do banco de dados
    db.all(`SELECT * FROM games`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        // mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", {games: rows, total: total })
    })
})

// rota para abrir a pagina com os jogos cadastrados de acordo com a pesquisa
server.get("/search", (req, res) => {
    const search = req.query.search
    
    if(search == "") {
        // pesquisa vazia
        return res.render("search-results.html", {total: 0})
    }

    // pegar os dados do banco de dados
    db.all(`SELECT * FROM games WHERE name LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        // mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", {games: rows, total: total })
    })
})

// ligar o servidor
server.listen(3000)


