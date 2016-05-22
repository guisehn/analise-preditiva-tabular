## Instalando ambiente de desenvolvimento

1. Instalar [node.js](https://nodejs.org/en/).
2. Instalar o [watchify](https://github.com/substack/watchify) com o comando `npm install -g watchify`.
3. Executar `npm install` dentro da pasta do projeto para instalar as dependências.
4. Executar `watchify js/main.js -o bundle.js` — este comando irá gerar um novo `bundle.js` cada vez que o código é editado.
5. Abrir `index.html` em seu browser
