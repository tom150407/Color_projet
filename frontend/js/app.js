// ==========================================
// 1. GESTION DES DONNÉES ET DU PANIER
// ==========================================

// On récupère le panier sauvegardé ou on crée un tableau vide
let panier = JSON.parse(localStorage.getItem("panierCouleurs")) || [];

function mettreAJourCompteur() {
  const compteur = document.getElementById("compteur-panier");
  if (compteur) {
    compteur.textContent = panier.length;
  }
}

function ajouterAuPanier(idCouleur) {
  panier.push(idCouleur);
  localStorage.setItem("panierCouleurs", JSON.stringify(panier));
  mettreAJourCompteur();
  alert("Couleur ajoutée au panier !"); // Petit feedback visuel rapide
}

// ==========================================
// 2. LES VUES (Les différentes pages)
// ==========================================

// --- VUE : ACCUEIL ---
async function afficherPageAccueil(conteneur) {
  // 1. On prépare le terrain
  conteneur.innerHTML = `
        <h2 style="text-align: center; padding: 20px 0;">Nos Couleurs</h2>
        <section id="conteneur-produits" class="grille-produits"></section>
    `;

  const zoneProduits = document.getElementById("conteneur-produits");

  try {
    // 2. On récupère les données (⚠️ Vérifie bien le chemin vers ton JSON)
    const reponse = await fetch("../backend/couleurs.json"); // ou 'couleurs.json' selon où tu l'as rangé
    const couleurs = await reponse.json();

    // 3. On crée les cartes
    couleurs.forEach((couleur) => {
      const carte = document.createElement("article");
      carte.classList.add("carte-couleur");

      const apercu = document.createElement("div");
      apercu.classList.add("apercu-couleur");
      apercu.style.backgroundColor = couleur.hexadecimal;

      const titre = document.createElement("h2");
      titre.textContent = couleur.nom;

      const prix = document.createElement("p");
      prix.textContent = `${couleur.prix} €`;

      const bouton = document.createElement("button");

      if (couleur.enStock) {
        bouton.textContent = "Ajouter au panier";
        bouton.addEventListener("click", () => ajouterAuPanier(couleur.id));
      } else {
        bouton.textContent = "Rupture";
        bouton.disabled = true;
      }

      carte.appendChild(apercu);
      carte.appendChild(titre);
      carte.appendChild(prix);
      carte.appendChild(bouton);

      zoneProduits.appendChild(carte);
    });
  } catch (erreur) {
    zoneProduits.innerHTML = "<p>Erreur lors du chargement des couleurs.</p>";
    console.error(erreur);
  }
}

