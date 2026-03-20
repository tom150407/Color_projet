// 1. On importe les outils qu'on vient d'installer
const express = require("express");
const cors = require("cors");
// On importe notre fameux fichier de couleurs !
const couleurs = require("./data/couleurs.json");

// 2. On initialise l'application
const app = express();
const PORT = 3000;

// 3. On autorise le frontend (Live Server) à faire des requêtes vers ce serveur
app.use(cors());

// --- NOTRE API ---

// 4. On crée une "route".
// Quand quelqu'un ira sur http://localhost:3000/api/couleurs, on lui enverra le JSON.
app.get("/api/couleurs", (req, res) => {
  console.log("Quelqu'un a demandé les couleurs !");
  res.json(couleurs);
});

// 5. On lance le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré avec succès sur http://localhost:${PORT}`);
});
