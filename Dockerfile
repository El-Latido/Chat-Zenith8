# ==========================================
# ETAPA 1: CONSTRUCCIÓN (Builder)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar solo los archivos de dependencias primero (mejora el cache de Docker)
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para compilar)
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Compilar el frontend y el backend
RUN npm run build

# ==========================================
# ETAPA 2: PRODUCCIÓN (Ligera y Segura)
# ==========================================
FROM node:20-alpine

# Configurar permisos para Hugging Face (requiere que la app corra con permisos seguros, no root)
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

# Ejecutar todo usando el usuario 'node' (uid 1000)
USER node

# Copiar solo las dependencias de PRODUCCIÓN (mucho más ligero)
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copiar los archivos compilados desde la etapa de builder
COPY --chown=node:node --from=builder /app/dist ./dist
# (Opcional) Si tu servidor necesita archivos estáticos de la carpeta public, descomenta la siguiente línea:
# COPY --chown=node:node --from=builder /app/public ./public

# Configurar variables de entorno y puerto de Hugging Face
ENV NODE_ENV=production
ENV PORT=7860
EXPOSE 7860

# Iniciar aplicación (ya no compila, solo ejecuta lo que se construyó)
CMD ["npm", "start"]
