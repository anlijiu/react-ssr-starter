import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// ReactDOM.hydrateRoot(global.window.document.getElementById('root') as HTMLElement, <App />);
// ReactDOM.hydrateRoot(document.getElementById('root') as HTMLElement, <App />);
// registerServiceWorker();

const container = document.getElementById("root") as HTMLElement;
if (container.hasChildNodes()) {
    ReactDOM.hydrateRoot(container, <App />);
} else {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
}

if (module.hot) {
  module.hot.accept();
}
