## Instalando ambiente de desenvolvimento
1. Instalar o [node.js](https://nodejs.org/en/)
2. Instalar o [watchify](https://github.com/substack/watchify) com o comando `npm install -g watchify`
3. Instalar o [mocha](https://mochajs.org/) com o comando `npm install -g mocha`
3. Executar `npm install` dentro da pasta do projeto para instalar as dependências

## Rodando o projeto
1. Executar `watchify js/main.js -o bundle.js` — este comando irá gerar um novo `bundle.js` cada vez que o código é editado
2. Abrir `index.html` em seu browser

## Rodando testes automatizados
Rodar `mocha` na pasta do projeto
