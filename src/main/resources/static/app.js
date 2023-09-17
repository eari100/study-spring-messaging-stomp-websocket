const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/gs-guide-websocket'
})

stompClient.onConnect = (frame) => {
    setConnected(true)
    console.log(`Connected: ${frame}`)
    stompClient.subscribe('/topic/greetings', (greeting) => {
        showGreeting(JSON.parse(greeting.body).content)
    })
}

stompClient.onWebSocketError = (error) => {
    console.log('Error with websocket', error)
}

stompClient.onStompError = (frame) => {
    console.error(`Broker reported error: ${frame.headers['message']}`)
    console.error(`Additional details: ${frame.body}`)
}

const setConnected = (connected) => {
    $('#connect').prop('disabled', connected)
    $('#disconnect').prop('disabled', !connected)

    connected ? $('#conversation').show() : $('#conversation').hide()

    $('#greetings').html('')
}

const connect = () => {
    stompClient.activate()
}

const disconnected = () => {
    stompClient.deactivate()
    setConnected(false)
    console.log('Disconnected')
}

const sendName = () => {
    stompClient.publish({
        destination: '/app/hello',
        body: JSON.stringify({
            'name': $('#name').val()
        })
    })
}

const showGreeting = (message) => {
    $('#greetings').append(`<tr><td>${message}</td></tr>`)
}

$(() => {
    $('form').on('submit', e => e.preventDefault())
    $('#connect').click(() => connect())
    $('#disconnect').click(() => disconnected())
    $('#send').click(() => sendName())
})