import { parseDOM } from './src/parsing.js';
import { data, dataIndex, react } from './src/data.js';

function init(querySelector) {
    const root = document.querySelector(querySelector);

    // 1. Parse the DOM
    parseDOM(root);

    // 2. Replace all variable calls in the DOM by default values (empty strings at this stage)
    for (const variableName of Object.keys(dataIndex)) {
        for (const identifier of Object.keys(dataIndex[variableName])) {
            react(variableName, identifier);
        }
    }

    return data;
}

window.initFigue = init;