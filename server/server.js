// From the root directory, type: "node server/server" to start the simple static server on port 8080
(function() {
    'use strict';

    var file = new(require('node-static').Server)('./public');

    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            file.serve(request, response);
        });
    }).listen(8080);

})();