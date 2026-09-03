# Ghosty Web — Cadastro e Consulta de Pessoas

Projeto **PJBL de Cloud**: frontend em **React** que se comunica com **Azure Functions** servindo um
**mock backend**, publicado no **Azure Static Web Apps**.

> 👥 Integrantes do grupo: veja [GRUPO.md](GRUPO.md)
> 🤖 Prompt de IA Generativa utilizado: veja [Prompt.md](Prompt.md)

---

## 🌐 Endereços do projeto

| O quê | Endereço |
| --- | --- |
| **Site no Azure Static Web Apps** | `https://SUBSTITUIR-PELA-URL.azurestaticapps.net` |
| API (Azure Functions, mesmo domínio) | `https://SUBSTITUIR-PELA-URL.azurestaticapps.net/api` |
| Endpoint GET com dados mock | `https://SUBSTITUIR-PELA-URL.azurestaticapps.net/api/pessoas` |
| Mock do Apidog — lista *(opcional)* | `https://SUBSTITUIR-PELO-MOCK.apidog.io/pessoas` |
| Mock do Apidog — pessoa específica *(opcional)* | `https://SUBSTITUIR-PELO-MOCK.apidog.io/pessoas/{id}` |

> ⚠️ **Preencha as três primeiras linhas** depois de concluir o passo 6 do guia de publicação. O
> Azure gera a URL automaticamente, no formato `https://<nome>.<região>.azurestaticapps.net`.
> As duas últimas só se o grupo optar por criar o Cloud Mock no Apidog.

---

## 📦 Não há banco de dados

Todos os dados vêm do **mock backend embutido na Azure Function**
([backend/src/lib/mock.js](backend/src/lib/mock.js)): 10 pessoas de exemplo, cada uma com apenas
`id` e `nome`.

Consequências práticas:

- **Não é preciso configurar nada** para publicar — sem connection string, sem chave de API,
  sem variável de ambiente obrigatória.
- Os cadastros feitos na tela ficam na **memória da instância da Function** e desaparecem quando ela
  reinicia. É o comportamento esperado de um mock backend, e a própria tela avisa isso.
