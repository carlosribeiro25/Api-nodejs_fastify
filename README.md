# API de Cursos - Node.js com Fastify

Uma API RESTful robusta para gerenciamento de cursos, construída com **Fastify**, **TypeScript**, **Drizzle ORM** e **PostgreSQL**.

## 📋 Sobre o Projeto

Esta aplicação fornece endpoints para criar, ler, atualizar e deletar cursos. Inclui validação de dados com **Zod**, integração com banco de dados PostgreSQL e documentação automática com **Swagger/OpenAPI**.

## 📊 Fluxo da Aplicação

```mermaid
flowchart TD
    A[Cliente/Navegador] -->|HTTP Request| B[Fastify Server]
    B -->|Valida com Zod| C{Dados Válidos?}
    C -->|Não| D[Retorna 400 Bad Request]
    C -->|Sim| E{Operação?}
    E -->|POST /courses| F[Cria Novo Curso]
    E -->|GET /courses| G[Lista Todos os Cursos]
    E -->|GET /courses/:id| H[Busca Curso por ID]
    E -->|PUT /courses/:id| I[Atualiza Curso]
    E -->|DELETE /courses/:id| J[Deleta Curso]
    F -->|Insert| K[(PostgreSQL)]
    G -->|Select| K
    H -->|Select WHERE| K
    I -->|Update WHERE| K
    J -->|Delete WHERE| K
    K -->|Retorna Dados| L[Drizzle ORM]
    L -->|Transforma| M[Serializa Resposta]
    M -->|JSON| N[Cliente Recebe Resposta]
    D --> N
    F -->|Sucesso 201| N
    G -->|Sucesso 200| N
    H -->|Sucesso 200| N
    I -->|Sucesso 200| N
    J -->|Sucesso 200| N
    K -.->|Erro| O[Retorna 500 Error]
    O --> N
```

**Fluxo Principal:**
1. Cliente envia requisição HTTP para o servidor Fastify
2. Zod valida os dados da requisição
3. Se inválido, retorna erro 400
4. Se válido, executa a operação correspondente (CRUD)
5. Drizzle ORM interage com o PostgreSQL
6. Resultado é serializado e retornado ao cliente
7. Em caso de erro no banco, retorna 500

## 🛠️ Tecnologias Utilizadas

- **Fastify** - Framework web rápido e eficiente
- **TypeScript** - Tipagem estática para JavaScript
- **Drizzle ORM** - ORM type-safe para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de schemas
- **Docker** - Containerização
- **Pino** - Logger estruturado

## 📦 Pré-requisitos

- Node.js v18+ instalado
- Docker e Docker Compose instalados
- npm ou yarn

## 🚀 Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/carlosribeiro25/Api-nodejs_fastify.git
cd API-nodeJS
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/courses_db
NODE_ENV=development
```

### 4. Iniciar o Banco de Dados

```bash
docker compose up -d
```

### 5. Executar Migrações

```bash
npm run db:push
```

### 6. Iniciar o Servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor em modo desenvolvimento
npm run build        # Compila o TypeScript
npm run start        # Inicia o servidor em produção
npm run db:studio    # Abre o Drizzle Studio para gerenciar o banco
npm run db:generate  # Gera novas migrações
npm run db:push      # Aplica as migrações ao banco
```

## 🔌 Endpoints da API

### Listar todos os cursos

```http
GET /courses
```

**Resposta (200):**
```json
{
  "courses": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Introdução ao Node.js",
      "description": "Aprenda os fundamentos do Node.js"
    }
  ]
}
```

### Obter um curso por ID

```http
GET /courses/:id
```

**Parâmetros:**
- `id` (UUID) - ID do curso

**Resposta (200):**
```json
{
  "course": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Introdução ao Node.js",
    "description": "Aprenda os fundamentos do Node.js"
  }
}
```

**Resposta (404):**
```json
{
  "error": "Curso não encontrado"
}
```

### Criar um novo curso

```http
POST /courses
Content-Type: application/json

{
  "title": "Introdução ao Node.js",
  "description": "Aprenda os fundamentos do Node.js e crie aplicações de back-end"
}
```

**Validações:**
- `title`: mínimo 5 caracteres
- `description`: mínimo 10 caracteres

**Resposta (201):**
```json
{
  "courseId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Resposta (500):**
```json
{
  "error": "Falha ao criar o curso"
}
```

### Atualizar um curso

```http
PUT /courses/:id
Content-Type: application/json

