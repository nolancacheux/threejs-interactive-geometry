# TP 4 WebGL : Noël en WebGL et B-splines

## Groupe "Les Chèvres"

- Membres :
  - Eudeline Nathan
  - Evain Sacha
  - Cacheux Nolan
  - Chiadmi Yassine

## Introduction

Le TP4 fut avant tout l'adaptation de notre implentation pour fonctionner dans un environnement 3D et l'ajout d'un system de save et load pour les courbes de bézier.

## Travail réalisé

Nous avons récupéré le code du TP3, et avons commencé par l'adapter pour qu'il fonctionne en 3D. Pour cela, nous avons ajouté une dimension à tous les vecteurs utilisés, puis des controles pour la caméra.

Pour la pose des points, nous avons utilisé un système de raycasting, qui permet de récupérer la position de la souris dans l'espace 3D. Nous avons ensuite utilisé cette position pour placer les points sur le plan de la caméra.

Nous avons ensuite ajouté un système de sauvegarde et de chargement des courbes de bézier. Pour cela, nous avons utilisé le format JSON, qui permet de sauvegarder des objets javascript. Nous avons donc sauvegardé les points de contrôle, le vecteur nodal et le degré de la courbe.

## Esprit de noël

Nous avons ensuite ajouté un sapin de noël, qui est composé de 3 cônes de tailles différentes. ![sapin](https://cdn.discordapp.com/attachments/1156579943602471003/1193258076753637568/image.png?ex=65ac0f2f&is=65999a2f&hm=cac66582aba2472c5549705830613309649322830a13f6df64817ca18d9472e9&)

Puis la realisation d'un script python pour générer les points d'une guirlance de noël. ![guirlance](https://cdn.discordapp.com/attachments/1156579943602471003/1193576823989207080/image.png?ex=65ad380a&is=659ac30a&hm=d0948e971e9dc631e9ff315fbc076c8ca2c3caa1e0e2cf7ffca3f03554fbec13&)

## Repartition du travail

- Eudeline Nathan : Génération de la guirlance de noël
- Evain Sacha : Passage en 3D
- Cacheux Nolan : Sauvegarde et chargement des courbes de bézier
- Chiadmi Yassine : Sapin de noël

## Conclusion

Ce TP nous à fais aborder d'autre notions de WebGL, comme le raycasting, et nous à permis de nous familiariser avec la 3D. Nous avons aussi pu nous familiariser avec le format JSON, qui est très pratique pour sauvegarder des objets javascript, et l'utilisations d'un autre langage pour générer des points.
