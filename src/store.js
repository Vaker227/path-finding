const { createStore } = require("redux");

// 0: nomral
// 1: wall
// 2: checked
// 3: path
// 4: start
// 5: end

const defaultState = {
  map: [],
  selecting: "none",
  selectingValue: 0,
  startBlock: [],
  endBlock: [],
};

const blockReducer = (state, action) => {
  switch (action.type) {
    case "SET_MAP_SIZE":
      const [x, y] = action.data;
      let arr = [];
      for (let i = 0; i < y; i++) {
        let tempArr = [];
        for (let j = 0; j < x; j++) {
          tempArr[j] = 0;
        }
        arr.push(tempArr);
      }
      return Object.assign({}, state, { map: arr });
    case "SET_SELECTING_START":
      return Object.assign({}, state, {
        selecting: "start",
        selectingValue: 4,
      });
    case "SET_SELECTING_END":
      return Object.assign({}, state, { selecting: "end", selectingValue: 5 });
    case "START_SELECTING_WALL":
      return Object.assign({}, state, { selecting: "wall", selectingValue: 1 });
    case "STOP_SELECTING":
      return Object.assign({}, state, { selecting: "none", selectingValue: 0 });
    case "SET_BLOCK_VALUE":
      const newMap = state.map.slice();
      const [bx, by] = action.data.position;
      // neu set wall tren block start haoc end thi skip
      if (
        action.data.value !== 2 ||
        (action.data.value === 2 &&
          newMap[by][bx] !== 4 &&
          newMap[by][bx] !== 5)
      ) {
        newMap[by][bx] = action.data.value;
      }

      // addition neu block la start hoac end
      let addition = {};
      if (action.data.value === 4 || action.data.value === 5) {
        let blockType = action.data.value === 4 ? "startBlock" : "endBlock";
        // neu start hoac end da dc set thi xoa di
        if (state[blockType].length) {
          const [x, y] = state[blockType];
          newMap[y][x] = 0;
        }
        // set block start hoac en
        addition[blockType] = action.data.position;
        // ket thuc phien chon
        addition.selecting = "none";
        addition.selectingValue = 0;
      }

      return Object.assign({}, state, { map: newMap }, addition);
    default:
      return state;
  }
};

const store = createStore(
  blockReducer,
  defaultState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

module.exports = store;