{
  "title": "Node.js Avançado",
  "description": "Aprenda tópicos avançados do Node.js e desenvolvimento de APIs"
}
```

**Parâmetros:**
- `id` (UUID) - ID do curso

**Validações:**
- `title`: mínimo 5 caracteres
- `description`: mínimo 10 caracteres

**Resposta (200):**
```json
{
  "message": "Curso atualizado com sucesso",
  "course": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Node.js Avançado",
    "description": "Aprenda tópicos avançados do Node.js e desenvolvimento de APIs"
  }
}
```

**Resposta (404):**
```json
{
  "error": "Curso não encontrado"
}
```

### Deletar um curso

```http
DELETE /courses/:id
```

**Parâmetros:**
- `id` (UUID) - ID do curso

**Resposta (200):**
```json
{
  "courseId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Resposta (404):**
```json
{
  "error": "Curso não encontrado"
}
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: courses

| Coluna | Tipo | Restrições |
|--------|------|-----------|
| id | UUID | PRIMARY KEY, DEFAULT (random) |
| title | TEXT | NOT NULL, UNIQUE, LENGTH >= 5 |
| description | TEXT | LENGTH >= 10 |

### Tabela: users

| Coluna | Tipo | Restrições |
|--------|------|-----------|
| id | UUID | PRIMARY KEY, DEFAULT (random) |
| name | TEXT | NOT NULL |
| email | TEXT | NOT NULL, UNIQUE |

## 🧪 Testando a API

### Com cURL

```bash
# Criar um curso
curl -X POST http://localhost:3333/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Meu Curso","description":"Descrição do meu curso"}'

# Listar todos os cursos
curl http://localhost:3333/courses

# Obter um curso específico
curl http://localhost:3333/courses/550e8400-e29b-41d4-a716-446655440000

# Atualizar um curso
curl -X PUT http://localhost:3333/courses/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"title":"Curso Atualizado","description":"Nova descrição"}'

# Deletar um curso
curl -X DELETE http://localhost:3333/courses/550e8400-e29b-41d4-a716-446655440000
```

### Com Insomnia/Postman

Importe os exemplos de requisições do arquivo `requisicoes.http`

## 📁 Estrutura do Projeto

```
API-nodeJS/
├── src/
│   ├── database/
│   │   ├── cliente.ts          # Configuração do cliente Drizzle
│   │   ├── schema.ts           # Definição das tabelas
│   │   └── routes/             # Rotas organizadas por funcionalidade
│   │       ├── create-courses.ts
│   │       ├── get-courses.ts
│   │       ├── get-coursesById.ts
│   │       ├── update-courses.ts
│   │       └── delete-courses.ts
├── drizzle/                    # Migrações do banco de dados
├── server.ts                   # Configuração principal do Fastify
├── tsconfig.json               # Configuração do TypeScript
├── drizzle.config.ts           # Configuração do Drizzle ORM
├── docker-compose.yml          # Configuração do Docker
├── package.json
└── README.md
```

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão com PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `NODE_ENV` | Ambiente de execução | `development` ou `production` |

## 🔒 Validação de Dados

A API utiliza **Zod** para validar todos os inputs:

- **Título**: string com mínimo 5 caracteres
- **Descrição**: string com mínimo 10 caracteres
- **ID**: UUID válido

Erros de validação retornam status `400` com mensagens descritivas.

## 🐛 Tratamento de Erros

A API retorna os seguintes status HTTP:

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Dados inválidos
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro no servidor

## 📚 Logs

A aplicação utiliza **Pino** para logging estruturado. Os logs incluem:

- Requisições HTTP
- Erros de banco de dados
- Eventos de aplicação

Configure o nível de log em `server.ts`:

```typescript
const server = fastify({
    logger: {
        level: 'info', // 'debug', 'info', 'warn', 'error'
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
})
```

## 🚢 Deployment

### Com Docker

```bash
docker build -t api-courses .
docker run -p 3333:3333 --env-file .env api-courses
```

### Em Produção

```bash
npm run build
npm run start
```

## 📞 Suporte

Para dúvidas ou problemas, abra uma **issue** no repositório.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Carlos Ribeiro**  
GitHub: [@carlosribeiro25](https://github.com/carlosribeiro25)

---

**Desenvolvido com ❤️ usando Fastify e TypeScript**
