<img alt="GoStack" src="https://camo.githubusercontent.com/d25397e9df01fe7882dcc1cbc96bdf052ffd7d0c/68747470733a2f2f73746f726167652e676f6f676c65617069732e636f6d2f676f6c64656e2d77696e642f626f6f7463616d702d676f737461636b2f6865616465722d6465736166696f732e706e67" style="max-width:100%">

## <p style="margin-top: 16px" align="center">**Desafio - Banco de dados e upload de arquivos no Node.js**</p>

Uma aplicação que armazena transações financeiras de entrada e saída, permitir o cadastro e a listagem dessas transações, além da criação de novos registros no banco de dados a partir do envio de um arquivo csv.


```
# clonar o repositório
git clone https://github.com/nivaldoandrade/desafio-database-upload

# Instalar as dependências
yarn

#Criação do Banco de dados
Alterar as informações do arquivo ormconfig.json com as informações do seu banco de dados.

# Run migrations
yarn typeorm migration:run

# Iniciar a aplicação
yarn dev:server

```
---
### Insomnia
Tutorial de como importar Workspace para teste [Importing and Exporting Data.](https://support.insomnia.rest/article/52-importing-and-exporting-data)
Download do [Workspace](https://github.com/nivaldoandrade/desafio-database-upload/blob/master/InsomniaData/desafio-database-upload.json).

---
### Rotas da aplicação
* POST /transactions: A rota receber **title**, **value**, **type** e **category** dentro do corpo da requisição, sendo **type** o tipo da transação, que deve ser **income** para entradas (depósitos) e **outcome** para saídas (retiradas).
  ```JSON
  {
  "title": "Salário",
  "value": 3000,
  "type": "income",
  "category": "Alimentação"
}


* GET /transactions: Essa rota retornar uma listagem com todas as transações que você cadastrou até agora, junto com o valor de soma de entradas, retiradas e total de crédito.
  ```JSON
  {
    "transactions": [
      {
        "id": "uuid",
        "title": "Salário",
        "value": 4000,
        "type": "income",
        "category": {
          "id": "uuid",
          "title": "Salary",
          "created_at": "2020-04-20T00:00:49.620Z",
          "updated_at": "2020-04-20T00:00:49.620Z"
        },
        "created_at": "2020-04-20T00:00:49.620Z",
        "updated_at": "2020-04-20T00:00:49.620Z"
      },
      {
        "id": "uuid",
        "title": "Freela",
        "value": 2000,
        "type": "income",
        "category": {
          "id": "uuid",
          "title": "Others",
          "created_at": "2020-04-20T00:00:49.620Z",
          "updated_at": "2020-04-20T00:00:49.620Z"
        },
        "created_at": "2020-04-20T00:00:49.620Z",
        "updated_at": "2020-04-20T00:00:49.620Z"
      },
      {
        "id": "uuid",
        "title": "Pagamento da fatura",
        "value": 4000,
        "type": "outcome",
        "category": {
          "id": "uuid",
          "title": "Others",
          "created_at": "2020-04-20T00:00:49.620Z",
          "updated_at": "2020-04-20T00:00:49.620Z"
        },
        "created_at": "2020-04-20T00:00:49.620Z",
        "updated_at": "2020-04-20T00:00:49.620Z"
      },
      {
        "id": "uuid",
        "title": "Cadeira Gamer",
        "value": 1200,
        "type": "outcome",
        "category": {
          "id": "uuid",
          "title": "Recreation",
          "created_at": "2020-04-20T00:00:49.620Z",
          "updated_at": "2020-04-20T00:00:49.620Z"
        },
        "created_at": "2020-04-20T00:00:49.620Z",
        "updated_at": "2020-04-20T00:00:49.620Z"
      }
    ],
    "balance": {
      "income": 6000,
      "outcome": 5200,
      "total": 800
    }
  }

* DELETE /transactions/:id: A rota deleta uma transação com o id presente nos parâmetros da rota;

* POST /transactions/import: A rota faz a importação de um arquivo com formato .csv contendo as mesmas informações necessárias para criação de uma transação id, title, value, type, category_id, created_at, updated_at, onde cada linha do arquivo CSV deve ser um novo registro para o banco de dados.
[Exemplo](https://github.com/nivaldoandrade/desafio-database-upload/blob/master/file.csv)

____
Desafio feito pela [RocketSeat](https://rocketseat.com.br/).

