import React, { useMemo } from "react";
import { connect } from "react-redux";

function Block(props) {
  const handleClick = () => {
    if (props.selecting === "none") {
      return;
    }
    props.setBlockValue(props.pos, props.selectingValue);
  };
  const blockType = useMemo(() => {
    const [x, y] = props.pos;
    const bValue = props.map[y][x];
    switch (bValue) {
      case 5:
        return "end";
      case 4:
        return "start";
      case 3:
        return "path";
      case 2:
        return "checked";
      case 1:
        return "wall";
      default:
        return "";
    }
  }, [props.map, props.pos]);
  return (
    <div
      onClick={handleClick}
      className={`block ${blockType}`}
      title={props.pos[0] + "-" + props.pos[1]}
      style={{
        width: props.size,
        height: props.size,
        backgroundColor: "#e3e3e3",
        margin: props.size / 5,
        fontSize: 10,
        textAlign: "center",
      }}
    >
      {props.pos[0] + "-" + props.pos[1]}
    </div>
  );
}
const BlockSTP = (state) => state;

const BlockDTP = (dispatch) => {
  return {
    setBlockValue: function (position, value) {
      return dispatch({ type: "SET_BLOCK_VALUE", data: { position, value } });
    },
  };
};

const BlockReduxed = connect(BlockSTP, BlockDTP)(Block);

function BlockRow(props) {
  return <div style={{ display: "flex" }}>{props.children}</div>;
}

function MapView(props) {
  const listBlock = useMemo(() => {
    let rows = [];
    for (let i = 0; i < props.height; i++) {
      let cols = [];
      for (let j = 0; j < props.width; j++) {
        cols.push(
          <BlockReduxed key={j + "-" + i} size={props.blockSize} pos={[j, i]} />
        );
      }
      rows.push(<BlockRow key={i}>{cols}</BlockRow>);
    }
    return rows;
  }, [props.width, props.height, props.blockSize]);

  return (
    <div className="map-view">
      <div>{listBlock}</div>
    </div>
  );
}

export default MapView;
