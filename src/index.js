import { parseDOM } from './vdom.js';
import { data, dataIndex, react } from './data.js';
import { events } from './events.js';

function init(querySelector) {
    const root = document.querySelector(querySelector);

    // 1. Create the virtual DOM
    parseDOM(root, 0);

    // 2. Replace all variable calls in the DOM by default values
    for (const variableName of Object.keys(dataIndex)) {
        // react(variableName, dataIndex[]);
        for (const identifier of Object.keys(dataIndex[variableName])) {
            react(variableName, identifier);
        }
    }

    return { data, events };
}

export default init;