# Figue

Figue is an **experimental** frontend micro-framework written in Javascript.

The idea for this project came to my mind after discovering the [Strawberry framework](https://github.com/18alantom/strawberry) and [this conference](https://www.youtube.com/watch?v=85gJMUEcnkc) on the virtual DOM, although I ended up not adding a vDOM to the framework.

Although I've been using frontend frameworks for years (mainly Vue.js, but also React and Angular to some extent), they had always felt like incomprehensible tools. As I was studying their internals, I started to question why these frameworks exist in the first place, and why we can't use native Javascript more often.

I believe these frameworks serve two main purposes:
- A functional purpose: the Web API was not as developed then as it is now. It made sense, at the time, to add the possibility to use components for example. However, nowadays, many of the tools that exist in frontend frameworks like React natively exist in the browser.
- A practical purpose: frameworks impose certain guidelines and help making the codebase more maintainable and understandable. This makes sense as websites can be extremely complex.

The first point, the functional concern, is the one Figue aims to address. By developing Figue, I want to see if there are viable, simpler and lightweight alternatives to today's most famous frameworks.

---

## Advantages of Figue

- Reactive
- No build process, just import the script
- Super lightweight, no dependencies
- No virtual DOM

## Installation

### Using a link

The best way of importing Figue is by simply getting the latest version of the package using unpkg.com, like so:

```
<script src="https://unpkg.com/@tofl/figue@latest/index.js"></script>
```

Note: you **must** wait for your HTML structure to be loaded before calling the script.

### Importing Figue as a package

If your project is an app that is served via an application bundler or a server, you can use npm to install Figue. First, run the install command:
```
$ npm i @tofl/figue
```

Then, import it as a module:
```javascript
<script type="module">
    import '@tofl/figue';
</script>
```

## Usage

### Initialisation

To initialize the app, simply use the `init()` function after importing the framework as shown above. It takes in a CSS selector as its only argument and returns a `data` and `events` object.
```javascript
const { data, events } = init('html');
```

### Adding reactive state

You can declare reactive state and methods by simply adding keys to the `data` object.
```javascript
const { data } = init('html');

data.firstname = 'John';
data.lastname = 'Doe';
```

Then, just call these properties from the template by using curly braces:
```html
<p>Hello, {{ firstname }} {{ lastname }}. Welcome back.</p>
```

### Manage events

It is very easy to handle common events with Figue. Simply append an event handler to the `events` object in the script section and reference the event name as an attribute starting with an `@` (and the event handler as its value) in the template.
```html
<body>
    <h1>Hello, {{ firstname }}</h1>
    <input type="text" @keyup="updateFirstname" />
    
    <script>
        const { data, events } = init('body');
        
        data.firstname = '';
        events.updateFirstname = (event) => {
            data.firstname = event.target.value;
        };
    </script>
</body>
```

As you can see, the `event` object is automatically passed as an argument to the event handler.

Figue supports any event type supported by the `addEventListener()` method, preceded by the `@` symbol.

## Next steps

Although being as simple and light as possible is a requirement for Figue, there is still lots of room for improvement and new functionalities.

- Adding Vue-style refs to quickly and easily reference HTML attributes instead of using `document.querySelector()`.
- Merging the `data` and `events` objects into one object callable with the `_` character, as such:
    ```javascript
    const _ = init('body');

    _.firstname = '';
    _.updateFirstname = (event) => {
        _.firstname = event.target.value;
    };
    ```
- Executing Javascript code within the template, using the `{{ ... }}` syntax.
- Adding conditional rendering and loops within the template.
- Rewriting the framework in Typescript.