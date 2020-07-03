// Importar a dependencia do sqlite3
const sqlite3 = require("sqlite3").verbose()

// Criar o objeto que irá fazer operações no banco de dados
const db = new sqlite3.Database("./src/database/database.db")

// Exportar
module.exports = db

db.serialize(() => {
    //Criar uma tabela com comandos SQL
    db.run(`
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            image TEXT,
            genre TEXT,
            finished TEXT
        );
    `)
})

// 3 consultar os dados da tabela
    
    db.all(`SELECT name FROM games`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        console.log("Aqui estão seus registros")
        console.log(rows)
    })
    

// 4 deletar os dados da tabela
    /*
    db.run(`DELETE FROM games WHERE id = ?`, [1], function(err) {
        if(err) {
            return console.log(err)
        }

        console.log("Registro deletado com sucesso")
    }) 
    */
    
    
    
    
