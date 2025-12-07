# ----------------------------------------------------
# 1. BUILDER STAGE: Instala dependências e compila
# ----------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copia package.json e package-lock.json para instalação de dependências
COPY package*.json ./

# Instala todas as dependências (dev e prod)
RUN npm ci

# Copia o restante do código
COPY . .

# Executa o script de build para compilar TS para JS
RUN npm run build

# ----------------------------------------------------
# 2. PRODUCTION STAGE: Imagem final, mais leve e segura
# ----------------------------------------------------
FROM node:22-alpine AS production

# Define a porta que será usada (3333, conforme seu código)
EXPOSE 8080

WORKDIR /app

# Copia apenas as dependências de produção do builder
COPY --from=builder /app/node_modules ./node_modules

# Copia o código JS COMPILADO da pasta de output (ex: dist)
COPY --from=builder /app/dist ./dist

# Garante que a porta 8080 seja a porta padrão de fallback
# O seu código usa a porta 3333 (EXPOSE 3333), vamos manter essa para o exemplo
# Se o ambiente de deploy exigir 8080, mude a porta aqui e no seu código.
ENV PORT=8080

# Comando para iniciar o servidor JS compilado
# Deve apontar para o arquivo .js de saída (ex: dist/server.js)
CMD ["node", "dist/server.js"]