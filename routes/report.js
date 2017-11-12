var express = require('express')
var router = express.Router()
var cheerio = require('cheerio')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path')
var mongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb://admin:admin@tmp-shard-00-00-2uena.mongodb.net:27017,tmp-shard-00-01-2uena.mongodb.net:27017,tmp-shard-00-02-2uena.mongodb.net:27017/test?ssl=true&replicaSet=tmp-shard-0&authSource=admin'

const multer = require('multer')
var md5 = require('md5')

router.get('/', function (req, res, next) {
    res.render('upload', {title: 'Express'})
})

const uploadImage = multer({dest: 'temp/'}).single('image')

router.post('/', uploadImage, function (req, res, next) {
    console.log('image', req.file);
    console.log('extname', path.extname(req.file.path))
    fs.readFile(req.file.path, function (err, data) {
        var fileHash = md5(data).slice(8)
        console.log('md5', fileHash)
        var originalname = req.file.originalname
        var dotIndex = originalname.lastIndexOf('.')
        var newName = originalname.slice(0, dotIndex) + '_' + fileHash + originalname.slice(dotIndex)

        //var finalFilePath = __dirname +'../public' + newName
        //console.log('Path of file:', finalFilePath)
        var finalFilePath = '/app/public/images/' + newName
        fs.writeFileSync(finalFilePath, data);
        console.log("filePath", finalFilePath)
        var serverFileName = 'http://hack-seed.herokuapp.com/' + newName
        serverFileName = encodeURIComponent(serverFileName)
        console.log("serverFileName", serverFileName)
        /*reverseImageSearch(serverFileName, res, function () {

        })*/
        var request = require('request')

        var userAgent = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11'
        var options = {
            url: 'http://www.google.com',
            headers: {'user-agent': userAgent}
        }
        request(options, function (err, requestResponse, body) {
            res.send(body)
        })
    })
})

router.post('/old', function (req, res, next) {
    console.log('1')
    var form = new formidable.IncomingForm()
    console.log('process.cwd();', process.cwd())
    form.parse(req, function (err, fields, files) {
        // `file` is the name of the <input> field of type `file`
        console.log('3')
        var old_path = files.file.path,
            file_size = files.file.size,
            file_ext = files.file.name.split('.').pop(),
            index = old_path.lastIndexOf('\\') + 1,
            file_name = old_path.substr(index),
            new_path = path.join(process.cwd(), './uploads/', file_name + '.' + file_ext)

        fs.readFile(old_path, function (err, data) {
            fs.writeFile(new_path, data, function (err) {
                fs.unlink(old_path, function (err) {
                    if (err) {
                        res.status(500)
                        res.json({'success': false})
                    } else {
                        res.status(200)
                        res.json({'success': true})
                        console.log('new_path', new_path)
                    }
                })
            })
        })
    })
})


/*mongoClient.connect(connectionString, function (error, db) {
    db.collection('reports').insertOne({
        name: "",

    })
})*/

function reverseImageSearch(imageUrl, masterResponse, callback) {
    var request = require('request')
    var userAgent = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11'
    var options = {
        url: 'http://www.google.com/searchbyimage',
        qs: {image_url: imageUrl},
        headers: {'user-agent': userAgent}
    }
    var response = {
        status: "unknown error",
        statusCode: 0,
        lastAction: "before request"
    }
    var l = console.log
    request(options, function (err, requestResponse, body) {
        var $ = cheerio.load(body)
        l('statusCode', response.statusCode)
        var nextLink = ''
        var guess = ''
        l(1)
        $('a').each(function (i, elem) {
            var href = $(elem).attr('href')
            var parentText = $(elem).parent().text()
            if (href !== undefined && href.indexOf('search?q=') > -1) {
                if (parentText.indexOf('Best guess') > -1) {
                    guess = parentText.split(':')[1].slice(1)
                    console.log("Best guess : ", guess)
                    return false
                }
            }
        })
        l(2)
        $('a').each(function (i, elem) {
            var text = $(this).text()
            if (text === "Visually similar images") {
                nextLink = 'http://google.com/' + $(this).attr('href')
                return false
            }
        })
        l(3)
        if (nextLink !== undefined && nextLink.length > 0) {
            request({url: nextLink}, function (err, requestResponse, body) {
                $ = cheerio.load(body)
                var imgTags = []
                var imgLinks = []

                $('img').each(function (i, elem) {
                    var src = $(this).attr('src')
                    if (src !== undefined) {
                        imgTags += "<img src=" + src + "><br/>"
                        imgLinks.push(src)
                    }
                })
                l(4)
                response.status = "success"
                response.statusCode = 1
                response.guess = guess
                response.imageTagsHTML = imgTags
                response.imageLinks = imgLinks
                //callback(response)
                masterResponse.send(response)
                l(5)
            })
        } else {
            masterResponse.send({status:"Error in nextLink"})
        }
    })
}

module.exports = router