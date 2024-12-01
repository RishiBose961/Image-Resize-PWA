import Header from "./components/Header/Header";
import ImageResizer from "./components/ImageResize/ImageResizer";

const App = () => {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl">
      <ImageResizer/>
      </div>
     
    </>
  );
};

export default App;
