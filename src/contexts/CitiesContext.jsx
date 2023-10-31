// check the commented code below to see logic just with useState not useReducer
import {
  createContext,
  useState,
  useEffect,
  useReducer,
  useCallback,
} from "react";

const BASE_URL = "http://localhost:8000";
const CitiesContext = createContext();

// NB: useReducer is an pure function, you cant do api calls
const initalState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };

    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unrecognized  action type");
  }
}

function CitiesProviders({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initalState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "An Error Occurred while fetching cities",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();

        dispatch({ type: "city/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "An Error Occurred while loading city",
        });
      }
    },
    [currentCity.id]
  );

  async function creatCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
      // console.log(data);
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "An Error Occurred while creating city",
      });
    }
  }

  async function handleDeleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "An Error Occurred while deleting city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        creatCity,
        handleDeleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesProviders, CitiesContext };

// import { createContext, useState, useEffect } from "react";

// const BASE_URL = "http://localhost:8000";
// const CitiesContext = createContext();

// function CitiesProviders({ children }) {
//   const [cities, setCities] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentCity, setCurrentCity] = useState("");

//   useEffect(function () {
//     async function fetchCities() {
//       try {
//         setIsLoading(true);
//         const res = await fetch(`${BASE_URL}/cities`);
//         const data = await res.json();
//         setCities(data);
//       } catch (err) {
//         alert("An Error Occurred while loading data");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchCities();
//   }, []);

//   async function getCity(id) {
//     try {
//       setIsLoading(true);
//       const res = await fetch(`${BASE_URL}/cities/${id}`);
//       const data = await res.json();
//       setCurrentCity(data);
//     } catch (err) {
//       alert("An Error Occurred while loading data");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function creatCity(newCity) {
//     try {
//       setIsLoading(true);
//       const res = await fetch(`${BASE_URL}/cities`, {
//         method: "POST",
//         body: JSON.stringify(newCity),
//         headers: {
//           "content-type": "application/json",
//         },
//       });
//       const data = await res.json();
//       setCities((cities) => [...cities, data]);
//       console.log(data);
//     } catch (err) {
//       alert("An Error Occurred while creating city");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function handleDeleteCity(id) {
//     try {
//       setIsLoading(true);
//       await fetch(`${BASE_URL}/cities/${id}`, {
//         method: "DELETE",
//       });
//       setCities((cities) => cities.filter((city) => city.id !== id));
//     } catch (err) {
//       alert("An Error Occurred while deleting city");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <CitiesContext.Provider
//       value={{
//         cities,
//         isLoading,
//         currentCity,
//         getCity,
//         creatCity,
//         handleDeleteCity,
//       }}
//     >
//       {children}
//     </CitiesContext.Provider>
//   );
// }

// export { CitiesProviders, CitiesContext };
