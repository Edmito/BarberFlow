const express = require("express");
const Cliente = require("../models/Cliente");

const router = express.Router();

// Criar cliente
router.post("/", async (req, res) => {
    try {
        const cliente = await Cliente.create(req.body);
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar cliente" });
    }
});

// Listar clientes
router.get("/", async (req, res) => {
    const clientes = await Cliente.findAll();
    res.json(clientes);
});

module.exports = router;
