Module["start"] = Module._start;
Module["update"] = cwrap("update", "", ["string"]);
Module["setState"] = cwrap("setState", "", ["string"]);
Module["getState"] = Module._getState;
Module["end"] = Module._end;

}