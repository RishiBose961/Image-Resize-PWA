import Header from "./components/Header/Header";
import ImageResizer from "./components/ImageResize/ImageResizer";
import { useServiceWorkerUpdater } from "./components/useServiceWorkerUpdater";
import "./App.css";
const App = () => {
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorkerUpdater();
  return (
    <>
      <Header />
      <hr className="mb-6"/>
      {isUpdateAvailable && (
        <div className="update-popup">
          <p>A new version is available. Update now?</p>
          <button onClick={updateServiceWorker}>Update</button>
        </div>
      )}
      <div className="mx-auto max-w-7xl mb-10">
        <ImageResizer />
      </div>
    </>
  );
};

export default App;
