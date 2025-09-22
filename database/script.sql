CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo TEXT NOT NULL,
    email_institucional TEXT NOT NULL UNIQUE,
    curso TEXT,
    periodo INTEGER,
    semestre INTEGER,
    senha_hash TEXT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nome_completo, email_institucional, curso, periodo, semestre, senha_hash)
VALUES ('Julia Santos', 'julia@universidade.edu.br', 'TI', 2, 4, 'hash_da_senha');

SELECT * FROM usuarios;
