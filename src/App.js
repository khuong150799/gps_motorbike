import logo from "./logo.svg";
import "./App.css";
import {
  Autocomplete,
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  LoadScript,
  Polyline,
} from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";

function App() {
  const [height, setHeight] = useState("500px");
  const containerStyle = {
    width: "100%",
    height: height,
    margin: "10px auto",
  };

  const center = {
    lat: -3.745,
    lng: -38.523,
  };
  const originRef = useRef();
  const destinationRef = useRef();
  const wayRef = useRef();
  const radioRef = useRef();
  const intervalRef = useRef();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [wayPoints, setWayPoints] = useState("");
  const [directionsResults, setDirectionsResults] = useState("");
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [path, setPath] = useState([]);
  const [index, setIndex] = useState(0);
  const [steps, setSteps] = useState([]);

  const [isReview, setIsReview] = useState(false);

  const handelChange = (e) => {
    setTravelMode(e.target.value);
  };
  const calcRoute = () => {
    console.log(wayRef);
    setOrigin(originRef.current.value);
    setDestination(destinationRef.current.value);
    const wayPoints = wayRef.current.value.split("-");
    wayPoints.forEach((waypoint, i) => {
      const location = { location: waypoint };
      wayPoints[i] = location;
    });
    setWayPoints(wayPoints);
  };
  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === "OK" && wayPoints.length < 0) {
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
      }
      if (response.status === "OK" && wayPoints.length >= 0) {
        const route = response.routes[0];
        const legs = route.legs;
        let step_ = [];
        legs.forEach(function (leg, i) {
          leg.steps.forEach((step) => {
            step_ = [...step_, step];
          });
        });
        setSteps(step_);
      }
    }
  };
  const handelLoad = () => {};
  useEffect(() => {
    intervalRef.current = setInterval(function () {
      if (index < steps.length) {
        setPath(steps[index].path);
        setIndex(index + 1);
        console.log("index thứ: ", index);
      } else {
        clearInterval(intervalRef.current);
      }
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);
  const optionPolyline = {
    strokeColor: "#00FF00",
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

  return (
    <>
      <LoadScript
        googleMapsApiKey="AIzaSyCjE5nAZ00uqL_EVFRNsUiueeMvk-tmT1c"
        libraries={["places"]}
        onLoad={handelLoad}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
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
                          ref={wayRef}
                          type="text"
                          id="to"
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
          {path.length > 0 && origin !== "" && destination !== "" && (
            <Polyline path={path} options={optionPolyline} />
          )}
        </GoogleMap>
      </LoadScript>
      <div className="container-fluid">
        <div id="output"></div>
      </div>
    </>
  );
}

export default App;
