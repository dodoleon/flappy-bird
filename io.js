/**
 * This function provides an interface with the server. The sever is insecure and trivial,
 * it takes the sent message and passes it to all other clients.
 */
function io(Callback) {
	var ready = false;
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var connection = new WebSocket('ws://10.180.43.151:1337');
	connection.onopen = function () {
		ready = true;
    };
    connection.onmessage = function (message) {
         try {
            Callback(JSON.parse(message.data));
        } catch (e) {
            return;
        }
    };
    connection.onerror = function (e) {
        console.log(e);
    };
    this.send = function(bird,x) {
    	if (!ready) {
    		return;
    	}
     	connection.send(JSON.stringify({name:bird.name,angle:bird.angle, x:x, y:bird.y, speed:bird.body.velocity.y, alive: bird.alive}));
    }
}
