const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs"); // Import de la librairie de cryptage

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, "data");
const COULEURS_FILE = path.join(DATA_DIR, "couleurs.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// --- FONCTIONS UTILITAIRES DE LECTURE/ÉCRITURE ---
const readJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJSON = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

// --- ROUTES API ---

// 1. Récupérer les produits
app.get("/api/couleurs", (req, res) => {
  try {
    res.json(readJSON(COULEURS_FILE));
  } catch (err) {
    res.status(500).json({ error: "Erreur lecture produits" });
  }
});

// 2. INSCRIPTION (Nouvel Utilisateur)
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const users = readJSON(USERS_FILE);

  // Vérifier si l'utilisateur existe déjà
  if (users.find((u) => u.username === username)) {
    return res
      .status(400)
      .json({ success: false, message: "Pseudo déjà pris" });
  }

  // CRYPTAGE DU MOT DE PASSE (Sécurité)
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = { id: Date.now(), username, password: hashedPassword };
  users.push(newUser);
  writeJSON(USERS_FILE, users);

  res.json({ success: true, message: "Inscription réussie !" });
});

// 3. CONNEXION
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const users = readJSON(USERS_FILE);

  const user = users.find((u) => u.username === username);

  // Vérifier l'utilisateur ET comparer le mot de passe crypté
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ success: true, user: user.username, token: "fake-jwt" });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Identifiants incorrects" });
  }
});

app.listen(3000, () =>
  console.log("🚀 Serveur auth lancé sur http://localhost:3000"),
);
