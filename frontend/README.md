# 📂 Estrutura do Projeto Frontend (Angular 17+)

Este frontend segue uma **arquitetura modular e escalável**, organizada por **features** e camadas de responsabilidade.  
O objetivo é facilitar **manutenção**, **evolução** e **colaboração** no desenvolvimento.

---

## 🌳 Estrutura de Pastas


---

## 📦 Descrição dos Módulos

### **core/**
Contém tudo que é **global e transversal** ao sistema.  
- **layout/** → Shell do app (header, sidebar, footer), serviços de navegação/layout.  
- **auth/** → Autenticação e autorização: `AuthService`, guards, interceptors.  
- **http/** → Interceptores e tratamento de erros HTTP.  
- **config/** → Configuração global, inicializadores (`appInitializer`).  
- **tokens.ts** → **Injection Tokens** para configuração injetável (ex.: `API_BASE_URL`, feature flags).  

👉 Regra: entra aqui apenas o que é usado **em várias features**.

---

### **environments/**
Configurações por ambiente (`development`, `production`).  
Normalmente contém chaves como `apiBaseUrl`.  
Esses valores são injetados via `tokens.ts`.

---

### **shared/**
Componentes e utilidades **genéricos e reutilizáveis**.  
- **ui/** → Botões, tabelas genéricas, modais, inputs (presentational components).  
- **pipes/** e **directives/** → Extensões de template.  
- **utils/** → Funções puras (helpers de data, currency, arrays).  

👉 Nunca deve conhecer regra de negócio específica (ex.: `Task`, `Hour`).

---

### **features/**
Organização por **domínio do sistema** (feature-first).  
Cada feature segue a mesma estrutura interna:

- **feature/** → Containers (componentes inteligentes/roteáveis). Orquestram estado, navegação e chamam stores/services.  
- **ui/** → Componentes **burros** (presentational). Apenas exibem dados recebidos (`@Input`) e emitem eventos (`@Output`).  
- **data-access/** → Serviços de comunicação com a API (`*.client.ts`), adapters e modelos de domínio.  
- **state/** → Stores baseados em **signals** para gerenciar estado, cache e ações da feature.  
- **routes.ts** → Roteamento lazy da feature.  

👉 Exemplo: `features/tasks` contém tudo necessário para gerenciamento de tarefas, isolado das demais áreas.

---

### **Arquivos de Configuração**

- **app.component.ts** → Componente raiz. Geralmente apenas delega ao layout global.  
- **app.routes.ts** → Rotas principais do app, carregando cada feature de forma **lazy**.  
- **app.config.ts** → Configuração da aplicação (`ApplicationConfig`): rotas, interceptors, providers globais.

---

## 🧭 Fluxo de Responsabilidade


- **Page/Container (`feature/`)** → ponto de entrada da feature, roteável.  
- **UI (`ui/`)** → apresentação e interação visual, sem lógica de negócio.  
- **State (`state/`)** → concentra estado e chamadas ao service.  
- **Data-access (`data-access/`)** → lida com API, DTOs e modelos.  
- **Core/Shared** → fornecem utilidades globais e independentes de domínio.

---

## 🚀 Benefícios da Estrutura

- **Escalabilidade** → cada feature é isolada, facilitando manutenção e evolução.  
- **Organização clara** → cada pasta tem um papel definido.  
- **Reuso** → `shared/` centraliza utilidades genéricas.  
- **Flexibilidade** → fácil criar/alterar features sem quebrar o resto.  
- **Boas práticas Angular 17** → uso de standalone components, signals e DI tokens.

---

✨ Essa organização garante que o frontend possa crescer de forma sustentável, mantendo o código **modular, testável e fácil de navegar**.
