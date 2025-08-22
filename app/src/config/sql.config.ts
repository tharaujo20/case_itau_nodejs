export default () => ({
  sql: {
    createTableClientes: `CREATE TABLE clients( id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, balance FLOAT NOT NULL DEFAULT 0, password INTEGER NOT NULL )`,
    insertClient: `INSERT INTO clients(name, email, balance, password) VALUES(?, ?, ?, ?)`,
    selectAllClients: `SELECT * FROM clients`,
    selectClientById: `SELECT * FROM clients WHERE id = ?`,
    selectByEmail: `SELECT * FROM clients WHERE email = ?`,
    updateClient: `UPDATE clients SET name = ?, email = ?, password = ? WHERE id = ?`,
    deleteClient: `DELETE FROM clients WHERE id = ?`,
    deposit: `UPDATE clients SET balance = balance + ? WHERE id = ?`,
    withdraw: `UPDATE clients SET balance = balance - ? WHERE id = ?`,
  },
});
