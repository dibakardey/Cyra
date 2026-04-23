const eventFeed = document.getElementById('event-feed');
const connectionStatus = document.getElementById('connection-status');
const inspector = document.getElementById('inspector');
const statTotalEvents = document.getElementById('stat-total-events');
const statFileChanges = document.getElementById('stat-file-changes');
const statEditorEdits = document.getElementById('stat-editor-edits');
const clearFeedBtn = document.getElementById('clear-feed');

let totalEvents = 0;
let fileChanges = 0;
let editorEdits = 0;

const socket = new WebSocket('ws://localhost:8080/ws');

socket.onopen = () => {
    connectionStatus.innerHTML = `
        <span class="w-3 h-3 rounded-full bg-green-500 mr-2 status-online"></span>
        Connected
    `;
    connectionStatus.classList.remove('text-red-400');
    connectionStatus.classList.add('text-green-400');
};

socket.onclose = () => {
    connectionStatus.innerHTML = `
        <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
        Disconnected
    `;
    connectionStatus.classList.remove('text-green-400');
    connectionStatus.classList.add('text-red-400');
};

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    addEventToFeed(data);
    updateStats(data);
};

function addEventToFeed(event) {
    if (totalEvents === 0) {
        eventFeed.innerHTML = '';
    }

    const eventEl = document.createElement('div');
    eventEl.className = 'bg-slate-700/50 p-3 rounded border border-slate-600 hover:border-blue-500 cursor-pointer transition-all animate-in fade-in slide-in-from-left-2 duration-300';
    
    const time = new Date(event.timestamp).toLocaleTimeString();
    const typeClass = getEventTypeClass(event.type);
    
    eventEl.innerHTML = `
        <div class="flex justify-between items-start">
            <span class="text-xs font-bold uppercase tracking-wider ${typeClass}">${event.type}</span>
            <span class="text-[10px] text-slate-500">${time}</span>
        </div>
        <div class="text-sm mt-1 truncate text-slate-300">${getEventSummary(event)}</div>
    `;

    eventEl.onclick = () => inspectEvent(event);

    eventFeed.prepend(eventEl);
};

function getEventTypeClass(type) {
    switch (type) {
        case 'FILE_MODIFICATION': return 'text-blue-400';
        case 'EDITOR_CHANGE': return 'text-purple-400';
        case 'TERMINAL_COMMAND': return 'text-amber-400';
        case 'AGENT_INTENT': return 'text-emerald-400';
        case 'TOOL_USAGE': return 'text-pink-400';
        default: return 'text-slate-400';
    }
}

function getEventSummary(event) {
    if (event.type === 'FILE_MODIFICATION') {
        return `${event.payload.action}: ${event.payload.path || event.payload.newPath}`;
    }
    if (event.type === 'EDITOR_CHANGE') {
        return `Edit in ${event.payload.path}`;
    }
    return event.type;
}

function updateStats(event) {
    totalEvents++;
    if (event.type === 'FILE_MODIFICATION') fileChanges++;
    if (event.type === 'EDITOR_CHANGE') editorEdits++;

    statTotalEvents.innerText = totalEvents;
    statFileChanges.innerText = fileChanges;
    statEditorEdits.innerText = editorEdits;
}

function inspectEvent(event) {
    inspector.innerHTML = `
        <div class="space-y-4">
            <div>
                <h3 class="text-blue-400 font-bold mb-1">Metadata</h3>
                <pre class="bg-slate-900 p-2 rounded overflow-x-auto">${JSON.stringify(event.metadata, null, 2)}</pre>
            </div>
            <div>
                <h3 class="text-blue-400 font-bold mb-1">Payload</h3>
                <pre class="bg-slate-900 p-2 rounded overflow-x-auto">${JSON.stringify(event.payload, null, 2)}</pre>
            </div>
            <div>
                <h3 class="text-blue-400 font-bold mb-1">Full Event</h3>
                <pre class="bg-slate-900 p-2 rounded overflow-x-auto">${JSON.stringify(event, null, 2)}</pre>
            </div>
        </div>
    `;
}

clearFeedBtn.onclick = () => {
    eventFeed.innerHTML = '<div class="text-slate-500 text-center mt-10">Waiting for events...</div>';
    totalEvents = 0;
    fileChanges = 0;
    editorEdits = 0;
    statTotalEvents.innerText = '0';
    statFileChanges.innerText = '0';
    statEditorEdits.innerText = '0';
};