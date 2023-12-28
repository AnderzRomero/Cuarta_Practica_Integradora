# Tienda HeroSystems
Este es un proyecto de ecommerce básico que se utiliza para el curso de Programacion Backend. La aplicación permite ver una lista de productos de tecnologia en construccion.

## Tecnologías utilizadas
- Node.JS   ----->  `npm init -y` 
- Paquetes a instalar de npm   ----->  `npm install express express-handlebars nodemon mongoose multer dotenv mongoose-paginate-v2 cookie-parser express-session connect-mongo bcrypt passport passport-local passport-github2 jsonwebtoken passport-jwt passport-google-oauth20 @google-cloud/storage socket.io commander @faker-js/faker winston nodemailer handlebars`

## Funcionalidades
### algunas desde el Frontend y otras desde POSTMAN
- Ver una lista de productos disponibles
- Agregar productos al carrito de compras
- Ver el carrito de compras
- Realizar una orden de compra

## Instalación

### Para instalar y ejecutar la aplicación en tu máquina local, sigue los siguientes pasos:

> [!IMPORTANT]
> 1. Clona el repositorio a tu máquina local.
> 2. Abre una terminal en el directorio del proyecto.
> 3. Ejecuta el comando `npm init -y` para generar los paquetes del proyecto.
> 4. realizar el siguiente cambio en nuestro `package.json`: 
    "main": "./src/app.js",
    "type": "module",
    "scripts": {
        "start": "node src/app.js",
        "dev": "nodemon src/app.js --mode dev",
        "test": "echo \"Error: no test specified\" && exit 1"
        },
> 4. Ejecuta el comando `npm install express express-handlebars nodemon mongoose multer dotenv mongoose-paginate-v2 cookie-parser express-session connect-mongo bcrypt passport passport-local passport-github2 jsonwebtoken passport-jwt passport-google-oauth20 @google-cloud/storage socket.io commander @faker-js/faker winston nodemailer handlebars` para instalar las dependencias necesarias para el funcionamiento.
> 5. Ejecuta el comando `npm run dev`  para iniciar la aplicación.
> 7. Abre tu navegador y navega a http://localhost:8080 para ver la aplicación en acción.

## Configuraciones Especiales
> [!IMPORTANT]
> 1. Se debe descomprimir el archivo de entorno Virtual para luego copiar a la raiz las variables de entorno para la de conexion a la base de datos ".env.dev y .env.prod".

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para obtener más información.
