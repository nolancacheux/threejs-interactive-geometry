# TP 3 WebGL : Courbes B-splines avec WebG

## Groupe "Les Chèvres"

- Membres : 
    - Eudeline Nathan
    - Evain Sacha
    - Cacheux Nolan
    - Chiadmi Yassine

# Introduction 

Le TP3 s'est focalisé sur la construction de courbes de splines, en utilisant toujours ThreeJS. L'objectif était de pratiquer la théorie vue en classe sur ce nouveau type de courbes.

# Répartition des tâches

Comme lors des précédents TPs, nous avons travaillé séparémment durant la première séance afin de tous réflechir au sujet.

Pour le rendu final, Sacha et Nolan ont implémenté le calcul des courbes de bspline et des fonctions de base, tandis que Yassine et Nathan ont apporté les modifications nécessaires à l'interface, comme la modification du vecteur nodal ou du degré.

# Travail réalisé

Le demarrage était très similaire au TP précédent et ne sera donc pas détaillé dans ce compte-rendu.

Nous avons repris l'interface précédente,  l'initialisation de three js et la mise en place de la caméra ainsi que la gestion des points de contrôles.

Les nouveautés sont donc l'affichage des BSplines et des fonctions de base de spline, choisir le degré de la courbe, choisir un vecteur de noeud ou en prendre un de façon aléatoire.

# Calcul des courbes de BSpline

Seule la première méthode de calcul a été implémenté, en utilisant les fonctions de base. 

Pour déterminer les courbes de BSpline, nous avons défini une fonction évaluant la fonction de base $N_i^m(t)$ de façon récursive. En evaluant celle ci sur une intervalle de position (ce qui correspond au paramètre t) dépendant du vecteur de noeud choisi au préalable, nous construisons chaque point de la BSpline.


# Conclusion

Ce TP était plus léger à approcher car une partie du travail avait été réalisé précedemment. En revanche, la partie mathématique à propos du calcul des courbes de bézier était plus difficile que les exercices déjà vu jusqu'ici.