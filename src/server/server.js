import path from 'path'
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import AnubisClient from 'anubis-client'

const anubis = new AnubisClient({
  server: process.env.ANUBIS_SERVER,
  token: process.env.ANUBIS_TOKEN
})

anubis.connect()

anubis.on('open', (status) => {
  if (status.success) {
    console.log('Connected to Anubis server')
  } else {
    console.log('Auth error: ' + status.message)
  }
})

anubis.on('close', () => {
  console.log('Connection to Anubis server lost')

  setTimeout(function() {
    anubis.connect()
  }, 1000)
})

const app = express()
const server = http.Server(app)

app.set('env', process.env.NODE_ENV || 'development')
app.set('host', process.env.HOST || '0.0.0.0')
app.set('port', process.env.PORT || 5000)

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../../assets')))
app.use('/scripts', express.static(path.join(__dirname, '../../dist')))

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong validation token')
  }
})

app.post('/webhook', (req, res) => {
  var data = req.body

  if (data.object == 'page') {
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id
      var timeOfEvent = pageEntry.time

      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.message) {
          processMessage(messagingEvent)
        } else {
          console.log('Webhook received unknown messagingEvent: ', messagingEvent)
        }
      })
    })

    res.sendStatus(200)
  }
})

app.post('/api/v1/message', (req, res) => {
  var message = req.body

  console.log('Received message:', message.text)
  anubis.publish(process.env.ANUBIS_TOPIC, message.text)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../assets', 'index.html'))
})

app.use((err, req, res, next) => {
  console.log('Error on request %s %s', req.method, req.url)
  console.log(err)
  console.log(err.stack)
  res.status(500).send('Internal server error')
})

function processMessage(event) {
  var senderID = event.sender.id
  var recipientID = event.recipient.id
  var timeOfMessage = event.timestamp
  var message = event.message

  console.log('Received message:', message.text)
  anubis.publish(process.env.ANUBIS_TOPIC, message.text)
}

server.listen(app.get('port'), () => {
  console.log('Express %s server listening on %s:%s',
    app.get('env'),
    app.get('host'),
    app.get('port')
  )
})
