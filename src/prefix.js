var namespace = "";
var chuckCounter = 0;

Module.onRuntimeInitialized = function() {
    // inited response
    postMessage([2001, "Ready"]);
}

Module.callback = function(result) {
    // action response
    postMessage([2002, result]);
}

onmessage = function(e) {
    var [type, data] = e.data;
    switch (type) {
        case 1001:
            Module["wasmBinary"] = data;
            // init wasm
            _init();
            break;
        case 1002:
            namespace = `${(new Date()).getTime()}`;
            chuckCounter = 0;
            Module['start']();
            break;
        case 1003:
            var name = namespace + '_' + (chuckCounter ++);
            var path = '/tmp/' + name;
            Module.FS.createDataFile('/tmp', name, data, true, true, true);
            Module['update'](path);
            Module.FS.unlink(path);
            break;
        case 1004:
            Module['getState']();
            break;
        case 1005:
            Module['setState'](data);
            break;
        case 1010:
            Module['end']();
            break;
    }
}

// init function
function _init() {