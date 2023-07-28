function createVDOM(node) {
    let vNode;

    // Regular HTML nodes
    if (node.nodeType === 1) {
        vNode = {
            type: 'node',
            tagName: node.tagName,
            attributes: {},
            children: [],
        }

        // Attributes
        Object.keys(node.attributes).forEach((child) => {
            const attribute = node.attributes[child];
            vNode.attributes[attribute.nodeName] = attribute.nodeValue;
        });

        // Add child nodes
        node.childNodes.forEach((child) => {
            vNode.children.push(createVDOM(child));
        });
    }

    // Regular strings
    else if (node.nodeType === 3) {
        vNode = {
            type: 'string',
            content: node.data,
        }
    }

    return vNode;
}

export default createVDOM;