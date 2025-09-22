const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 3000;
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());

// Conecta ao banco de dados SQLite
const db = new sqlite3.Database('connexa.db', (err) => {
    if (err) {
        return console.error('Erro ao conectar com o banco de dados:', err.message);
    }
    console.log('Conectado ao banco de dados SQLite.');
});

// Endpoint de cadastro
app.post('/api/cadastro', (req, res) => {
    const { nome_completo, email_institucional, curso, semestre, periodo, senha_hash } = req.body;

    bcrypt.hash(senha_hash, saltRounds, (err, hash) => {
        if (err) {
            console.error('Erro ao fazer hash da senha:', err);
            return res.status(500).json({ error: 'Erro ao processar a senha.' });
        }

        const sql = `INSERT INTO usuarios (nome_completo, email_institucional, curso, semestre, periodo, senha_hash) VALUES (?, ?, ?, ?, ?, ?)`;

        db.run(sql, [nome_completo, email_institucional, curso, semestre, periodo, hash], function(insertErr) {
            if (insertErr) {
                if (insertErr.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'E-mail já cadastrado.' });
                }
                return res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
            }
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: this.lastID });
        });
    });
});

// Endpoint de login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // 1. Verificar se o e-mail existe no banco de dados
    const sql = `SELECT * FROM usuarios WHERE email_institucional = ?`;
    db.get(sql, [email], (err, user) => {
        if (err) {
            console.error('Erro na consulta ao banco de dados:', err);
            return res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
        }

        // 2. Se o usuário não for encontrado, retornar erro genérico
        if (!user) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
        }

        // 3. Comparar a senha fornecida com o hash salvo no banco
        bcrypt.compare(password, user.senha_hash, (compareErr, result) => {
            if (compareErr) {
                console.error('Erro na comparação de senhas:', compareErr);
                return res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
            }

            // 4. Se as senhas não corresponderem, retornar erro genérico
            if (!result) {
                return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
            }

            // 5. Autenticação bem-sucedida
            res.status(200).json({ message: 'Login bem-sucedido!', user: { id: user.id, email: user.email_institucional, nome: user.nome_completo } });
        });
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});