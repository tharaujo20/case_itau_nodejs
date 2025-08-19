export default () => ({
  sql: {
    createTableClientes: `CREATE TABLE clientes( id TEXT PRIMARY KEY, nome TEXT NOT NULL, email TEXT NOT NULL UNIQUE, saldo FLOAT NOT NULL DEFAULT 0 )`,
    insertClient: `INSERT INTO clientes(nome, email, saldo) VALUES(?, ?, ?)`,
    selectAllClients: `SELECT * FROM clientes`,
    selectClientById: `SELECT * FROM clientes WHERE id = ?`,
    selectByEmail: `SELECT * FROM clientes WHERE email = ?`,
    updateClient: `UPDATE clientes SET nome = ?, email = ? WHERE id = ?`,
    deleteClient: `DELETE FROM clientes WHERE id = ?`,
    deposit: `UPDATE clientes SET saldo = saldo + ? WHERE id = ?`,
    withdraw: `UPDATE clientes SET saldo = saldo - ? WHERE id = ?`,
  },
});
