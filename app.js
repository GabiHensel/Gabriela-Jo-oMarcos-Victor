const express = require('express');
var session = require('express-session');
const router = require('./routers/route.js');
const expressHandlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const handlebarsHelpers = require('./handlebarsHelpers');
const middlewares = require('./middlewares/middlewares.js')
const app = express();

app.use(session({
  secret: 'textosecreto',
  cookie: {maxAge: 30 * 60 * 1000}
}));


let hbs = expressHandlebars.create({
  handlebars: Handlebars,
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middlewares.logRegister,middlewares.sessionControl)
app.use(router); 


app.use(
    express.urlencoded({
        extended: true
    })
)

app.listen(4000,function(){
    console.log("server online");
});
