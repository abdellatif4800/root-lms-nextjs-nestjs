# 📚 Root LMS — NestJS + GraphQL

A **Learning Management System (LMS)** backend API built with [NestJS](https://nestjs.com/) and [GraphQL](https://graphql.org/), written in TypeScript. Deployed on [Vercel](https://vercel-nest-gql-lms.vercel.app).

---

## 🚀 Tech Stack

| Layer           | Technology                    |
| --------------- | ----------------------------- |
| Framework       | [NestJS](https://nestjs.com/) |
| API Layer       | GraphQL (Code-First)          |
| Language        | TypeScript                    |
| Package Manager | pnpm                          |
| Linting         | ESLint + Prettier             |
| Deployment      | Vercel                        |

---

## ✨ Features

- GraphQL API with auto-generated schema (`schema.gql`)
- Modular NestJS architecture for scalability
- Code-first GraphQL approach using decorators
- Full TypeScript support with strict configuration
- ESLint + Prettier for consistent code style

---

## 📁 Project Structure

```
root-lms-nest-graphql/
├── src/                    # Application source code
│   ├── modules/            # Feature modules (courses, users, etc.)
│   ├── app.module.ts       # Root application module
│   └── main.ts             # Application entry point
├── schema.gql              # Auto-generated GraphQL schema
├── nest-cli.json           # NestJS CLI configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.build.json     # TypeScript build configuration
├── eslint.config.mjs       # ESLint configuration
├── .prettierrc             # Prettier configuration
└── package.json            # Project dependencies and scripts
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/) package manager

```bash
npm install -g pnpm
```

### Installation

```bash
# Clone the repository
git clone https://github.com/abdellatif4800/root-lms-nest-graphql.git

# Navigate into the project
cd root-lms-nest-graphql

# Install dependencies
pnpm install
```

---

## ▶️ Running the Application

```bash
# Development mode
pnpm run start

# Watch mode (auto-restart on changes)
pnpm run start:dev

# Production mode
pnpm run start:prod
```

Once running, the GraphQL Playground is available at:

```
http://localhost:3000/graphql
```

---

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# End-to-end tests
pnpm run test:e2e

# Test coverage report
pnpm run test:cov
```

---

## 🌐 Deployment

This project is deployed on **Vercel**. You can view the live API here:

👉 [https://vercel-nest-gql-lms.vercel.app](https://vercel-nest-gql-lms.vercel.app)

To deploy manually with the NestJS Mau platform:

```bash
pnpm install -g @nestjs/mau
mau deploy
```

For more deployment options, refer to the [NestJS deployment docs](https://docs.nestjs.com/deployment).

---

## 📖 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [GraphQL Docs](https://graphql.org/learn/)
- [NestJS GraphQL Guide](https://docs.nestjs.com/graphql/quick-start)

---

## 📄 License

This project is [MIT licensed](LICENSE).

---

## 👤 Author

**Abdellatif**  
GitHub: [@abdellatif4800](https://github.com/abdellatif4800)
