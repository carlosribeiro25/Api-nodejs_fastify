FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

# instalar dependências de dev (precisa para tsc)
RUN npm install

COPY . .

# gerar o dist
RUN npm run build

# -----------------------------
# Imagem final — somente produção
# -----------------------------
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./

# instalar só dependências de produção
RUN npm install --only=production

# copiar build compilado
COPY --from=builder /app/dist ./dist

EXPOSE 3333

CMD ["node", "dist/server.js"]
