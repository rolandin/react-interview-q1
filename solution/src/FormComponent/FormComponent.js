import React, { useState, useEffect } from 'react';
import { isNameValid, getLocations } from '../mock-api/apis';
import useDebounce from "../hooks/useDebounce";

const FormComponent = () => {
  const [name, setName] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isNameTaken, setIsNameTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [records, setRecords] = useState([]);

  const debouncedName = useDebounce(name, 300);

  useEffect(() => {
    getLocations().then(setLocations);
  }, []);

  useEffect(() => {
    if (debouncedName) {
      setIsLoading(true);
      /*
        as the validation is a mock fetch right now is possible to actually add a name duplications to the table,
        to avoid that we would have to obviously check agains the local state that we are using to render the list.

        So to see the error mesage type "invalid name" in the name input.

        In a real scenario you would post the new record in a post request, and then update the UI by re-fetching the list again after the post is succeful.
        Using something like react-query or apollo client, you would mutate and then invalidate the list query on success.
      */
      isNameValid(debouncedName).then((isValid) => {
        setIsNameTaken(!isValid);
        setIsLoading(false);
      });
    }
  }, [debouncedName]);

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleClear = () => {
    setName('');
    setSelectedLocation('');
    setIsNameTaken(false);
  };

  const handleAdd = () => {
    if (name && selectedLocation && !isNameTaken) {
      const newRecord = { name, location: selectedLocation };
      setRecords([...records, newRecord]);
      handleClear();
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        Name
      </label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={handleNameChange}
        className={`mt-1 block w-full shadow-sm sm:text-sm border-2 border-gray-300 rounded-md pl-3 ${
          isNameTaken ? 'border-red-500' : ''
        } focus:ring-indigo-500 focus:border-indigo-500`}
        style={{ height: '2.5rem' }}
      />
      {isNameTaken && <p className="text-red-500 text-xs">This name has already been taken</p>}
      {isLoading && <p className="text-gray-500 text-xs">Checking name...</p>}
    </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
         Location
        </label>
        <select
          id="location"
          value={selectedLocation}
          onChange={handleLocationChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          style={{ height: '2.5rem' }}
        >
          <option value="" disabled selected hidden>Select a location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-2 w-full">
        <button onClick={handleClear} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          Clear
        </button>
        <button onClick={handleAdd} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={isNameTaken || !name || !selectedLocation}>
          Add
        </button>
      </div>

      
      {/* Table to display the records */}
        <div className="mt-4">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default FormComponent;
