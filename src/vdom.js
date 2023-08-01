import { dataIndex } from './data.js';
import { events } from './events.js';

let nodeId = 0;

function hasVariable(str) {
    return str.indexOf('{{') > -1 && str.indexOf('}}') > -1;
}

function extractVariables(str) {
    const strings = [];
    const args = [];

    const step1 = str.split('{{');

    step1.forEach((s) => {
        let indexBraces = s.indexOf('}}');

        if (indexBraces < 0) {
            strings.push(s);
        } else {
            args.push(s.split('}}')[0].trim());
            strings.push(s.split('}}')[1]);
        }
    });

    return { strings, args };
}

function parseDOM(node) {
    nodeId++;

    // Regular HTML nodes
    if (node.nodeType === 1) {
        // Parse child nodes
        node.childNodes.forEach((child) => {
            if (node.tagName !== 'SCRIPT') {
                parseDOM(child);
            }
        });

        // Parse attribute values
        Object.keys(node.attributes)
            .forEach((attribute) => {
                parseDOM(node.attributes[attribute]);
            });
    }

    // Attributes
    else if (node.nodeType === 2) {
        if (hasVariable(node.textContent)) {
            let dataIdentifier = node.ownerElement.getAttribute('data-identifier');

            if (!dataIdentifier) {
                dataIdentifier = nodeId;
                node.ownerElement.setAttribute('data-identifier', dataIdentifier.toString());
            }

            const { strings, args } = extractVariables(node.textContent);

            args.forEach((variableName) => {
                if (!dataIndex[variableName]) {
                    dataIndex[variableName] = {};
                }
                if (!dataIndex[variableName][dataIdentifier]) {
                    dataIndex[variableName][dataIdentifier] = [];
                }

                dataIndex[variableName][dataIdentifier].push({
                    type: 'attribute',
                    attributeName: node.name,
                    strings,
                    args,
                });
            });
        }

        else if (node.nodeName.charAt(0) === '@') {
            const eventName = node.nodeName.slice(1, node.nodeName.length);
            const eventHandler = node.nodeValue;

            node.ownerElement.addEventListener(eventName, (e) => {
                if (events[eventHandler]) {
                    events[eventHandler](e);
                } else {
                    console.error(`The handler \`${eventHandler}\` does not exist.`)
                }
            });

            node.ownerElement.removeAttribute(node.nodeName);
        }
    }

    // Regular strings
    else if (node.nodeType === 3) {
        const parentElement = node.parentElement;

        parentElement.childNodes.forEach((child, i) => {
            // 1. Analyse all the child nodes, check that they are text and contain variables
            if (child.nodeType === 3 && child.textContent === node.textContent && hasVariable(node.data)) {
                // 2. Extract the strings and variables
                const { strings, args } = extractVariables(node.data);

                // 3. Give the parent node an identifier
                let dataIdentifier = parentElement.getAttribute('data-identifier');
                if (!dataIdentifier) {
                    dataIdentifier = nodeId;
                    parentElement.setAttribute('data-identifier', dataIdentifier.toString());
                }

                // 4. Update the dataIndex
                args.forEach((variableName) => {
                    if (!dataIndex[variableName]) { dataIndex[variableName] = {} }
                    if (!dataIndex[variableName][dataIdentifier]) {
                        dataIndex[variableName][dataIdentifier] = [];
                    }

                    dataIndex[variableName][dataIdentifier].push({
                        type: 'content',
                        values: [
                            {
                                position: i,
                                strings,
                                args,
                            },
                        ],
                    });

                });
            }
        });
    }
}

export { parseDOM };