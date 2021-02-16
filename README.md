# SID : utiliser la Tangle pour envoyer des messages

<img src="./sidApp/assets/logos/logo_colored_contour_resized.png" width="500">

SID est une application développée en **JavaScript**, via le framework bas-niveau [Node](https://nodejs.org/en/).

## Qu'est-ce que la Tangle?

La Tangle est un réseau décentralisé. Pour obtenir des informations sur son fonctionnement, rendez-vous sur le site d'[Iota](https://iota.org).

Iota est une **cryptomonnaie** qui utilise la Tangle pour effectuer les transactions. Nos messages sont envoyés via des **0 values Transactions**, soit des transactions de 0 Iotas.

## Contributeurs

Ce projet a été développé à [Télécom Paris](https://www.telecom-paris.fr/) dans le cadre du PAF (Projet d'Application Final). Initié par Paul Frambot, une équipe de sept étudiants s'est rapidement formée pour le réaliser. L'application a été développée en 13 jours, incluant le design, la connexion à la Tangle et la sécurisation des données pendant les communications.
>[Paul FRAMBOT](https://gitlab.telecom-paris.fr/paul.frambot), électron libre du projet  
>[Antoine Gicquel](https://gitlab.telecom-paris.fr/antoine.gicquel), Backend  
>[Julien THOMAS](https://gitlab.telecom-paris.fr/julien.thomas), Frontend  
>[Alexandre Fournier-Montgieux](https://gitlab.telecom-paris.fr/afournier), Backend  
>[Louis Farge](https://gitlab.telecom-paris.fr/louis.farge), Backend  
>[Octave Le Tullier](https://gitlab.telecom-paris.fr/octave.letullier), Frontend  
>[Alice Bouvier](https://gitlab.telecom-paris.fr/alice.bouvier), Frontend  

# SID : l'application mobile cross-platform

SID est une application mobile développé en React Native, qui permet de communiquer en passant par la Tangle. Elle est donc disponible pour Android et IOS.

## Installation de l'appli pour développement :

**Pré requis** : [Node.js](https://nodejs.org), [Expo](https://expo.io/), [Git](https://git-scm.com/)
### Installation :
>`cd paf-tangle-2020/sidApp`  
>`yarn install`  
>`expo start`  

### Sécurité :

Toutes les données envoyées via l'application sont chiffrées avant d'être envoyées sur la Tangle. Seuls l'expéditeur et le destinataire peuvent lire les messages envoyés. Cela offre aux utilisateurs une garantie de sécurité et de confidentialité à propos de leurs données personnelles.
Tu souhaites lire des données qui ne t'appartiennent pas sur la Tangle ? Toute l'équipe te souhaite bon courage, **même Chuck Norris n'y est pas parvenu !**

# SID : l'application DESKTOP cross-platform

L'application desktop est également développée en **JavaScript et Nodejs**, grâce au framework [electronjs](https://www.electronjs.org/) utilisant du **JavaScript, CSS et HTML** qui permet de produire une application compatible pour chaque OS.

L'app Desktop est actuellement en **Work in Progress** et sera disponible prochainement.
