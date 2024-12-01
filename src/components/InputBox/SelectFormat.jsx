/* eslint-disable react/prop-types */

const SelectFormat = ({ FileName, dimensions, handleChange,images }) => {
  return (
    <div>
      {" "}
      <label
        htmlFor="countries"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {FileName}
      </label>
      <select
        id="countries"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={dimensions}
        onChange={handleChange}
        disabled={images  && 'disabled'}
      >
        <option value="" disabled>
          Choose a {FileName}
        </option>
        <option value="jpeg">JPEG</option>
        <option value="png">PNG</option>
        <option value="webp">WEBP</option>
      </select>
    </div>
  );
};

export default SelectFormat;
