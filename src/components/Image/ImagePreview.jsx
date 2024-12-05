/* eslint-disable react/prop-types */
import { Button } from "@nextui-org/react";

export default function ImagePreview({
  image,
  index,
  handleRemoveImage,
  format,
}) {
  return (
    <div className="p-3">
      <img
        className="w-full  rounded-lg h-48 lg:w-48 lg:h-48"
        src={image}
        alt={`Uploaded ${index + 1}`}
        style={{ maxWidth: "200px", display: "block" }}
      />
      <div className=" flex justify-between items-center mt-2">
        <p className="text-tiny  font-semibold">Image {format}</p>
        <Button
          onClick={() => handleRemoveImage(index)}
          className="text-tiny text-white bg-red-500"
          variant="flat"
          color="default"
          radius="lg"
          size="sm"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
