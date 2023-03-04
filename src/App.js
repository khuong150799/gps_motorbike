import logo from "./logo.svg";
import "./App.css";
import {
  Autocomplete,
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
const places = ['places']
function App() {
  const [height, setHeight] = useState("500px");
  const containerStyle = {
    width: "100%",
    height: height,
    margin: "10px auto",
  };

  
  const originRef = useRef();
  const destinationRef = useRef();
  const wayRef = useRef();
  const waypointsRef = useRef();
  const radioRef = useRef();
  const pantoRef = useRef();
  const [center, setCenter] = useState({
    lat: 21.0278,
    lng: 105.8342,
  });
  const [map, setMap] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [wayPoints, setWayPoints] = useState([]);
  const [directionsResults, setDirectionsResults] = useState("");
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [path, setPath] = useState([]);
  const [polylinePath, setPolylinePath] = useState([]);
  const [steps, setSteps] = useState(0);
  const [callbackDir, setCallbackDir] = useState(false);

  const [isReview, setIsReview] = useState(false);
  const [position, setPosition] = useState([]);
  const [positionMarker, setPositionMarker] = useState([]);

  const handelChange = (e) => {
    setTravelMode(e.target.value);
  };
  const calcRoute = () => {
    // console.log(waypointsRef);
    setOrigin(originRef.current.value);
    setDestination(destinationRef.current.value);
    console.log(waypointsRef);
    if(waypointsRef.current){
      const wayPoints_ = waypointsRef.current.value.split("-");
      console.log(wayPoints_);
      wayPoints_.forEach((waypoint, i) => {
        const location = { location: waypoint };
        wayPoints_[i] = location;
      });
      console.log(wayPoints_);
      setWayPoints(wayPoints_);
    }
  };
  const directionsCallback = useCallback((response) => {
    console.log(response);
    console.log(callbackDir);
    if (response !== null&& !callbackDir) {
      setCallbackDir(true)
      console.log(wayPoints.length);
      if (response.status === "OK" && wayPoints.length <= 0 ) {
        const output = document.querySelector("#output");
        output.innerHTML =
        "<div class='alert-info'>From: " +
        document.getElementById("from").value +
        ".<br />To: " +
        document.getElementById("to").value +
        ".<br /> Driving distance <i class='fas fa-road'></i> : " +
        response.routes[0].legs[0].distance.text +
        ".<br />Duration <i class='fas fa-hourglass-start'></i> : " +
        response.routes[0].legs[0].duration.text +
        ".</div>";
        setDirectionsResults(response);
        console.log(wayPoints.length);
      }
      if (response.status === "OK" && wayPoints.length > 0) {
        console.log(123);
        const route = response.routes[0];
        const legs = route.legs;
        let path_ = [];
        legs.forEach(function (leg, i) {
          leg.steps.forEach((step) => {
            path_ = [...path_, step];
          });
        });
        let path__ = []
        path_.forEach(path=>{
          path__ = [...path__,...path.path]
        })
        setPath(path__)
        // setPath(path_)
      }
    }
  },[callbackDir,wayPoints]);
  useEffect(()=>{
    console.log(path);
    
    const interval = setInterval(()=>{
      if(steps < path.length){
        console.log(polylinePath);
        setPolylinePath(prev=>[...prev,path[steps]])
        pantoRef.current.panTo(polylinePath[steps])
        console.log(steps);
        setSteps(steps + 10)
        
      }else{
        clearInterval(interval)
      }
    },50)
    return () => clearInterval(interval)
    },[polylinePath,path])
  const handelLoad = (map) => {
    // console.log(map);
    if(map){
      pantoRef.current = map
    }
  };
  const handleDbClickGgMap = (e) => {
   if(e.latLng){
    setPosition(prev => [...prev,e.latLng])
   }
  };
  const onLoadMarker = (marker)=>{
    console.log(marker);
  }
  const handelClickMarket = (e)=>{
    console.log(e);
    setPositionMarker(prev => [...prev,e.latLng])
  }
  const onLoadInfo = (e)=>{
    console.log(e);
  }
  const optionPolyline = {
    strokeColor: "#000000",
    strokeOpacity: 1.0,
    strokeWeight: 4,
  };
 
  const radioChange = (e) => {
    if (e.target.checked) {
      setIsReview(true);
      setHeight("90vh");
    } else {
      setIsReview(false);
      setHeight("500px");
    }
  };

 
   
  const divStyle = {
    background: `white`,
    border: `1px solid #ccc`,
    padding: 15
  }
  
  //onLoad={handelLoad} onCenterChanged={handleCenterChanged}
  return (
    <>
      <LoadScript
        googleMapsApiKey="AIzaSyCjE5nAZ00uqL_EVFRNsUiueeMvk-tmT1c"
        libraries={places}
        
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onDblClick={handleDbClickGgMap} onLoad={handelLoad}  >
          <div className="jumbotron">
            <div className="container-fluid">
              <form className="form-horizontal">
                <div className="form-group">
                  <label htmlFor="from" className="col-xs-2 control-label">
                    <i className="far fa-dot-circle"></i>
                  </label>
                  <div className="col-xs-4">
                    <Autocomplete>
                      <input
                        ref={originRef}
                        type="text"
                        id="from"
                        placeholder="Origin"
                        className="form-control"
                      />
                    </Autocomplete>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="to" className="col-xs-2 control-label">
                    <i className="fas fa-map-marker-alt"></i>
                  </label>
                  <div className="col-xs-4">
                    <Autocomplete>
                      <input
                        ref={destinationRef}
                        type="text"
                        id="to"
                        placeholder="Destination"
                        className="form-control"
                      />
                    </Autocomplete>
                  </div>
                </div>
                <div
                  className="form-group"
                  style={{
                    display: "flex",
                    color: "#000",
                    marginLeft: "180px",
                  }}
                >
                  <input
                    ref={radioRef}
                    type="checkbox"
                    id="radio"
                    className="control-label"
                    style={{ zIndex: 1 }}
                    onChange={radioChange}
                  />
                  <label
                    htmlFor="radio"
                    style={{ zIndex: 1, marginLeft: "30px" }}
                  >
                    Vẽ tuyến đường
                  </label>
                </div>
                {isReview && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "201px",
                    }}
                  >
                    <label htmlFor="to" className="col-xs-2 control-label">
                      Điểm đến trung gian
                    </label>
                    <br />
                    <div
                      className="col-xs-4"
                      style={{
                        marginBottom: "20px",
                      }}
                    >
                      <Autocomplete>
                        <textarea
                          ref={waypointsRef}
                          type="text"
                          id="waypoints"
                          placeholder="Nhập các điểm đến trung gian"
                          className="form-control"
                        />
                      </Autocomplete>
                    </div>
                  </div>
                )}
              </form>

              <div className="col-xs-offset-2 col-xs-4">
                <div className="d-flex">
                  <button className="btn btn-info btn-lg" onClick={calcRoute}>
                    <i className="fas fa-map-signs"></i>
                  </button>

                  {!isReview && (
                    <select
                      onChange={handelChange}
                      name=""
                      ref={wayRef}
                      id="way"
                    >
                      <option value="DRIVING">DRIVING</option>
                      <option value="WALKING">WALKING</option>
                      <option value="BICYCLING">BICYCLING</option>
                      <option value="TRANSIT">TRANSIT</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
          {origin !== "" && destination !== "" && (
            <DirectionsService
              options={{
                origin,
                destination,
                travelMode,
                optimizeWaypoints: true,
                waypoints: wayPoints,
              }}
              callback={directionsCallback}
            />
          )}
          {directionsResults && (
            <DirectionsRenderer options={{ directions: directionsResults }} />
          )}
          {polylinePath.length > 0 && origin !== "" && destination !== "" && (
            
            <Polyline  path={polylinePath} options={optionPolyline} />
        ) 
          }
          {position.length > 0 && position.map((value,i)=>(
            <Marker
            key={i}
            onLoad={onLoadMarker}
            position={value}
            onClick={handelClickMarket}
          />
          ))}
          {positionMarker.length > 0 &&  
         (positionMarker.map((value,i)=>(
          <InfoWindow
          key={i}
          onLoad={onLoadInfo}
          position={value}
        >
          <div style={divStyle}>
           <h1>InfoWindow lat:{i} lng:{i} </h1>
          </div>
        </InfoWindow>
         )))}
        </GoogleMap>
      </LoadScript>
      <div className="container-fluid">
        <div id="output"></div>
      </div>
    </>
  );
}

export default App;
