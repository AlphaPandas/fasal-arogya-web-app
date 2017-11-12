var express = require('express')
var router = express.Router()
var requestify = require('requestify')
var request = require('request')
//var scrap = require('scrap');

var google = 'https://www.google.com/searchbyimage'
var image = 'https://www.daf.qld.gov.au/__data/assets/image/0010/146485/varieties/thumb-500.jpg'
const cheerio = require('cheerio')

var keywordsPack = "african citrus psyllid trioza erytreae insect cultivars citrus murraya  native and ornamental forms mock orange orange jasmine range ornamentals angular leaf spot xanthomonas fragaria bacterial plant pathogen all varieties cultivated and some wild strawberry plants fragaria sp ash whitefly siphoninus phillyreae insect ornamentals and fruit crops asiatic citrus psyllid diaphorina citri insect all cultivars citrus murraya native and ornamental forms of mock orange or orange jasmine and bergera koenigii curry leaf also a range of ornamentals bacterial heart rot and fruit collapse dickeya spp bacterial plant pathogen pineapple banana freckle phyllosticta musarum and guignardia musae fungus severe infection results in yellowing of the leaf, which withers and dies black sigatoka mycosphaerella fijiensis fungus bananas branched broomrape orobanche ramosa parasitic weed broadleaf crops, broadleaf weeds, native plants bunchy top banana bunchy top virus virus bananas citrus canker xanthomonas axonopodis bacteria citrus citrus fruit borer citripestis sagittiferella insect citrus and other plants in the rutaceae citrus greening huanglongbing candidatus liberobacter spp bacteria citrus citrus powderymildew oidium tingitaninum ando citri fungus citrus citrus tristeza virus citrus tristeza closterovirus ctv : mandarin stem pitting strains virus citrus cocoa pod borer conopomorpha cramerella insect of the family gracillariidae cocoa, rambutan and longan cotton red spider mite or glover mite glover mite, tetranychus gloveri mite banana, cotton, beans, eggplant, beetroot, peas, sweet potato, palm trees, papaya, ornamentals, weed species cucumber green mottle mosaic virus virus rockmelon, cucumber and watermelon electric ants wasmannia auropunctata ant environment european house borer hylotrupes insect seasoned pine timber fire ants solenopsis invicta ant environment fusarium head blight caused by fusarium species in wheat mainly fusarium graminearumand f pseudograminearum wheat and barley fusarium stalk rot caused by fusarium species mainly fusarium thapsinumand andyaze sorghum giant african snail achatina fulica gastropod environment grapevine leaf rust phakopsora euvitis fungus grapes lesser auger beetle heterobostrychus aequalis insect timber little cherry disease  mal secco phoma tracheiphila fungus citrus mango leaf gall midge prontarinia spp insect mangoes mango leafhopper idioscopus nitidulus and i clypealis insect mangoes mango malformation disease fusarium mangiferae and other fusarium spp fungus mangoes mango stem miner spulerina isonoma insect mangoes mango weevil sternochetus frigidus insect mangoes mediterranean fruit fly ceratitis capitata insect fruit and vegetables, esp stone fruit melon fly bactrocera cucurbitae insect fruit and vegetables, esp cucurbits and beans melon thrips thrips palmi insect fruit and vegetables myrtle rust puccinia psidii fungus complete host range not known; however, it has been identified on melaleuca, syzygium and eugenia sp navel orangeworm amyelois transitella insect citrus, english walnuts, pistachio, almonds and grapes oriental fruit fly bactrocera papayae insect fruit and vegetables panama disease fusarium oxysprorum f sp cubense fungus bananas papaya ringspot virus type p prsvp virus papaya and cucurbits pierce's disease and glassy winged sharpshooter xylella fastidiosa bacteria grapes plum pox sharka  virus stonefruit potato cyst nematode globodera rostochiensis wall skarbilovich nematode potato plants and other members of the solanaceous plant family red banded mango caterpillar deanolis sublimbalis insect mangoes silverleaf whitefly bemisia tabacibiotype b insect range of ornamental and crop plants southern red mite oligonychus ilicus insect range spiralling whitefly aleurodicus dispersus insect range thrips and topovirus thysanoptera : thripidae insect vegetables and fruit vegetable leafminer liriomyza sativae insect common horticultural crops and ornamental plant species, esp tomatoes, pumpkins and beans yellow crazy ant anoplolepis gracilipes ant environment \n" +
    "artichoke arugula asparagus aubergine eggplant amaranth legumes alfalfa sprouts azuki beans bean sprouts black beans black-eyed peas borlotti bean broad beans chickpeas, garbanzos, or ceci beans green beans kidney beans lentils lima beans or butter bean mung beans navy beans pinto beans runner beans split peas soy beans peas mangetout or snap peas beet greens  bok choy known bok choy in uk and us) broccoflower a hybrid) broccoli brussels sprouts cabbage calabrese carrots cauliflower celery chard collard greens corn salad endive fiddleheads young coiled fern leaves) frisee fennel herbs and spices anise basil caraway cilantro seeds are coriander chamomile dill fennel lavender lemon grass marjoram oregano parsley rosemary sage thyme kale kohlrabi lettuce lactuca sativa maize uk) = corn us) = sweetcorn actually a grain) mushrooms actually a fungus, not a plant) mustard greens nettles new zealand spinach okra onion family chives garlic leek allium porrum onion shallot spring onion uk) == green onion us) == scallion parsley peppers biologically fruits, but taxed as vegetables) green pepper and red pepper == bell pepper == pimento chili pepper == capsicum jalapeño habanero paprika tabasco pepper cayenne pepper radicchio rhubarb root vegetables beetroot uk) == beet us) mangel-wurzel: a variety of beet used mostly as cattlefeed carrot celeriac daikon ginger parsnip rutabaga turnip radish swede uk) == rutabaga us) turnip wasabi horseradish white radish salsify usually purple salsify or oyster plant) skirret spinach topinambur squashes biologically fruits, but taxed as vegetables) acorn squash bitter melon butternut squash banana squash courgette uk) == zucchini us) cucumber biologically fruits, but taxed as vegetables) delicata gem squash hubbard squash marrow uk) == squash us) cucurbita maxima patty pans pumpkin spaghetti squash tat soi tomato  tubers jicama jerusalem artichoke potato quandong native peach) sunchokes sweet potato taro yam turnip greens water chestnut watercress zucchini" + "\n" +
    "achoccha amaranth and angelica anise apple sclerotinia sclerotiorum armenian arrowroot arrugula artichoke asparagus atemoya avocado balsam bambara bamboo banana barbados basil batatas beans beet blackberry blueberry bok boniato broccoli brussels bunch burdock cabbage calabaza cantaloupes capers carambola cardoon carnote carrot casaba cassava cauliflower celeriac celery celtuce chard chaya chayote cherry chicory chinese chives choy chrysanthemum chufa cilantro citron coconut collard collards comfrey corn cress cuban cucmber cucumber cushcush daikon dandelion dasheen dill edible eggplant endive eugenia fennel fig fruit galia garbanzo garden garlic gherkin ginger ginseng gourd gourds grape groundnut guar guava guvava hanover honeydew horseradish huckleberry ice indian jaboticaba jackfruit jicama jojoba jujube kale kangkong kohlrabi leek lentils lettuce longan loquat lovage luffa lychee macadamia malabar malanga mamey mango martynia melon momordica muscadine mushroom muskmelon muskmelons mustard naranjillo nasturtium nectarine okra onion or orach palm papaya paprika parsley parsnip passion pea peanut pear peas pecan pepper persimmon pimiento pineapple pitaya plant plantains pokeweed pomegranate potato production pumpkin purslane raab radicchio radish rakkyo rampion raspberry rhubarb romaine root roselle rutabaga saffron salad salsify sapodilla sapote sarsaparilla sassafrass scorzonera sea seagrape see shallot skirret smallage sorrel southern soybeans spinach spondias sprouts squash strawberries sugar swamp sweet sweetpotato swiss tomatillo tomato tree tropical truffles turnip upland water waterchestnut watercress watermelon west yams"

