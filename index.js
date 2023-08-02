import { parseDOM } from './src/vdom.js';
import { data, dataIndex, react } from './src/data.js';
import { events } from './src/events.js';

function init(querySelector) {
    const root = document.querySelector(querySelector);

    // 1. Create the virtual DOM
    parseDOM(root);

    // 2. Replace all variable calls in the DOM by default values
    for (const variableName of Object.keys(dataIndex)) {
        // react(variableName, dataIndex[]);
        for (const identifier of Object.keys(dataIndex[variableName])) {
            react(variableName, identifier);
        }
    }

    return { data, events };
}

window.init = init;