const store = require("./store");

class ANode {
  constructor([x, y]) {
    this.x = x;
    this.y = y;
  }
  findH([targetX, targetY]) {
    this.h = Math.abs(this.x - targetX) + Math.abs(this.y - targetY);
  }
  findG(pNode) {
    this.p = pNode;
    this.g = pNode.g + 1;
  }
  getF() {
    return this.h + this.g;
  }
  getPosition() {
    return [this.x, this.y];
  }
  getChildren() {
    const bot = new ANode([this.x, this.y + 1]);
    bot.findG(this);
    const right = new ANode([this.x + 1, this.y]);
    right.findG(this);
    const top = new ANode([this.x, this.y - 1]);
    top.findG(this);
    const left = new ANode([this.x - 1, this.y]);
    left.findG(this);
    return { bot, right, top, left };
  }
}

class AQueue {
  constructor() {
    this.list = [];
  }
  add(node) {
    let l = this.list.length;
    let i = 0;
    while (i < l && node.getF() > this.list[i].getF()) {
      i++;
    }
    this.list.splice(i, 0, node);
  }
  getTop() {
    const top = this.list.shift();
    // console.log(top);
    // console.log(this.list);
    return top;
  }
  getIndex([x, y]) {
    const result = linerSearch(this.list, [x, y]);
    return result;
  }
}

function binarySearch(arr, l, r, [x, y]) {
  if (r >= l) {
    let mid = Math.floor((l + r) / 2);
    if (arr[mid].x === x) {
      if (arr[mid].y === y) {
        return mid;
      }
      if (arr[mid].y > y) {
        return binarySearch(arr, l, mid - 1, [x, y]);
      }
      if (arr[mid] < y) {
        return binarySearch(arr, mid + 1, r, [x, y]);
      }
    }
    if (arr[mid].x > x) {
      return binarySearch(arr, l, mid - 1, [x, y]);
    }
    if (arr[mid].x < x) {
      return binarySearch(arr, mid + 1, r, [x, y]);
    }
  }
  return -1;
}

function linerSearch(arr, [x, y]) {
  let l = arr.length;
  for (let i = 0; i < l; i++) {
    if (arr[i].x === x && arr[i].y === y) {
      return i;
    }
  }
  return -1;
}

const setBlockValue = (position, value) => {
  store.dispatch({ type: "SET_BLOCK_VALUE", data: { position, value } });
};

class AMoved {
  constructor() {
    this.list = [];
  }
  add(node) {
    let l = this.list.length;
    let i = 0;
    while (i < l && node.x >= this.list[i].x) {
      if (node.x === this.list[i].x && node.y < this.list[i].y) {
        break;
      }
      i++;
    }
    this.list.splice(i, 0, node);
    setBlockValue([node.x, node.y], 2);
    // console.log(node);
  }
  getIndex([x, y]) {
    // const result = binarySearch(this.list, 0, this.list.length - 1, [x, y]);
    return linerSearch(this.list, [x, y]);
  }
}

class PathFinding {
  constructor(map, start, end) {
    this.map = map;
    this.maxH = map[0].length;
    this.maxV = map.length;
    this.start = start;
    this.end = end;
    this.queue = new AQueue();
    this.movedList = new AMoved();
    this.isStop = false;
  }
  stop() {
    this.isStop = true;
  }
  resume() {
    // this.isStop = false;
    // this.spawnNodes(this.queue.getTop());
    const next = this.queue.getTop();
    const index = this.movedList.getIndex(next.getPosition());
    if (index < 0) {
      this.movedList.add(next);
      this.spawnNodes(next);
    } else {
      console.log("trung");
      if (next.g < this.movedList.list[index].g) {
        console.log("thay the");
        this.movedList.list[index] = next;
      }
      this.resume();
    }
  }
  isNodeEnd(root) {
    const [x, y] = this.end;
    return root.x === x && root.y === y;
  }
  async spawnNodes(root) {
    if (this.isNodeEnd(root)) {
      console.log("end");
      let path = [];
      let curr = root;
      while (curr) {
        path.unshift(curr);
        curr = curr.p;
      }
      console.log(path);
      while (path.length) {
        setBlockValue(path[0].getPosition(), 3);
        console.log(path[0]);
        path.shift();
      }
      return;
    }

    const { bot, right, top, left } = root.getChildren();

    //bot
    if (bot.y < this.maxV && this.map[bot.y][bot.x] !== 1) {
      // const index = this.movedList.getIndex(bot.getPosition());
      // if (index < 0) {
      bot.findH(this.end);
      this.queue.add(bot);
      // } else {
      //   console.log("trung bot");
      //   if (bot.g < this.movedList.list[index].g) {
      //     console.log("merge bot");
      //     this.movedList.list[index] = bot;
      //   }
      // }
    }
    //right
    if (right.x < this.maxH && this.map[right.y][right.x] !== 1) {
      // const index = this.movedList.getIndex(right.getPosition());
      // if (index < 0) {
      right.findH(this.end);
      this.queue.add(right);
      // } else {
      //   console.log("trung right");
      //   if (right.g < this.movedList.list[index].g) {
      //     console.log("merge right");
      //     this.movedList.list[index] = right;
      //   }
      // }
    }
    //top
    if (top.y >= 0 && this.map[top.y][top.x] !== 1) {
      // const index = this.movedList.getIndex(top.getPosition());
      // if (index < 0) {
      top.findH(this.end);
      this.queue.add(top);
      // } else {
      //   console.log("trung top");

      //   if (top.g < this.movedList.list[index].g) {
      //     console.log("merge top");

      //     this.movedList.list[index] = top;
      //   }
      // }
    }
    //left
    if (left.x >= 0 && this.map[left.y][left.x] !== 1) {
      // const index = this.movedList.getIndex(left.getPosition());

      // if (index < 0) {
      left.findH(this.end);
      this.queue.add(left);
      // } else {
      //   console.log("trung left");

      //   if (left.g < this.movedList.list[index].g) {
      //     console.log("merge left");

      //     this.movedList.list[index] = left;
      //   }
      // }
    }
    // if (this.isStop) {
    //   return;
    // }
    if (this.queue.list.length === 0) {
      console.log("no queue");
      return;
    }
    // console.log(this.movedList.list);
    // console.log(this.queue.list);
    // start next node

    setTimeout(() => {
      this.resume();
    }, 500);
  }
  startFinding() {
    console.log("start finding");
    const [x, y] = this.start;
    const rootNode = new ANode([x, y]);
    rootNode.findH(this.end);
    rootNode.g = 0;
    this.movedList.add(rootNode);
    this.queue.add(rootNode);
    this.spawnNodes(this.queue.getTop());
  }
}

let pathFinding;
module.exports.findPath = function () {
  const { startBlock, endBlock, map } = store.getState();

  pathFinding = new PathFinding(map, startBlock, endBlock);
  pathFinding.startFinding();
};

module.exports.stopFind = function () {
  pathFinding.stop();
};
module.exports.resumeFind = function () {
  console.log("resume");
  pathFinding.resume();
};
