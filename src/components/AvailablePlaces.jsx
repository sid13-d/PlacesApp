import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import {sortPlacesByDistance} from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [fetching, setFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function disp() {
      try {
            setFetching(true);
            const data = await fetchAvailablePlaces();

          navigator.geolocation.getCurrentPosition((position) => {
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
            const sortedPlace = sortPlacesByDistance(data, position.coords.latitude, position.coords.longitude);
            setAvailablePlaces(sortedPlace);
            setFetching(false); 
          });
          
      } catch (error) {
        setError({message: error.message || 'Something went wrong.'});
        setFetching(false); 
      }

      
      console.log(" in disp");
      
      
    }
   
    disp();
  }, []); 

  if(error) {
    return (
      <Error
        title="Error"
        message={error.message}
        onConfirm={() => setError(null)}
      />
    );
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={fetching}
      loadingText="Loading places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
