import * as React from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa"
import { AiFillStar } from "react-icons/ai"
import axios from "axios"
import { format } from "timeago.js";
import "./app.css"
import Register from './components/Register';
import Tin from './components/Tin';



function App() {
  const myStorage = window.localStorage;

  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));

  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ latitude: lat, longitude: long, zoom: 6 })
  }

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({
      lat: lat,
      long: lng,
    });
    console.log(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  }

  const [viewport, setViewport] = useState({
    latitude: 28.644800,
    longitude: 77.216721,
    zoom: 6,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err)
      }
    };
    getPins();
  }, [])

  const handleLogout = () => {
    setCurrentUser(null);
    myStorage.removeItem("user");
  };

  return <Map
    mapboxAccessToken={process.env.REACT_APP_MAPBOX}
    initialViewState={{ ...viewport }}
    mapStyle="mapbox://styles/mapbox/streets-v9"
    style={{ width: "100vw", height: "100vh" }}
    onViewportChange={(newViewport) => setViewport(newViewport)}
    onDblClick={handleAddClick}
  >
    {pins.map(p => (
      <>
        <Marker key={p.id} longitude={p.long} latitude={p.lat} anchor="bottom" offsetLeft={-3.5 * viewport.zoom}
          offsetTop={-7 * viewport.zoom}>
          <FaMapMarkerAlt style={{ fontSize: viewport.zoom * 7, cursor: 'pointer', color: p.username === currentUser ? "tomato" : "slateblue" }} onClick={() => handleMarkerClick(p._id, p.lat, p.long)} />
        </Marker>

        {p._id === currentPlaceId && (
          <Popup longitude={p.long} latitude={p.lat}
            anchor="left"
            closeButton={true} closeOnClick={false}
            onClose={() => setCurrentPlaceId(null)}
          >
            <div className="card">
              <label>Place</label>
              <h4 className="place">{p.title}</h4>
              <label>Review</label>
              <p className="desc">{p.desc}</p>
              <label>Rating</label>
              <div className="stars">
                {Array(p.rating).fill(<AiFillStar className="star" />)}
              </div>
              <label>Information</label>
              <span className="username">
                Created by <b>{p.username}</b>
              </span>
              <span className="date">{format(p.createdAt)}</span>

            </div>

          </Popup>
        )}
      </>
    ))}
    {newPlace && (
      <Popup
        longitude={newPlace.long}
        latitude={newPlace.lat}
        anchor="left"
        closeButton={true}
        closeOnClick={false}
        onClose={() => setNewPlace(null)}
      >
        <div>
          <form onSubmit={handleSubmit}>
            <label>Title</label>
            <input placeholder="Enter a title" autoFocus onChange={(e) => setTitle(e.target.value)} />
            <label>Description</label>
            <textarea placeholder="Say us something about this place." onChange={(e) => setDesc(e.target.value)} />
            <label>Rating</label>
            <select onChange={(e) => setStar(e.target.value)} >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <button type="submit" className="submitButton">
              Add Pin
            </button>
          </form>
        </div>
      </Popup>
    )}
    {currentUser ? (<button className='button logout' onClick={handleLogout}>Log out</button>) : (<div className="buttons">
      <button className='button login' onClick={() => setShowLogin(true)}>Login</button>
      <button className='button register' onClick={() => setShowRegister(true)}>Register</button>
    </div>)}

    {showRegister && <Register setShowRegister={setShowRegister} />}
    {showLogin && <Tin setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}

  </Map>;
}

export default App;
