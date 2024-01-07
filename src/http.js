export async function fetchAvailablePlaces() {
    const response = await fetch('http://localhost:3000/places');
    const data = await response.json();

    if(!response.ok) {
      throw new Error(`${data.status}: ${data.error}`);
    }

    return data.places;

}

export async function fetchUserPlaces() {
    const response = await fetch('http://localhost:3000/user-places');
    const data = await response.json();

    if(!response.ok) {
      throw new Error(`${data.status}: ${data.error}`);
    }

    return data.places;

}

export async function updateUserPlaces(places) {
    const response = await fetch('http://localhost:3000/user-places', {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ places }),
    });
    
    const data = await response.json();
    
    if(!response.ok) {
        throw new Error(`${data.status}: ${data.error}`);
    }
    
    return data.message;
}