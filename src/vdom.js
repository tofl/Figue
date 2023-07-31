import { dataIndex } from './data.js';
import { events } from './events.js';

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

function parseDOM(node, previousId) {
    const newId = previousId + 1;

    // Regular HTML nodes
    if (node.nodeType === 1) {
        // Get all the event
        const eventAttributes = [];
        Object.keys(node.attributes)
            .forEach((attrId) => {
                const attr = node.attributes[attrId].name;
                if (attr.charAt(0) === '@') {
                    eventAttributes.push(attr);
                }
            });

        // Register the event listener
        eventAttributes.forEach((attr) => {
            const event = attr.slice(1, attr.length);
            const eventHandler = node.getAttribute(attr);

            node.addEventListener(event, () => { events[eventHandler]() });

            // Remove the @event attribute from the node
            node.removeAttribute(attr);
        });

        // Parse child nodes
        node.childNodes.forEach((child) => {
            if (node.tagName !== 'SCRIPT') {
                parseDOM(child, newId);
            }
        });

        // Parse attribute values
        Object.keys(node.attributes)
            .forEach((attribute) => {
                parseDOM(node.attributes[attribute], newId);
            });
    }

    // Attributes
    else if (node.nodeType === 2) {
        if (hasVariable(node.textContent)) {
            const { strings, args } = extractVariables(node.textContent);

            let dataIdentifier = node.ownerElement.getAttribute('data-identifier');

            if (!dataIdentifier) {
                dataIdentifier = newId;
                node.ownerElement.setAttribute('data-identifier', dataIdentifier);
            }

            args.forEach((variableName) => {
                if (!dataIndex[variableName]) {
                    dataIndex[variableName] = {};
                }

                dataIndex[variableName][dataIdentifier] = {
                    type: 'attribute',
                    attributeName: node.name,
                    strings,
                    args,
                };
            });
        }
    }

    // Regular strings
    else if (node.nodeType === 3) {
        // 1. Check that the string contains variables
        if (hasVariable(node.data)) {
            // 2. Parse the string with `extractVariables`
            const { strings, args } = extractVariables(node.data);

            // 3. Pass the parent node a new attribute if necessary
            let dataIdentifier = node.parentNode.getAttribute('data-identifier');

            if (!dataIdentifier) {
                dataIdentifier = newId;
                node.parentNode.setAttribute('data-identifier', dataIdentifier);
            }

            // 4. Update the data index
            args.forEach((variableName) => {
                if (!dataIndex[variableName]) {
                    dataIndex[variableName] = {};
                }

                dataIndex[variableName][dataIdentifier] = {
                    type: 'content',
                    strings,
                    args,
                };
            });
        }
    }
}

export { parseDOM };