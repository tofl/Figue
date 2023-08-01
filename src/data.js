/*
* {
*   variableName: {
*       identifier1: {
*           type: 'content',
*           values: [
*               {
*                   position: 0,
*                   strings: ['Hello ', ' ', '!'],
*                   args: ['variableName', 'variable2']
*               }
*           ],
*       },
*       identifier2: {
*           type: 'attribute',
*           attributeName: 'class',
*           strings: ['text-red ', ' ', 'bold'],
*           args: ['variableName', 'variable2']
*       }
*   },
*   ...
* }
 */
const dataIndex = {};

function react(variableName, nodeIdentifier) {
    const nodeData = dataIndex[variableName][nodeIdentifier];

    const element = document.querySelector(`[data-identifier="${nodeIdentifier}"]`);

    if (nodeData.type === 'content') {
        nodeData.values.forEach((childTextNode) => {
            let innerText = '';
            childTextNode.strings.forEach((str, i) => {
                innerText += childTextNode.strings[i] + (data[childTextNode.args[i]] || '');
            });

            element.childNodes[childTextNode.position].textContent = innerText;
        });

    } else if (nodeData.type === 'attribute') {
        const { attributeName, strings, args } = nodeData;

        let innerText = '';
        strings.forEach((str, i) => {
            innerText += strings[i] + (data[args[i]] || '');
        });

        element.setAttribute(attributeName, innerText);
    }
}

const data = new Proxy({}, {
    set(target, property, newValue) {
        target[property] = newValue;

        if (!dataIndex[property]) { return; }

        Object.keys(dataIndex[property])
            .forEach(id => react(property, id));
    }
});

export { react, dataIndex, data };