Module["start"] = Module._start;
Module["update"] = cwrap("update", "", ["string"]);
Module["restore"] = cwrap("restore", "", ["string"]);
Module["state"] = Module._state;
Module["end"] = Module._end;

}