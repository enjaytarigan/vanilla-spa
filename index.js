const linkHome = document.getElementById("link-home");
const linkAbout = document.getElementById("link-about");
const root = document.getElementById("root");

let state = {
    count: 0,
    message: localStorage.getItem("message"),
    hash: "#home",
};

function setState(newState) {
    const prev = structuredClone(state);
    const next = newState;

    state = newState;
    render();

    onStateChange(prev, next);
}

function onStateChange(prev, next) {
    if (prev.message !== next.message) {
        localStorage.setItem("message", next.message);
    }

    if (prev.hash !== next.hash) {
        history.pushState(null, "", next.hash);
    }
}

function TextInput(props) {
    const input = document.createElement("input");

    input.value = props.value;
    input.oninput = props.handleChange;
    input.id = props.id;
    input.type = "text";

    return input;
}

function Button(props) {
    const btn = document.createElement("button");

    btn.textContent = props.label;
    btn.onclick = props.handleClick;

    return btn;
}

function Link(props) {
    const linkElement = document.createElement("a");

    linkElement.textContent = props.label;
    linkElement.href = props.href;
    linkElement.onclick = function (e) {
        const url = new URL(e.target.href);
        setState({ ...state, hash: url.hash });
    };

    return linkElement;
}

function HomePage() {
    const nav = NavBar();
    const div = document.createElement("div");
    div.append(nav);

    const h1 = document.createElement("h1");
    h1.textContent = "Welcome to Vanilla SPA";

    const textCounter = document.createElement("p");
    textCounter.textContent = state.count;

    const buttonIncrement = Button({
        label: "Increment",
        handleClick: function handleIncrement() {
            setState({ ...state, count: state.count + 1 });
        },
    });

    const buttonDecrement = Button({
        label: "Decrement",
        handleClick: function handleDecremet() {
            setState({ ...state, count: state.count - 1 });
        },
    });

    div.append(h1);
    div.append(textCounter);
    div.append(buttonIncrement);
    div.append(buttonDecrement);

    return div;
}

function AboutPage() {
    const backToHome = Link({
        label: "Back to Home",
        href: "#home",
    });
    const div = document.createElement("div");

    const h1 = document.createElement("h1");
    h1.textContent = "About Me";

    const p = document.createElement("p");
    p.textContent = "Send me a message";

    const buttonSendMessage = Button({
        label: "Send",
        handleClick: function () {
            setState({ ...state, message: "" });
            alert("Thank you. Please wait for the response");
        },
    });

    const inputMessage = TextInput({
        value: state.message,
        id: "input_message",
        handleChange: function handleInputMessageChange(e) {
            setState({ ...state, message: e.target.value });
        },
    });

    div.append(backToHome);
    div.append(h1);
    div.append(p);
    div.append(inputMessage);
    div.append(buttonSendMessage);

    return div;
}

function NavBar() {
    const navItems = [
        { href: "#home", label: "Home" },
        { href: "#about", label: "About" },
    ];

    const navAnchors = navItems.map((item) => {
        return Link({
            label: item.label,
            href: item.href,
        });
    });

    const div = document.createElement("div");

    div.append(...navAnchors);

    return div;
}

function App() {
    const homePage = HomePage();
    const aboutPage = AboutPage();

    if (state.hash == "#about") {
        return aboutPage;
    } else if (state.hash == "#home") {
        return homePage;
    }

    return homePage; // Default
}

function handleRefocus(focusedElementId, selectionStart, selectionEnd) {
    if (document.getElementById(focusedElementId)) {
        const doc = document.getElementById(focusedElementId);

        doc.focus();
        doc.selectionStart = selectionStart;
        doc.selectionEnd = selectionEnd;
    }
}

function render() {
    const root = document.getElementById("root");
    const app = App();

    const focusedElement = document.activeElement.id;
    const focusedStart = document.activeElement.selectionStart;
    const focusedEnd = document.activeElement.selectionEnd;

    root.innerHTML = "";
    root.append(app);

    handleRefocus(focusedElement, focusedStart, focusedEnd);
}

render();