// --- VUE : PANIER ---
// --- VUE : PANIER ---
async function afficherPagePanier(conteneur) {
  // Si le panier est vide, on affiche un message simple et on arrête la fonction (return)
  if (panier.length === 0) {
    conteneur.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto; padding: 50px; text-align: center;">
                <h2>Votre Panier</h2>
                <p>Votre panier est tristement vide. Allez ajouter quelques couleurs !</p>
                <a href="#/" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 4px;">Retour à la boutique</a>
            </div>`;
    return;
  }

  // NOUVEAU : Si le panier est plein, on prépare le terrain avec le récapitulatif ET le formulaire
  conteneur.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
            <h2>Votre Panier</h2>
            <section id="contenu-panier"></section>
            
            <h3 style="text-align: right; margin-top: 20px;">Total : <span id="prix-total">0.00</span> €</h3>
            
            <div style="text-align: right; margin-top: 20px; margin-bottom: 40px;">
                <button id="btn-vider" style="background-color: #dc3545;">Vider le panier</button>
            </div>

            <hr style="border: 1px solid #eee; margin-bottom: 30px;">

            <h2>Coordonnées de livraison</h2>
            <form id="formulaire-commande" style="display: flex; flex-direction: column; gap: 15px; max-width: 500px;">
                <div>
                    <label for="prenom">Prénom :</label><br>
                    <input type="text" id="prenom" required style="width: 100%; padding: 8px;">
                </div>
                <div>
                    <label for="nom">Nom :</label><br>
                    <input type="text" id="nom" required style="width: 100%; padding: 8px;">
                </div>
                <div>
                    <label for="email">Email :</label><br>
                    <input type="email" id="email" required style="width: 100%; padding: 8px;">
                </div>
                <div>
                    <label for="adresse">Adresse de livraison :</label><br>
                    <textarea id="adresse" required style="width: 100%; padding: 8px;"></textarea>
                </div>
                <button type="submit" style="background-color: #28a745; font-size: 1.1em; padding: 15px; margin-top: 10px;">Confirmer et Payer</button>
            </form>
        </div>
    `;

  const zonePanier = document.getElementById("contenu-panier");
  const affichageTotal = document.getElementById("prix-total");
  let montantTotal = 0;

  // --- GESTION DE L'AFFICHAGE DES ARTICLES ---
  try {
    const reponse = await fetch("../backend/couleurs.json"); // Garde ton chemin actuel ici
    const toutesLesCouleurs = await reponse.json();

    panier.forEach((idDansLePanier) => {
      const couleurChoisie = toutesLesCouleurs.find(
        (c) => c.id === idDansLePanier,
      );
      if (couleurChoisie) {
        const article = document.createElement("div");
        article.style.borderBottom = "1px solid #ccc";
        article.style.padding = "10px 0";
        article.style.display = "flex";
        article.style.justifyContent = "space-between";

        article.innerHTML = `
                    <span><strong>${couleurChoisie.nom}</strong></span>
                    <span>${couleurChoisie.prix} €</span>
                `;
        zonePanier.appendChild(article);
        montantTotal += couleurChoisie.prix;
      }
    });
    affichageTotal.textContent = montantTotal.toFixed(2);
  } catch (erreur) {
    console.error(erreur);
  }

  // --- GESTION DES CLICS ET ÉVÉNEMENTS ---

  // 1. Bouton "Vider le panier"
  document.getElementById("btn-vider").addEventListener("click", () => {
    panier = [];
    localStorage.removeItem("panierCouleurs");
    mettreAJourCompteur();
    afficherPagePanier(conteneur);
  });

  // 2. NOUVEAU : Validation du Formulaire
  const formulaire = document.getElementById("formulaire-commande");

  formulaire.addEventListener("submit", (evenement) => {
    // LIGNE CRUCIALE : Empêche la page de se recharger !
    evenement.preventDefault();

    // On récupère le prénom pour le personnaliser
    const prenomClient = document.getElementById("prenom").value;

    // On génère un faux numéro de commande aléatoire
    const numeroCommande = Math.floor(Math.random() * 1000000);

    // On vide le panier puisque la commande est passée
    panier = [];
    localStorage.removeItem("panierCouleurs");
    mettreAJourCompteur();

    // On remplace tout le contenu de la page par un message de succès
    conteneur.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2 style="color: #28a745; font-size: 2em;">Commande validée ! 🎉</h2>
                <p style="font-size: 1.2em;">Merci <strong>${prenomClient}</strong> pour votre achat.</p>
                <p>Votre commande n°<strong>${numeroCommande}</strong> a bien été enregistrée.</p>
                <p>Vos magnifiques couleurs arriveront très bientôt chez vous.</p>
                <br>
                <a href="#/" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 4px;">Retour à l'accueil</a>
            </div>
        `;
  });
}

// ==========================================
// 3. LE ROUTEUR (Le chef d'orchestre)
// ==========================================

function routeur() {
  const app = document.getElementById("app");
  const hash = window.location.hash;

  // On met à jour le compteur à chaque changement de page
  mettreAJourCompteur();

  // On vide la page
  app.innerHTML = "";

  // On affiche la bonne vue selon l'URL
  if (hash === "" || hash === "#/") {
    afficherPageAccueil(app);
  } else if (hash === "#/panier") {
    afficherPagePanier(app);
  } else {
    app.innerHTML =
      "<h2 style='text-align:center; padding: 50px;'>Erreur 404 : Page introuvable</h2>";
  }
}

// On écoute les changements dans la barre d'adresse
window.addEventListener("hashchange", routeur);

// On lance le routeur au tout premier chargement de la page
window.addEventListener("load", routeur);
