const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("BarberFlow API Rodando!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

const clienteRoutes = require("./src/routes/clienteRoutes");
app.use("/clientes", clienteRoutes);
