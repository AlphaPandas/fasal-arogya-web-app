var express = require('express')
var router = express.Router()
var requestify = require('requestify')
var request = require('request')
//var scrap = require('scrap');

var google = 'https://www.google.com/searchbyimage'
var image = 'https://www.daf.qld.gov.au/__data/assets/image/0010/146485/varieties/thumb-500.jpg'
const cheerio = require('cheerio')

var options = {
	url: google,
	qs: {image_url: image},
	headers: {'user-agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11'}
}

/* GET users listing. */
router.get('/', function (req, res, next) {

	var imageURL = req.query.url
	if(imageURL !== undefined && imageURL.length > 4) {
		image = imageURL
        reverseImageSearch(image, res, function (response) {
            console.log(response.guess)
        })
	} else {
		res.send({
            status: "Invalid Image URL",
            statusCode: 0,
            lastAction: "before request"
        })
	}

})

router.get('/scrap', function (req, res, next) {
	res.send('scrapper here')
})

function reverseImageSearch(imageUrl, masterResponse, callback) {
	var request = require('request')
	var userAgent = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11'
	var options = {
		url: 'https://www.google.com/searchbyimage',
		qs: {image_url: imageUrl},
		headers: {'user-agent': userAgent}
	}
	var response = {
		status: "unknown error",
		statusCode: 0,
		lastAction: "before request"
	}

	request(options, function (err, requestResponse, body) {
		var $ = cheerio.load(body)
		var nextLink = ''
		var guess = ''

		$('a').each(function (i, elem) {
			var href = $(elem).attr('href')
			var parentText = $(elem).parent().text()
			if (href !== undefined && href.indexOf('search?q=') > -1) {
				if (parentText.indexOf('Best guess') > -1) {
					guess = parentText.split(':')[1].slice(1)
					return false
				}
			}
		})

		$('a').each(function (i, elem) {
			var text = $(this).text()
			if (text === "Visually similar images") {
				nextLink = 'http://google.com/' + $(this).attr('href')
				return false
			}
		})

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
				response.status = "success"
				response.statusCode = 1
				response.guess = guess
				response.imageTagsHTML = imgTags
                response.imageLinks = imgLinks
				callback(response)
				masterResponse.send(response)
			})
		}
		return response
	})
}

module.exports = router
