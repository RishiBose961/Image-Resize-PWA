/* eslint-disable no-unused-vars */
import { useState } from "react";
import FileDropzone from "../FileDropzone/FileDropzone";
import ImagePreview from "../Image/ImagePreview";
import ImageToDownload from "../Image/ImageToDownload";
import InputBox from "../InputBox/InputBox";
import SelectBox from "../InputBox/SelectBox";
import SelectFormat from "../InputBox/SelectFormat";
import LoadingSkele from "../Loading/LoadingSkele";
import { Button, Spinner } from "@nextui-org/react";

const units = {
  px: 1, // Pixels (default)
  mm: 3.7795275591, // 1 mm = 3.7795 pixels
};
const ImageResizer = () => {
  const [images, setImages] = useState([]);
  const [resizedImages, setResizedImages] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [originalAspectRatios, setOriginalAspectRatios] = useState([]);
  const [formats, setFormats] = useState([]);
  const [unit, setUnit] = useState("px");
  const [size, setSize] = useState(100); // Desired size in KB
  const [outputFormat, setOutputFormat] = useState("jpeg"); // Default output format
  const [loading, setLoading] = useState(false); // Loading state

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const loadedImages = [];
    const aspectRatios = [];
    const detectedFormats = [];
  
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          loadedImages.push(event.target.result);
          aspectRatios.push(img.width / img.height);
          detectedFormats.push(file.type.split("/")[1].toUpperCase());
  
          // Automatically set dimensions for the first image
          if (loadedImages.length === 1) {
            setDimensions({
              width: img.width, // Automatically use the image's width
              height: img.height, // Automatically use the image's height
            });
          }
  
          if (loadedImages.length === files.length) {
            setImages((prevImages) => [...prevImages, ...loadedImages]);
            setOriginalAspectRatios((prevRatios) => [
              ...prevRatios,
              ...aspectRatios,
            ]);
            setFormats((prevFormats) => [...prevFormats, ...detectedFormats]);
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const convertToPixels = (value) => value * units[unit];

  const handleResize = () => {
    if (images.length === 0) return;

    setLoading(true); // Start loading

    const resizedImagesList = images.map((image, index) => {
      const newWidth = convertToPixels(dimensions.width);
      const newHeight = newWidth / originalAspectRatios[index];

      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;

      const img = new Image();
      img.src = image;

      return new Promise((resolve) => {
        img.onload = () => {
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          let resizedImageUrl = "";
          const desiredSize = size * 1024; // Desired size in bytes

          if (outputFormat === "png") {
            // Adjust dimensions iteratively to fit size for PNG
            let tempWidth = newWidth;
            let tempHeight = newHeight;

            while (true) {
              resizedImageUrl = canvas.toDataURL(`image/${outputFormat}`);
              const base64Length =
                resizedImageUrl.length -
                `data:image/${outputFormat};base64,`.length;
              const fileSize = Math.ceil((base64Length * 3) / 4);

              if (
                fileSize <= desiredSize ||
                tempWidth <= 10 ||
                tempHeight <= 10
              ) {
                break;
              }

              // Reduce dimensions
              tempWidth = Math.round(tempWidth * 0.9);
              tempHeight = Math.round(tempHeight * 0.9);
              canvas.width = tempWidth;
              canvas.height = tempHeight;
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }

            resolve(resizedImageUrl);
          } else {
            // For other formats (e.g., JPEG, WEBP), adjust quality
            let minQuality = 0.1;
            let maxQuality = 1.0;
            let finalQuality = 1.0;

            while (minQuality <= maxQuality) {
              const midQuality = (minQuality + maxQuality) / 2;
              const tempImageUrl = canvas.toDataURL(
                `image/${outputFormat}`,
                midQuality
              );
              const base64Length =
                tempImageUrl.length -
                `data:image/${outputFormat};base64,`.length;
              const fileSize = Math.ceil((base64Length * 3) / 4);

              if (fileSize > desiredSize) {
                maxQuality = midQuality - 0.01;
              } else {
                finalQuality = midQuality;
                resizedImageUrl = tempImageUrl;
                minQuality = midQuality + 0.01;
              }
            }

            if (!resizedImageUrl) {
              console.warn(
                "Unable to match the desired file size. Using lowest quality."
              );
              resizedImageUrl = canvas.toDataURL(`image/${outputFormat}`, 0.1);
            }

            resolve(resizedImageUrl);
          }
        };
      });
    });

    Promise.all(resizedImagesList).then((resized) => {
      setResizedImages(resized);
      setLoading(false); // Stop loading
    });
  };
  const handleWidthChange = (width) => {
    setDimensions((prev) => ({
      ...prev,
      width,
      height: Math.round(width / originalAspectRatios[0]),
    }));
  };

  const handleDownload = (resizedImage, index) => {
    const link = document.createElement("a");
    link.href = resizedImage;
    link.download = `resized-image-${index + 1}.${outputFormat}`;
    link.click();
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setOriginalAspectRatios((prev) => prev.filter((_, i) => i !== index));
    setResizedImages((prev) => prev.filter((_, i) => i !== index));
    setFormats((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mx-5">
        <FileDropzone handleImageUpload={handleImageUpload} />

        <div className=" grid grid-cols-2 gap-3">
          <InputBox
            FileName="Width"
            dimensions={dimensions.width}
            images={images.length === 0}
            handleChange={(e) => handleWidthChange(+e.target.value)}
          />
          <InputBox
            FileName="Height"
            dimensions={dimensions.height}
            images={images.length === 0}
            handleChange={(e) => handleWidthChange(+e.target.value)}
          />
          <div className="  col-span-2">
            <div className=" grid grid-cols-3 gap-3">
              <SelectFormat
                FileName="File Format"
                dimensions={outputFormat}
                images={images.length === 0}
                handleChange={(e) => setOutputFormat(e.target.value)}
              />
              <SelectBox
                FileName="Type of File"
                dimensions={unit}
                images={images.length === 0}
                handleChange={(e) => setUnit(e.target.value)}
              />
              <InputBox
                FileName="File Size (KB)"
                dimensions={size}
                images={images.length === 0}
                handleChange={(e) => setSize(+e.target.value)}
              />
            </div>
          </div>
          {images.length === 0 ? (
            ""
          ) : (
            <Button onClick={handleResize} color="primary">
              Resize All
            </Button>
          )}

          {loading && (
            <div className="flex justify-start items-center space-x-2">
              <Spinner />
              <p>Resizing images...</p>
            </div>
          )}
        </div>
      </div>
      <div className="mx-7">
        <h6 className="mb-4 text-4xl mt-5 font-extrabold leading-none tracking-tight text-gray-900  dark:text-white">
          <mark className="px-2 text-white bg-cyan-500 rounded ">Preview</mark>{" "}
          Image
        </h6>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mt-4">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} className="col-span-1">
                <ImagePreview
                  index={index}
                  image={image}
                  format={formats[index]}
                  handleRemoveImage={handleRemoveImage}
                />
              </div>
            ))
          ) : (
            <LoadingSkele />
          )}
        </div>
      </div>

      <div className=" mx-7">
        <h6 className="mb-4 text-4xl mt-5 font-extrabold leading-none tracking-tight text-gray-900  dark:text-white">
          <mark className="px-2 text-white bg-cyan-500 rounded ">Final</mark>{" "}
          Image
        </h6>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mt-4">
          {resizedImages.length > 0 ? (
            resizedImages.map((resizedImage, index) => (
              <div key={index} className="col-span-1">
                <ImageToDownload
                  index={index}
                  format={outputFormat}
                  resizedImage={resizedImage}
                  handleDownload={handleDownload}
                />
              </div>
            ))
          ) : (
            <LoadingSkele />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageResizer;
