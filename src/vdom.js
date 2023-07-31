import { dataIndex } from './data.js';

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
        // Add child nodes
        node.childNodes.forEach((child) => {
            if (node.tagName !== 'SCRIPT') {
                parseDOM(child, newId);
            }
        });
    }

    // Regular strings
    else if (node.nodeType === 3) {
        // 1. Check that the string contains variables
        if (hasVariable(node.data)) {
            // 2. Parse the string with `extractVariables`
            const { strings, args } = extractVariables(node.data);

            // 3. Generate a unique id and attribute it to the node
            node.parentNode.setAttribute('data-props-identifier', newId);

            // 4. Update the data index
            args.forEach((variableName) => {
                if (!dataIndex[variableName]) {
                    dataIndex[variableName] = {};
                }

                dataIndex[variableName][newId] = { strings, args };
            })
        }
    }
}

export { parseDOM };