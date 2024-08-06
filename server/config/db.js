import pkg from "mssql";
const { ConnectionPool } = pkg;

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
};

const poolPromise = new ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("Database Connection Failed! Bad Config: ", err);
    throw err;
  });

const executeQuery = async (query, params = []) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    params.forEach((param) => {
      request.input(param.name, param.type, param.value);
    });
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL error: ", err);
    throw err;
  }
};

export { executeQuery };
