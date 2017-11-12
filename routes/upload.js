var express = require('express')
var router = express.Router()

var formidable = require('formidable')
var fs = require('fs')
var path = require('path')
const multer = require('multer')
var md5 = require('md5')

router.get('/', function (req, res, next) {
	res.render('upload', {title: 'Express'})
})

const uploadImage = multer({dest: 'temp/'}).single('image')

router.post('/', uploadImage, function (req, res, next) {
	console.log('extname', path.extname(req.file.path))
	fs.readFile(req.file.path, function (err, data) {
		var fileHash = md5(data).slice(8)
		console.log('md5', fileHash)
		var originalname = req.file.originalname
		var dotIndex = originalname.lastIndexOf('.')
		originalname = originalname.slice(0,dotIndex) + '_' + fileHash + originalname.slice(dotIndex)
		console.log('new file name', originalname)
		fs.writeFileSync(__dirname + '/../public/images/' + originalname, data);
		res.send({status:'success'})
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
			new_path = path.join(process.cwd(),'./uploads/', file_name + '.' + file_ext)

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

module.exports = router