var request = require('request')
var cheerio = require('cheerio')
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var PORT = process.env.PORT || 8080
var path = require('path')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.listen(PORT, function() {
    console.log("App now listening at localhost:", PORT)
})

//This is the default home route
app.get('*', function(req,res) {
    res.sendFile(path.join(__dirname,'index.html'))
})


app.post('/scrape', function(req,res) {
    var url = req.body
    var results = []
    request(url.address, function(error, response, body) {
        if (error) throw error
        var $ = cheerio.load(body)
        $('.listing').each(function() {
            var listing = {
                name: $(this).find('.listing-name').text().trim(),
                vendor: $(this).find('.listing-vendor').text().trim(),
                description: $(this).find('.listing-description').text().trim()
            }
            results.push(listing)
        })
        res.json(results)
    })
    
})


