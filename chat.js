var g_pServer     = require('express').createServer()
var g_pSocketIO   = require('socket.io').listen(g_pServer);

g_pServer.listen(8124);

g_pServer.get('/', function (p_pRequest, p_pResponse) {
  p_pResponse.sendfile(__dirname + '/chat.html');
});

var g_szServerName = "Host";
var g_aUsernames = [];

g_pSocketIO.sockets.on('connection', function (p_pSocket) {

    function Broadcast(p_szUsername, p_szMessage) {
        g_pSocketIO.sockets.emit('broadcast', p_szUsername, p_szMessage);
    }

    function UpdateUserList() {
        g_pSocketIO.sockets.emit('updateuserlist', g_aUsernames);
    }

    p_pSocket.on('adduser', function(p_szUsername){
        g_aUsernames.push(p_szUsername);
        p_pSocket.m_szUsername = p_szUsername;

        UpdateUserList();
        Broadcast(g_szServerName, p_szUsername + ' has connected.');
    });

    p_pSocket.on('disconnect', function(){
        g_aUsernames.splice(g_aUsernames.indexOf(p_pSocket.m_szUsername), 1);

        UpdateUserList();
        Broadcast(g_szServerName, p_pSocket.m_szUsername + ' has left.');
    });

    p_pSocket.on('broadcast', function (data) {
        Broadcast(p_pSocket.m_szUsername, data);
    });

});
