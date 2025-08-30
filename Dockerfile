# Utiliser une image de base Node.js pour construire l'application Next.js
FROM node:22-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application Next.js
RUN npm run build

# Utiliser une image de base Node.js pour servir l'application
FROM node:22-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de build de Next.js
COPY --from=builder /app ./

# Installer les dépendances de production
RUN npm install --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port 3000
EXPOSE 3000

CMD ["npm", "start"]