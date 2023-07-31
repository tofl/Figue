import { parseDOM } from './vdom.js';
import { data, dataIndex, react } from './data.js';

function init(querySelector) {
    const root = document.querySelector(querySelector);

    // 1. Create the virtual DOM
    parseDOM(root, 0); // TODO return vDOM or not?

    // 2. Replace all variable calls in the DOM by default values
    for (const variableName of Object.keys(dataIndex)) {
        // react(variableName, dataIndex[]);
        for (const identifier of Object.keys(dataIndex[variableName])) {
            react(variableName, identifier);
        }
    }

    return { data };
}

export default init;