"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType["FILE_MODIFICATION"] = "FILE_MODIFICATION";
    EventType["EDITOR_CHANGE"] = "EDITOR_CHANGE";
    EventType["TERMINAL_COMMAND"] = "TERMINAL_COMMAND";
    EventType["AGENT_INTENT"] = "AGENT_INTENT";
    EventType["TOOL_USAGE"] = "TOOL_USAGE";
})(EventType || (exports.EventType = EventType = {}));
