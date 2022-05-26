{
  try {
    const {
      coords: { latitude: lat, longitude: lon },
    } = location;
    const location = { lon, lat, distance: 1500 };
    const { data } = await axios.post(
      "https://nearbypharmacyapi.herokuapp.com/google",
      location
    );
    // enter you logic when the fetch is successful
    console.log(data);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)
    console.log(`error: `, error);
  }
}

const fetchData = async () => {
  const {
    coords: { latitude: lat, longitude: lon },
  } = location;
  const data = { lon, lat, distance: 1500 };
  fetch("https://nearbypharmacyapi.herokuapp.com/google", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Something went wrong");
    })
    .then((data) => {
      // setParkings(cities);
      // console.log(cities);
    })
    .catch((error) => {
      console.log(error);
    });
};
