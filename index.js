var express = require('express');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var sizeOf = require('image-size');
var exphbs = require('express-handlebars');
require('string.prototype.startswith');

var app = express();

app.use(express.static(__dirname + '/bower_components'));

app.engine('.hbs', exphbs({extname: '.hbs'}));

var serverPort = 8072;
app.set('view engine', '.hbs');

app.get('/', function (req, res, next) {
    return res.render('index');
});

app.post('/upload', upload.single('file'), function (req, res, next) {

    if(!req.file.mimetype.startsWith('image/')) {
        return res.status(422).json({
            error: 'The uploaded file must be an image'
        });
    }

    var dimensions = sizeOf(req.file.path);

    if(( dimensions.width < 1 ) || ( dimensions.height < 1 )) {
        return res.status(422).json({
            error: 'The image must be at least 1 x 1'
        });
    }

    return res.status(200).send(req.file);
});

app.listen(serverPort, function () {
    console.log('Express server listening on port ' + serverPort);
});
