/* eslint-disable react/prop-types */
import { Button } from "@nextui-org/react";

export default function ImageToDownload({
  resizedImage,
  index,
  handleDownload,
  format
}) {
  return (
    <div className="m-3">
      <div className="p-3">
        <img
          className="w-full  rounded-lg h-48 lg:w-48 lg:h-48"
          src={resizedImage}
          alt={`Resized ${index + 1}`}
        />
    
          <Button
            className="text-tiny text-white bg-blue-500 mt-3"
            variant="flat"
            color="default"
            radius="lg"
            size="sm"
            onClick={() => handleDownload(resizedImage, index)}
          >
            Download Image {index + 1} {format}
          </Button>
       
      </div>
    </div>
  );
}
