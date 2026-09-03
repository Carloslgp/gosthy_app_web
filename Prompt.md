# Prompt.md — Uso de IA Generativa (IAG)

Este projeto foi gerado com auxílio de **IA Generativa**, conforme exigido pelo PJBL.

- **Ferramenta:** Claude Code (Anthropic) — modelo Claude Opus
- **Data de geração:** 02/09/2026
- **Escopo gerado pela IAG:** frontend React (Vite), backend em Azure Functions (Node.js v4),
  configuração do Azure Static Web Apps, workflow do GitHub Actions, especificação OpenAPI para
  o mock do Apidog e a documentação do repositório.

---

## Prompt utilizado

> preciso que você crie um front e um backend de cadastro de pessoas, e um página quando a pessoa
> possa buscar pessoas na base de dados, faça duas telas uma com todas as pessoas e uma para buscar
> uma pessoas específica, a base de dados so tem duas colunas, id e nome.
> Além disso faça o backend do projeto, o que está no dot env se chama:
> `db_nomes_url`
> `db_nomes_api_key`
> Faça chamadas para esses endereços.
>
> Adicione as seguintes coisas:
>
> Em grupo PJBL, alunos criam frontend que se comunica com azure functions e mock backend.
> (Opcional: utilizar React, opcional: utilizar o Module Federation).
> No mínimo duas funcionalidades/telas do projeto PJBL.
> No repo deve conter um arquivo GRUPO.md deve conter o nome dos alunos.
> Comunicação do frontend com pelo menos 1 endpoint GET de Azure Functions (utilizar dados mocks).
> Outras funcionalidades: sugiro realizar o mock com Apidog: Plataforma API Tudo-em-Um: Design,
> Depuração, Mock, Teste e Documentação.
> Utilizar IAG.
> Informe no arquivo Prompt.md qual o prompt utilizado para gerar o frontend.
> Publicar no Azure Web Static Apps.
> No arquivo Readme.MD deve conter o endereço do site criado no azure web Static apps. e Se utilizou
> o apidog para mock informar os endereços.
>
> O nome dos integrantes são
> Amanda Fila de Lima
> Carlos Leonardo Garcia Pscheidt
> Gustavo Yuri
> Rafael Della
>
> E faça um passo a passo de como criar o site na azure web static apps, de resto siga as instruções

### Prompt de refinamento

Depois da primeira versão, o grupo decidiu remover a dependência de banco de dados externo, já que o
enunciado do PJBL pede apenas um **mock backend**:

> pode tirar os dados do supabase então, deixe apenas o necessário para cumprir o projeto e me diga
> o passo a passo para rodar isso na azure

---

## O que a IAG produziu a partir desses prompts

### Frontend (`frontend/`)

- Aplicação **React 18 + Vite** com roteamento por `react-router-dom`.
- **Três telas** (o PJBL exige no mínimo duas):
  1. `/pessoas` — lista todas as pessoas vindas do endpoint GET das Azure Functions;
  2. `/buscar` — busca de uma pessoa específica por **ID** ou por **nome**;
  3. `/cadastro` — formulário de cadastro de pessoa.
- Cliente HTTP centralizado em `frontend/src/api.js`, com tratamento de erro e estados de carregamento.
- CSS próprio, responsivo e com suporte a tema claro/escuro.

### Backend (`backend/`)

- **Azure Functions** no modelo de programação Node.js v4, servindo um **mock backend**:
  - `GET /api/pessoas` — lista todas, aceita `?nome=` para filtrar. É o **endpoint GET com dados
    mock** exigido pelo PJBL;
  - `GET /api/pessoas/{id}` — busca uma pessoa específica;
  - `POST /api/pessoas` — cadastra uma pessoa;
  - `GET /api/health` — diagnóstico do deploy.
- **Sem banco de dados:** os dados vivem no mock embutido na própria Function
  (`backend/src/lib/mock.js`), com a opção de consumir o Cloud Mock do Apidog através da
  variável de ambiente `mock_api_url`.

### Infraestrutura

- `staticwebapp.config.json`, workflow do GitHub Actions e passo a passo de publicação no
  Azure Static Web Apps (documentado no `README.md`).
- `mock/apidog-pessoas.openapi.json` para importação no Apidog e geração do Cloud Mock.

---

## Revisão humana

O código gerado foi revisado e testado pelo grupo antes da entrega: todos os endpoints foram
executados, a listagem, a busca, o cadastro e as validações de entrada foram conferidos, e o build
de produção do frontend foi validado.
