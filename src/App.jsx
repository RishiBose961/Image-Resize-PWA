import Header from "./components/Header/Header";
import ImageResizer from "./components/ImageResize/ImageResizer";
import { useServiceWorkerUpdater } from "./components/useServiceWorkerUpdater";
import "./App.css";
const App = () => {
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorkerUpdater();
  return (
    <>
      <Header />
      {isUpdateAvailable && (
        <div className="update-popup">
          <p>A new version is available. Refresh now?</p>
          <button onClick={updateServiceWorker}>Refresh</button>
        </div>
      )}
      <div className="mx-auto max-w-7xl">
      <ImageResizer/>
      </div>
     
    </>
  );
};

export default App;
