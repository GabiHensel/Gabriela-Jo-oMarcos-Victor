const handlebars = require('handlebars');

handlebars.registerHelper('eq', function(a, b, options) {
    return a === b;
});

handlebars.registerHelper('includes', function(array, value, options) {
    if (Array.isArray(array)) {
        return array.includes(value);
    }
    return false;
});




