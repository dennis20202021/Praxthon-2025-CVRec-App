const React = require("react");
const ReactDOM = require("react-dom/client");
const App = require("./App").default;

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
} else {
  console.error("Root element not found!");
}