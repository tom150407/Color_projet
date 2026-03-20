// 1. On récupère les IDs sauvegardés dans le navigateur
let panier = JSON.parse(localStorage.getItem("panierCouleurs")) || [];

async function afficherPanier() {
  const conteneur = document.getElementById("contenu-panier");
  const affichageTotal = document.getElementById("prix-total");
  let montantTotal = 0;

  // Si le panier est vide, on affiche un petit message et on arrête la fonction
  if (panier.length === 0) {
    conteneur.innerHTML = "<p>Votre panier est tristement vide.</p>";
    return;
  }

  try {
    // 2. On récupère notre base de données de couleurs
    const reponse = await fetch("couleurs.json");
    const toutesLesCouleurs = await reponse.json();

    // 3. On boucle sur chaque ID présent dans notre panier
    panier.forEach((idDansLePanier) => {
      // On cherche la couleur complète qui correspond à cet ID
      const couleurChoisie = toutesLesCouleurs.find(
        (couleur) => couleur.id === idDansLePanier,
      );

      if (couleurChoisie) {
        // --- CRÉATION DE L'AFFICHAGE (Un peu comme sur la page d'accueil) ---
        const article = document.createElement("div");
        article.classList.add("article-panier"); // On donne une classe propre

        // Je te laisse faire le design simple ici avec innerHTML pour changer un peu de createElement
        article.innerHTML = `
                    <span><strong>${couleurChoisie.nom}</strong></span>
                    <span>${couleurChoisie.prix} €</span>
                `;

        conteneur.appendChild(article);

        // --- CALCUL DU TOTAL ---
        montantTotal += couleurChoisie.prix;
      }
    });

    // 4. On met à jour le texte du prix total (avec 2 décimales)
    affichageTotal.textContent = montantTotal.toFixed(2);
  } catch (erreur) {
    console.error("Erreur lors du chargement du panier :", erreur);
  }
}

// On lance la fonction
afficherPanier();
