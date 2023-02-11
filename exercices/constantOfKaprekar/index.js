const http = require('http')
const qs = require('querystring')
const getNumerOfItertions = require('./constantOfKaprekar');

const server = http.createServer(function (request, response) {
    console.dir(request.param)

    if (request.method == 'POST') {
        console.log('POST')
        var body = ''
        request.on('data', function (data) {
            body += data
        })

        request.on('end', function () {
            const post = qs.parse(body)
            const numbers = post.numbers
            const result = getNumerOfItertions(numbers)
            response.writeHead(200, { 'Content-Type': 'text/html' })
            response.end('Number of iterations: ' + result)
        })
    } else {
        var html = `
            &lt;html&gt;
                &lt;body&gt;
                    &lt;form method="post" action="http://localhost:3000"&gt;Numbers: 
                        &lt;input type="text" name="numbers" /&gt;
                        &lt;input type="submit" value="Add" /&gt;
                    &lt;/form&gt;
                &lt;/body&gt;
            &lt;/html&gt;`
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.end(html)
    }
})

const port = 3000; 
const host = '127.0.0.1'
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)

