const http = require('http')
const routes = require('./routes')
const bodyParser = require('./helpers/bodyParser')

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(`http://localhost${req.url}`)
    let { pathname } = parsedUrl
    let id = null
    const splitEndpoint = pathname.split('/').filter(Boolean)

    if(splitEndpoint.length > 1){
        pathname = `/${splitEndpoint[0]}/:id`
        id = splitEndpoint[1]
    }

    const route = routes.find((route) => route.endpoint === pathname && route.method === req.method)

    if(route){
        req.query = Object.fromEntries(parsedUrl.searchParams)
        req.params = { id }

        res.send = (sttCode, body) => {
            res.writeHead(sttCode, {'Content-Type':'application/json'})
            res.end(JSON.stringify(body))
        }

        if(['POST', 'PUT'].includes(req.method)){
            bodyParser(req, () => route.handler(req, res))
        }else{
            route.handler(req, res)
        }
    }else{
        res.writeHead(404, {'Content-Type':'text/html'})
        res.end(`Cannot ${req.method} ${pathname}`)
    }
})

const PORT = 3001

server.listen(PORT , () => console.log(`🔥 Rodando na porta ${PORT}` ))