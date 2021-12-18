import { useState } from "react";
import { connect } from "react-redux";

import MapView from "./map-view.jsx";
import "./App.css";
import { findPath, stopFind, resumeFind } from "./path-finding";

function App(props) {
  const [numWidth, setNumWidth] = useState("20");
  const [numHeight, setNumHeight] = useState("10");
  const [blockSize, setBlockSize] = useState("30");
  const [isFinding, setIsFinding] = useState(false);

  const [isRenderMap, setIsRenderMap] = useState(false);

  const handleWidth = (e) => {
    if (isRenderMap) {
      setIsRenderMap(false);
    }
    setNumWidth(e.target.value);
  };
  const handleHeight = (e) => {
    if (isRenderMap) {
      setIsRenderMap(false);
    }
    setNumHeight(e.target.value);
  };
  const handleSize = (e) => {
    if (isRenderMap) {
      setIsRenderMap(false);
    }
    setBlockSize(e.target.value);
  };
  const handleFindPath = () => {
    if (props.map.length && props.startBlock.length && props.endBlock.length) {
      findPath();
      setIsFinding(true);
    }
  };
  const handleStopFind = () => {
    if (isFinding) {
      stopFind();
      setIsFinding(false);
    }
  };
  const handleResumeFind = () => {
    resumeFind();
    // if (!isFinding) {
    //   setIsFinding(true);
    // }
  };
  const handleRenderMap = () => {
    if (!numWidth || !numHeight) {
      return;
    }
    props.setMapSize([numWidth, numHeight]);
    setIsRenderMap(true);
  };
  return (
    <div className="containter">
      <div className="setting-container">
        <div>
          <div>
            <label htmlFor="width-num">
              Number block horizontal:
              <input
                type="text"
                id="width-num"
                value={numWidth}
                onChange={handleWidth}
              />
            </label>
          </div>
          <div>
            <label htmlFor="width-height">
              Number block vertical:
              <input
                type="text"
                id="width-height"
                value={numHeight}
                onChange={handleHeight}
              />
            </label>
          </div>
          <div>
            <label htmlFor="block-size">
              Block size:
              <input
                type="text"
                id="block-size"
                value={blockSize}
                onChange={handleSize}
              />
            </label>
          </div>
          <button onClick={handleRenderMap}>Render Map</button>
        </div>
        <div>
          Selecting: <b>{props.selecting}</b>
          <div style={{ marginTop: 30 }}>
            <button onClick={handleFindPath}>Find</button>
            <button onClick={handleStopFind}>Stop</button>
            <button onClick={handleResumeFind}>Resume</button>
          </div>
        </div>
        <div>
          <div>
            <button onClick={() => props.selectStart()}>Select Start</button>
            <button onClick={() => props.selectEnd()}>Select End</button>
            <button onClick={() => props.selectWall()}>Select Wall</button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 10,
            }}
          >
            <span className="block start">Start</span>
            <span className="block end">End</span>
            <span className="block wall">Wall</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 10,
            }}
          >
            <span className="block" style={{ backGroundColor: "e3e3e3" }}>
              Idle
            </span>
            <span className="block path">Path</span>
            <span className="block checked">Checked</span>
          </div>
        </div>
      </div>
      {isRenderMap && (
        <MapView
          width={parseInt(numWidth)}
          height={parseInt(numHeight)}
          blockSize={parseInt(blockSize)}
        />
      )}
    </div>
  );
}

const AppSTP = (state) => {
  return state;
};

const AppDTP = (dispatch) => {
  return {
    setMapSize: function (data) {
      return dispatch({ type: "SET_MAP_SIZE", data: data });
    },
    selectStart: function () {
      return dispatch({ type: "SET_SELECTING_START" });
    },
    selectEnd: function () {
      return dispatch({ type: "SET_SELECTING_END" });
    },
    selectWall: function () {
      return dispatch({ type: "START_SELECTING_WALL" });
    },
  };
};
const AppReduxed = connect(AppSTP, AppDTP)(App);

export default AppReduxed;
