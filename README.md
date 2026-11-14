# UserManager Pro | Full-Stack CRUD Application



[🇺🇸 English Version](#-english-version) • [🇧🇷 Versão em Português](#-versão-em-português)



---



## 🇧🇷 Versão em Português



Aplicação web **Full-Stack** para gerenciamento completo de usuários (CRUD), desenvolvida com **Java 21 + Spring Boot** no back-end, banco de dados relacional **PostgreSQL (Supabase)** e interface responsiva bilíngue em **HTML5, CSS3 e JavaScript puro (Vanilla JS)** no front-end.



### 🔗 Links em Produção (Live Demo)

* **Aplicação Web (Front-end):** [https://usermanager-fullstack-app.onrender.com](https://usermanager-fullstack-app.onrender.com)

* **API REST (Back-end):** [https://usermanager-fullstack.onrender.com/usuario](https://usermanager-fullstack.onrender.com/usuario)



*(Nota: Como o back-end está hospedado no plano gratuito do Render, a primeira requisição após 15 minutos de inatividade pode levar ~40 segundos para despertar o container Docker).*



---



### ✨ Funcionalidades Principais

* **CRUD Completo:** Criação, listagem, busca dinâmica em tempo real, edição e exclusão de usuários com persistência relacional.

* **Relacionamentos JPA:** Modelagem com `@OneToMany` e `CascadeType.ALL` vinculando cada usuário aos seus respectivos endereços e telefones.

* **Integração com API Externa (ViaCEP):** Autopreenchimento automático de logradouro, cidade e estado (UF) ao digitar o CEP.

* **Validação e Máscaras Inteligentes:** Formatação automática em tempo real para DDD `(21)`, telefone `99999-8888`, CEP `21000-000` e UF, com sanitização de dados antes do envio à API.

* **Internacionalização (i18n):** Alternância instantânea de idioma entre **Português (PT)** e **Inglês (EN)** com persistência via `LocalStorage`.

* **Monitoramento de Status da API:** Indicador visual em tempo real no cabeçalho exibindo o estado da conexão com o servidor.



---



### 🛠️ Tecnologias Utilizadas



| Camada | Tecnologias |

| :--- | :--- |

| **Back-end** | Java 21, Spring Boot, Spring Web, Spring Data JPA, Hibernate, Lombok, Maven |

| **Banco de Dados** | PostgreSQL (hospedado no Supabase via Session Pooler) |

| **Front-end** | HTML5, CSS3 (Grid/Flexbox responsivo), JavaScript ES6+ (Fetch API, LocalStorage) |

| **DevOps & Deploy** | Docker, Git/GitHub, Render (Web Service + Static Site) |



---



### 🏗️ Arquitetura do Projeto



```text

usermanager-fullstack/

├── backend/                  # API RESTful em Spring Boot + Dockerfile

│   ├── src/main/java/        # Controllers, Services, Repositories e Models (JPA)

│   ├── src/main/resources/   # Configurações via variáveis de ambiente

│   ├── Dockerfile            # Build multi-stage com Maven + Eclipse Temurin 21

│   └── pom.xml               # Dependências do projeto

└── frontend/                 # Interface Web Estática

    ├── index.html            # Estrutura semântica e formulário

    ├── style.css             # Estilização Dark UI responsiva

    └── script.js             # Consumo da API REST, máscaras, ViaCEP e i18n

```



---



### 🔌 Endpoints da API REST



| Método | Rota | Descrição |

| :--- | :--- | :--- |

| `GET` | `/usuario` | Lista todos os usuários cadastrados com endereços e telefones |

| `POST` | `/usuario` | Cadastra um novo usuário no banco de dados |

| `PUT` | `/usuario/{id}` | Atualiza os dados de um usuário existente |

| `DELETE` | `/usuario/{id}` | Remove um usuário e seus vínculos por ID |



---



### 🚀 Como Executar Localmente



#### Pré-requisitos

* Java 21+ e Maven instalados

* Uma instância PostgreSQL ativa (local ou Supabase)



#### 1. Configurar e rodar o Back-end

```bash

cd backend



# Defina as variáveis de ambiente do seu banco PostgreSQL:

export DB_URL="jdbc:postgresql://SEU_HOST:5432/postgres"

export DB_USER="SEU_USUARIO"

export DB_PASSWORD="SUA_SENHA"



# Execute a aplicação Spring Boot

./mvnw spring-boot:run

```

A API estará disponível em `http://localhost:8080/usuario`.



#### 2. Rodar o Front-end

Basta abrir o arquivo `frontend/index.html` no navegador (ou via extensão **Live Server** no VS Code). O `script.js` detecta automaticamente o ambiente `localhost` e aponta para a API local.



---



## 🇺🇸 English Version



A **Full-Stack** web application for complete user management (CRUD), built with **Java 21 + Spring Boot** on the back-end, a **PostgreSQL (Supabase)** relational database, and a responsive bilingual interface built with **HTML5, CSS3, and Vanilla JavaScript** on the front-end.



### 🔗 Live Demo Links

* **Web Application (Front-end):** [https://usermanager-fullstack-app.onrender.com](https://usermanager-fullstack-app.onrender.com)

* **REST API (Back-end):** [https://usermanager-fullstack.onrender.com/usuario](https://usermanager-fullstack.onrender.com/usuario)



*(Note: Since the back-end runs on Render's free tier, the first request after 15 minutes of inactivity may take ~40 seconds to wake up the Docker container).*



---



### ✨ Key Features

* **Complete CRUD Operations:** Create, read, real-time filter/search, update, and delete users with relational persistence.

* **JPA Entity Relationships:** `@OneToMany` mappings with `CascadeType.ALL` linking each user to their addresses and phone numbers.

* **External API Integration (ViaCEP):** Automatic street, city, and state lookup upon entering a Brazilian postal code (CEP).

* **Input Masking & Sanitization:** Real-time input formatting for area codes `(21)`, phone numbers `99999-8888`, postal codes `21000-000`, and state codes, cleaning data before API submission.

* **Internationalization (i18n):** Instant language switching between **English (EN)** and **Portuguese (PT)** persisted via `LocalStorage`.

* **Live API Health Indicator:** Real-time status badge in the top bar displaying server connection state.



---



### 🛠️ Tech Stack



| Layer | Technologies |

| :--- | :--- |

| **Back-end** | Java 21, Spring Boot, Spring Web, Spring Data JPA, Hibernate, Lombok, Maven |

| **Database** | PostgreSQL (hosted on Supabase via Session Pooler) |

| **Front-end** | HTML5, CSS3 (Responsive Grid/Flexbox), JavaScript ES6+ (Fetch API, LocalStorage) |

| **DevOps & Cloud** | Docker, Git/GitHub, Render (Web Service + Static Site) |



---



### 🚀 Running Locally



#### 1. Back-end Setup

```bash

cd backend



export DB_URL="jdbc:postgresql://YOUR_HOST:5432/postgres"

export DB_USER="YOUR_USER"

export DB_PASSWORD="YOUR_PASSWORD"



./mvnw spring-boot:run

```



#### 2. Front-end Setup

Open `frontend/index.html` directly in your browser or serve it using **VS Code Live Server**. The application automatically detects `localhost` and connects to `http://localhost:8080/usuario`.



---



### 👨‍💻 Author / Autor

**Luiz Felipe Andrade**  

[GitHub](https://github.com/luizfelipeandrade)
