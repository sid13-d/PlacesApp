import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { fetchUserPlaces, updateUserPlaces } from './http.js';
import Error from './components/Error.jsx';

function App() {
  const selectedPlace = useRef();

  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);


  const [userPlaces, setUserPlaces] = useState([]);
  const [errorUpdating, setErrorUpdating] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    setFetching(true);
    async function disp() {
      try {
        
        const places = await fetchUserPlaces();
         setUserPlaces(places);
      } catch (error) {
        setError({ message: error.message || 'Something went wrong.'})
      }
      setFetching(false);
    }
    disp();
  }, []);


  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdating({ message: error.message || 'Something went wrong.'})
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try {
      
      await updateUserPlaces(userPlaces.filter((place) => place.id !== selectedPlace.current.id))
    } catch (error) {
        setUserPlaces(userPlaces);
        setErrorUpdating({ message: error.message || 'failed to delete place.'})
    }

    setModalIsOpen(false);
  }, [userPlaces]);

  return (
    <>
      <Modal open={errorUpdating} onClose={() => setErrorUpdating(null)}>
        {errorUpdating && (<Error title="Error" message={errorUpdating.message} onConfirm={() => setErrorUpdating(null)}/>)}

      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && (<Error title="Error" message={error.message} onConfirm={() => setError(null)}/>)}
        {!error && (<Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          isLoading={fetching}
          loadingText="Loading places..."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />)}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
