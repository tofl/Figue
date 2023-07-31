/*
* {
*   variableName: {
*       identifier1: {
*           strings: ['Hello ', ' ', '!'],
*           args: ['variableName', 'variable2']
*       }
*   },
*   ...
* }
 */
const dataIndex = {};

function react(variableName, nodeIdentifier) {
    const { strings, args } = dataIndex[variableName][nodeIdentifier];

    const element = document.querySelector(`[data-props-identifier="${nodeIdentifier}"]`);

    let innerText = '';
    strings.forEach((str, i) => {
        innerText += strings[i] + (data[args[i]] || '');
    });

    element.innerHTML = innerText; // TODO check if innerHTML is the right attribute
}

const data = new Proxy({}, {
    set(target, property, newValue) {
        target[property] = newValue;

        Object.keys(dataIndex[property])
            .forEach(id => react(property, id));
    }
});

export { react, dataIndex, data };