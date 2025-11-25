# ValidaCheck

**ValidaCheck** é uma plataforma web desenvolvida para facilitar a gestão, submissão e validação de atividades complementares e relatórios académicos em instituições de ensino superior. O sistema permite que estudantes submetam as suas horas extracurriculares e que secretários ou coordenadores validem esses pedidos de forma eficiente.

## 📋 Funcionalidades

### Para Estudantes
* **Dashboard de Progresso:** Visualização gráfica das horas computadas versus a carga horária mínima exigida.
* **Submissão de Atividades:** Envio de certificados e documentos comprobatórios com categorização (Ensino, Pesquisa, Extensão, etc.).
* **Envio de Relatórios:** Submissão de relatórios finais para atividades já aprovadas.
* **Acompanhamento de Status:** Monitorização em tempo real do estado das submissões (Enviado, Em análise, Aprovado, Indeferido, Complementação solicitada).
* **Histórico e Notificações:** Registo detalhado de alterações e notificações sobre decisões ou pedidos de correção.

### Para Secretarias / Validadores
* **Fila de Análise:** Visualização centralizada de atividades e relatórios pendentes.
* **Ferramentas de Decisão:** Aprovação (total ou parcial com ajuste de horas), indeferimento com justificativa ou solicitação de complementação (checklist).
* **Gestão de Categorias:** Configuração de limites de horas e obrigatoriedade por categoria de atividade.
* **Auditoria:** Logs de ações realizadas no sistema.

## 🛠️ Tecnologias Utilizadas

### Backend
* **Linguagem:** Python 3
* **Framework:** Django 5.1
* **API:** Django Rest Framework (DRF)
* **Autenticação:** JWT (SimpleJWT) & Social Auth (Google/GitHub)
* **Base de Dados:** SQLite (Padrão de desenvolvimento)
* **Testes:** Pytest & Behave (BDD)
* **Documentação API:** Drf-spectacular (Swagger/Redoc)

### Frontend
* **Framework:** Next.js 15 (React)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS
* **Componentes:** HeroUI & Lucide React (Ícones)
* **Cliente HTTP:** Axios

## 🚀 Pré-requisitos

Antes de começar, certifica-te de que tens instalado na tua máquina:
* [Python](https://www.python.org/) (v3.10 ou superior)
* [Node.js](https://nodejs.org/) (v18 ou superior)
* [Git](https://git-scm.com/)

## 🔧 Instalação e Configuração

O projeto está dividido em duas pastas principais: `backend` e `frontend`.

### 1. Configurar o Backend (Django)

1.  Navega até à pasta do backend:
    ```bash
    cd backend/valida
    ```

2.  Cria um ambiente virtual e ativa-o:
    ```bash
    # Windows
    python -m venv venv
    venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  Instala as dependências:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configura as variáveis de ambiente:
    * Cria um ficheiro `.env` na pasta `backend/valida/` (ao lado de `settings.py`).
    * Define as variáveis necessárias (ex: `SECRET_KEY`, `DEBUG=True`, configurações de Email e OAuth se necessário).

5.  Executa as migrações da base de dados:
    ```bash
    python manage.py migrate
    ```

    *Opcional: Criar categorias iniciais (se houver migração de dados)*
    ```bash
    # A migração 0006_add_initial_categories.py já deve ter corrido automaticamente
    ```

6.  Cria um superutilizador (opcional, para acesso ao Django Admin):
    ```bash
    python manage.py createsuperuser
    ```

7.  Inicia o servidor de desenvolvimento:
    ```bash
    python manage.py runserver
    ```
    O backend estará disponível em `http://127.0.0.1:8000`.

### 2. Configurar o Frontend (Next.js)

1.  Abre um novo terminal e navega até à pasta do frontend:
    ```bash
    cd frontend
    ```

2.  Instala as dependências:
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  Inicia o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    O frontend estará disponível em `http://localhost:3000`.

## 🧪 Testes

### Testes Backend
O projeto utiliza `pytest` para testes unitários e `behave` para testes de comportamento (BDD).

Para correr os testes de comportamento (features):

```bash
cd backend/valida
behave
```

## 📂 Estrutura do Projeto

```text
ValidaCheck/
├── backend/
│   └── valida/
│       ├── activities/      # Lógica de atividades, categorias e relatórios
│       ├── users/           # Gestão de utilizadores e autenticação
│       ├── valida/          # Configurações do projeto Django (settings, urls)
│       ├── features/        # Testes BDD (Gherkin)
│       ├── media/           # Uploads de ficheiros (ambiente dev)
│       └── manage.py
│
└── frontend/
    ├── src/
    │   ├── app/             # Rotas e páginas (Next.js App Router)
    │   ├── components/      # Componentes reutilizáveis (NavBar, Header, etc.)
    │   ├── services/        # Serviços de API (Auth, Axios config)
    │   └── hooks/           # Custom hooks (ex: useNotificacoes)
    ├── public/              # Assets estáticos
    └── package.json

📄 Licença
Este projeto é de código aberto. Consulte o ficheiro LICENSE (se disponível) para mais detalhes.

Desenvolvido por Guilherme Medeiros, Hilário Lélis e João Vitor Macêdo
