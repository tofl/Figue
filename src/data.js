/*
* {
*   variableName: {
*       identifier1: {
*           type: 'content',
*           strings: ['Hello ', ' ', '!'],
*           args: ['variableName', 'variable2']
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
    const { type, attributeName, strings, args } = dataIndex[variableName][nodeIdentifier];

    const element = document.querySelector(`[data-identifier="${nodeIdentifier}"]`);

    let innerText = '';
    strings.forEach((str, i) => {
        innerText += strings[i] + (data[args[i]] || '');
    });

    if (type === 'content') {
        element.textContent = innerText; // TODO check if innerHTML is the right attribute
    } else if (type === 'attribute') {
        element.setAttribute(attributeName, innerText);
    }
}

const data = new Proxy({}, {
    set(target, property, newValue) {
        target[property] = newValue;

        Object.keys(dataIndex[property])
            .forEach(id => react(property, id));
    }
});

export { react, dataIndex, data };