keywordsPack = remove_duplicates_safe(keywordsPack.split(' '))
console.log("keywordsPack", keywordsPack)
keywordsPack = keywordsPack.join(' ')
var wordsCount = 0

var options = {
    url: google,
    qs: {image_url: image},
    headers: {'user-agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11'}
}

/* GET users listing. */
router.get('/', function (req, res, next) {

    var imageURL = req.query.url
    if (imageURL !== undefined && imageURL.length > 4) {
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
    var extraKeywords = '&q=pests+diseases+argiculture+plants'
    var extraKeywordsEnable = false
    var request = require('request')
    var userAgent = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11'
    var options = {
        url: 'https://www.google.com/searchbyimage',
        qs: {image_url: imageUrl + ((extraKeywordsEnable)?extraKeywords:'')},
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

                wordsCount = guess.split(' ').length
                var overallScore = 0
                var reverseWords = guess.split(' ')
                //reverseWords = "fruit plant banana"
                for(var i = 0; i < reverseWords.length; i++) {
                    console.log("compare", reverseWords[i])
                    if(keywordsPack.indexOf(reverseWords[i]) > -1 && reverseWords[i].length > 2) {
                        overallScore += 1.0
                    }
                }
                response.overallScore = overallScore
                response.totalScore = wordsCount

                //console.log("body", body)
                var interestKeywords = ['plant', 'agriculture', 'pest', 'disease']
                for(var i in interestKeywords) {
                    if(body.indexOf(interestKeywords[i]) > -1) {
                        response.overallScore += 0.5
                        response.overallScore = (response.overallScore > response.totalScore) ? response.totalScore : response.overallScore;
                        console.log('>>', interestKeywords[[i]])
                    }
                }
                var totalPercentage = ((response.overallScore / response.totalScore) * 100) + ' %'
//                masterResponse.send(response.guess + '<br/>' + "Score : " + response.overallScore + "/" + response.totalScore  + ' (' + totalPercentage +')<br/>' + response.imageTagsHTML)

                masterResponse.send(response.guess + '<br/>' + "Score : " + ' (' + totalPercentage +')<br/>' + response.imageTagsHTML + "<style>img {float:left}</style>")
            })
        }
        return response
    })
}

function remove_duplicates_safe(arr) {
    var seen = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i] in seen)) {
            ret_arr.push(arr[i]);
            seen[arr[i]] = true;
        }
    }
    return ret_arr;

}

module.exports = router
