// js/gestionPanier.js

// Sauvegarde le panier dans le navigateur
function sauvegarderPanier(panier) {
  localStorage.setItem("panierCouleurs", JSON.stringify(panier));
}

// Récupère le panier (retourne un tableau)
function getPanier() {
  return JSON.parse(localStorage.getItem("panierCouleurs")) || [];
}

// Ajoute un article
function ajouterAuPanier(idCouleur) {
  let panier = getPanier();
  panier.push(idCouleur);
  sauvegarderPanier(panier);
}

// Calcule la taille du panier
function getNombreArticles() {
  let panier = getPanier();
  return panier.length;
}