- Opcionalmente, a lista base pode vir do **Cloud Mock do Apidog** em vez do mock local — basta
  definir a variável `mock_api_url` (veja a seção [Mock com Apidog](#-mock-com-apidog)).

Isso atende ao enunciado do PJBL, que pede um *frontend comunicando com Azure Functions e mock
backend*, com pelo menos um endpoint **GET** servindo **dados mock**.

---

## 🧭 Telas do sistema

O PJBL exige no mínimo duas telas — o projeto entrega **três**:

| Tela | Rota | O que faz | Endpoint consumido |
| --- | --- | --- | --- |
| **Todas as pessoas** | `/pessoas` | Lista todos os registros | `GET /api/pessoas` |
| **Buscar pessoa** | `/buscar` | Busca uma pessoa específica por ID ou por nome | `GET /api/pessoas/{id}` e `GET /api/pessoas?nome=` |
| **Cadastrar** | `/cadastro` | Formulário de cadastro de pessoa | `POST /api/pessoas` |

---

## 🏗️ Arquitetura

```
Navegador (React + Vite)
        │
        │  fetch /api/...            mesmo domínio: sem CORS
        ▼
Azure Static Web Apps  ──►  Azure Functions (Node.js v4, pasta backend/)
                                   │
                                   └──► Mock backend
                                        (lista local embutida, ou Apidog se configurado)
```

O Static Web Apps hospeda o site estático **e** as Functions no mesmo domínio: tudo que chega em
`/api/*` é roteado para o backend, então o frontend nunca precisa saber a URL da API.

### Estrutura de pastas

```
.
├── frontend/                     React + Vite
│   └── src/
│       ├── api.js                cliente HTTP das Azure Functions
│       ├── App.jsx               layout e rotas
│       ├── components/           Aviso, TabelaPessoas
│       └── pages/                Lista, Busca, Cadastro
├── backend/                      Azure Functions (Node.js v4)
│   ├── host.json
│   ├── package.json
│   └── src/
│       ├── functions/            pessoas.js, health.js
│       └── lib/                  config.js, mock.js, http.js
├── mock/apidog-pessoas.openapi.json    importar no Apidog (opcional)
├── .github/workflows/                  deploy automático
├── staticwebapp.config.json
├── GRUPO.md
├── Prompt.md
└── README.md
```

---

## 🔌 API (Azure Functions)

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/pessoas` | Lista todas as pessoas (dados mock). Aceita `?nome=` para filtrar. |
| `GET` | `/api/pessoas/{id}` | Retorna a pessoa com o ID informado (`404` se não existir). |
| `POST` | `/api/pessoas` | Cadastra uma pessoa. Corpo: `{ "nome": "Fulano" }`. |
| `GET` | `/api/health` | Diagnóstico: confirma que a API está no ar e qual fonte está em uso. |

Exemplo de resposta de `GET /api/pessoas`:

```json
{
  "origem": "mock-local",
  "filtro": null,
  "total": 10,
  "pessoas": [
    { "id": 1, "nome": "Amanda Fila de Lima" },
    { "id": 2, "nome": "Carlos Leonardo Garcia Pscheidt" }
  ]
}
```

O campo `origem` indica de onde vieram os dados: `mock-local` ou `apidog`.

---

## 🧪 Mock com Apidog

> Opcional. Sem isso o projeto já funciona com o mock local embutido.

O arquivo [mock/apidog-pessoas.openapi.json](mock/apidog-pessoas.openapi.json) é uma
especificação OpenAPI 3 pronta para importar no Apidog.

1. Crie um projeto no [Apidog](https://apidog.com/).
2. **Settings → Import Data → OpenAPI/Swagger** e envie `mock/apidog-pessoas.openapi.json`.
3. Abra o endpoint `GET /pessoas` e vá até a aba **Mock**.
4. Copie a URL do **Cloud Mock** (formato `https://<id>.apidog.io/pessoas`).
5. Preencha os endereços na tabela [Endereços do projeto](#-endereços-do-projeto).
6. No Azure, crie a variável de ambiente `mock_api_url` com essa URL. A Function passa a ler do
   Apidog em vez do mock local.

Se o Apidog estiver fora do ar, a Function cai automaticamente no mock local — o campo `origem`
da resposta informa qual fonte foi usada.

---

## 💻 Rodando localmente

**Pré-requisitos:** Node.js 20+ e o Azure Functions Core Tools v4
(`npm install -g azure-functions-core-tools@4 --unsafe-perm true`).

```bash
# Backend (Azure Functions) — terminal 1
cd backend
npm install
npm start                               # sobe em http://localhost:7071

# Frontend (React) — terminal 2
cd frontend
npm install
npm run dev                             # abre em http://localhost:5173
```

O Vite faz proxy de `/api` para `http://localhost:7071`, então o frontend local funciona
exatamente como em produção. **Nenhuma configuração adicional é necessária.**

Alternativa em um único comando (emula o Static Web Apps):

```bash
npm install -g @azure/static-web-apps-cli
swa start http://localhost:5173 --api-location backend
```

---

## 🚀 Passo a passo: publicar no Azure Static Web Apps

### Pré-requisitos

- Conta no Azure (o plano **Free** do Static Web Apps já atende ao PJBL).
- Este projeto enviado para um repositório no **GitHub**.

### Passo 1 — Enviar o código para o GitHub

```bash
git add .
git commit -m "PJBL: frontend React + Azure Functions"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

### Passo 2 — Criar o recurso no Portal do Azure

1. Acesse <https://portal.azure.com>.
2. Clique em **Criar um recurso** e pesquise por **Static Web App**.
3. Clique em **Criar**.

### Passo 3 — Preencher a aba "Básico"

| Campo | Valor |
| --- | --- |
| **Assinatura** | sua assinatura do Azure |
| **Grupo de recursos** | *Criar novo* → `rg-pjbl-cloud` |
| **Nome** | `ghosty-web` (o nome aparece na URL) |
| **Tipo de plano** | **Free** |
| **Origem de implantação** | **GitHub** |
| **Região** | a mais próxima (ex.: *Brazil South* / *East US 2*) |

### Passo 4 — Conectar o GitHub

1. Clique em **Entrar com o GitHub** e autorize o Azure.
2. Selecione a **Organização**, o **Repositório** e o **Branch** `main`.

### Passo 5 — Configurar o build (a parte mais importante)

Em **Detalhes de build**, escolha o preset **React** e ajuste os campos para:

| Campo | Valor |
| --- | --- |
| **Localização do aplicativo** (`app_location`) | `frontend` |
| **Localização da API** (`api_location`) | `backend` |
| **Localização da saída** (`output_location`) | `dist` |

> ⚠️ Erro clássico: deixar `output_location` como `build`. O Vite gera a pasta **`dist`**.
> Se os três valores ficarem diferentes disso, o deploy quebra.

### Passo 6 — Revisar, criar e aguardar o deploy

1. Clique em **Revisar + criar** e depois em **Criar**.
2. O Azure cria um workflow do GitHub Actions no seu repositório e dispara o primeiro deploy.
3. Acompanhe em **Actions**, no GitHub (leva de 2 a 4 minutos).
4. Concluído o build, abra o recurso no portal e copie a **URL** exibida em *Visão geral*.
5. **Cole essa URL** na tabela [Endereços do projeto](#-endereços-do-projeto) deste README.

> Este repositório já inclui o workflow em
> [.github/workflows/azure-static-web-apps.yml](.github/workflows/azure-static-web-apps.yml).
> Se o Azure criar um segundo arquivo de workflow, mantenha apenas um dos dois para evitar
> deploys duplicados — e confirme que o secret `AZURE_STATIC_WEB_APPS_API_TOKEN` existe em
> **Settings → Secrets and variables → Actions** do repositório.

### Passo 7 — Validar a publicação

Não há variáveis de ambiente para configurar. Abra, no navegador:

- `https://SUA-URL.azurestaticapps.net/api/health` → deve retornar `"status": "ok"`;
- `https://SUA-URL.azurestaticapps.net/api/pessoas` → deve retornar a lista com 10 pessoas;
- `https://SUA-URL.azurestaticapps.net/pessoas` → a tela com todas as pessoas.

Pronto: a cada `git push` na branch `main`, o Azure republica o site automaticamente.

---

## 🛠️ Solução de problemas

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| Página em branco após o deploy | `output_location` incorreto | Deve ser `dist` (padrão do Vite), não `build`. |
| `/api/*` retorna 404 | `api_location` incorreto | Deve ser `backend`, com `host.json` e `package.json` dentro. |
| Recarregar `/buscar` dá 404 | Fallback de SPA ausente | Confirme que `staticwebapp.config.json` está na raiz e em `frontend/public/`. |
| Cadastro some depois de um tempo | Comportamento esperado | Não há banco: os registros vivem na memória da Function. |
| Deploy falha no GitHub Actions | Secret ausente | Confirme `AZURE_STATIC_WEB_APPS_API_TOKEN` em **Settings → Secrets → Actions**. |

---

## ✅ Checklist de entrega do PJBL

- [x] Frontend em React que se comunica com Azure Functions
- [x] Mock backend (dados mock servidos pela própria Function)
- [x] No mínimo duas telas — o projeto entrega três
- [x] `GRUPO.md` com o nome dos alunos
- [x] Ao menos um endpoint **GET** de Azure Functions com dados mock
- [x] Spec OpenAPI pronta para o mock no Apidog *(opcional)*
- [x] Uso de IAG documentado em `Prompt.md`
- [ ] Publicado no Azure Static Web Apps *(siga o passo a passo acima)*
- [ ] Endereço do site preenchido neste README
