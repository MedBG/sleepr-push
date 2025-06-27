# Étape 1 : Construction de l'application
FROM node:alpine AS development

WORKDIR /usr/src/app

# Copie des fichiers de dépendances
COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.json
# COPY nest-cli.json nest-cli.json

# Installation des dépendances
RUN npm ci

# Copie du reste du code
COPY apps/auth apps/auth
COPY libs libs
#  RUN npm install -r
# Construction de l'application
RUN npm run build

# Étape 2 : Image de production
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app



# Copie des fichiers de dépendances
COPY package.json package-lock.json ./

# Installation des dépendances de production uniquement
RUN npm ci --only=production

# Copie des fichiers construits depuis l'étape de développement
COPY --from=development /usr/src/app/dist ./dist

# Commande de démarrage
CMD ["node", "dist/apps/auth/main"]