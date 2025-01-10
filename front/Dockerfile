# Utiliser une image officielle Node.js
FROM node:22-alpine

# Définir le répertoire de travail
WORKDIR /home/node/app

#
## Copier uniquement les fichiers nécessaires pour installer les dépendances
#COPY package*.json ./
#
## Installer les dépendances dans un répertoire monté en volume
#RUN npm install
#
## Copier le reste des fichiers de l'application
#COPY . .
#
#  # Construire l'application Vue.js
#RUN npm run build
#
## Exposer le port du serveur de développement
EXPOSE 5173

# Lancer le serveur de développement
CMD ["/bin/sh", "./front.sh", "--", "--host", "0.0.0.0"]