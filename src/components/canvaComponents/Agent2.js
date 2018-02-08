import AgentComponent from "./AgentComponent";

class Agent2 extends AgentComponent
{
    constructor(props) {
        super(props);
        this.memorySize = 0;
        this.memoryConnection = 0;
        this.lastState = null;
        this.bestValue = null;
        this.explored = [];
    }

    alreadyExplored(coord) {
        for (var i in this.explored) {
            if (this.explored[i].x === coord.x && this.explored[i].y === coord.y) {
                return true;
            }
        }
        return false;
    }

    bestNodeMemory() {
        for (var i in this.memory) {
            if (this.memory[i].value === this.bestValue) {
                return i;
            }
        }
        return null;
    }

    displayMemory() {
        var text = "";
        for (var i in this.memory) {
            text +=this.memory[i].nodeNumber;
            text += " (" + i + ") - ";
            for (var j in this.memory[i].childs) {
                text += "(" + this.memory[this.memory[i].childs[j]].nodeNumber + ")/";
            }
            text += "<br/>";
        }
        return text;
    }

    searchNodeInGrid(node, grid) {
        for (var i in grid) {
            for (var j in grid[i]) {
                if (grid[i][j] === node)
                    return {"x": j, "y": i};
            }
        }
        return false;
    }

    updateMemory(action, result) {
        var state = action + ":" + result;
        if (!this.memory[state]) {
            this.memory[state] = {'name': state,
                'nodeNumber': this.memorySize,
                'action': action,
                'value': result,
                'childs': []};
            this.memorySize++;
        } else if (this.lastState !== null) {
            //on met a jours le souvenir du resultat de l'action précendente
            for (var i in this.memory[this.lastState].childs) {
                var oldNodeState = this.memory[this.lastState].childs[i];
                if (this.memory[oldNodeState].action === action) {
                    this.memory[this.lastState].childs.splice(i, 1);
                    this.memoryConnection--;
                }
            }
            if (this.memory[this.lastState].childs.indexOf(state) === -1) {
                this.memory[this.lastState].childs.push(state);
                this.memoryConnection++;
            }
        }
        this.score += result;
        this.lastState = state;
        if (result > this.bestValue) {
            this.bestValue = result;
        }
        document.getElementById("info").innerHTML = "Score : " + this.score + ", Taille memoire : " + this.memorySize + ", nombre Connection :" + this.memoryConnection;
        document.getElementById("info").innerHTML += "<br/>" + this.displayMemory();
    }

    choosBestAction() {
        var randomAction = this.randomAction();
        if (randomAction) {
            console.log("action  debut");
            return randomAction;
        } else {
            var visitedNode = [];
            var exploredNode = [];
            var bestNode = this.bestNodeMemory();
            var currentState = this.lastState;
            var scoresValues = [];
            exploredNode.push(currentState);
            visitedNode.push(currentState);
            var nbrExplored = 1;
            var currentLevel = 1;
            scoresValues[currentState] = {'score': this.memory[currentState].value,
                'node': currentState,
                'currentLevel': currentLevel,
                'parent': null
            };
            var bestCurrentState = this.memory[currentState].value;
            var bestCurrentStateNode = currentState;
            //console.log("start "+this.lastState+" --- search "+bestNode);
            while (exploredNode.indexOf(bestNode) === -1 && exploredNode.length > 0 && currentLevel > 0) {
                //console.log("visited node "+ this.memory[currentState].action+" : "+ scoresValues[currentState].score +", "+currentState);
                var parentScore = this.calculeScoreWay(this.lastState, currentState, scoresValues);
                nbrExplored = 0;
                var heuristique = this.listAction.length * -1 + currentLevel * 2;
                for (var i in this.memory[currentState].childs) {
                    i = this.memory[currentState].childs[i];
                    if (visitedNode.indexOf(i) === -1) {
                        if (exploredNode.indexOf(i) === -1) {
                            if (this.memory[i].value > bestCurrentState) {
                                bestCurrentState = this.memory[i].value;
                                bestCurrentStateNode = i;
                            }

                            nbrExplored++;
                            exploredNode.push(i);
                            scoresValues[i] = {'score': this.memory[i].value + parentScore + heuristique,
                                'node': i,
                                'parent': currentState,
                                'currentLevel': currentLevel
                            };
                        } else if (scoresValues[i] && i !== currentState) {
                            if (scoresValues[i].score < this.memory[i].value + parentScore + heuristique) {
                                scoresValues[i].score = this.memory[i].value + parentScore + heuristique;
                                scoresValues[i].node = i;
                                scoresValues[i].parent = currentState;
                            }
                        }
                        //console.log("explored node "+this.memory[i].action+" : "+ scoresValues[i].score)
                    }
                }
                if (nbrExplored === 0)
                    currentLevel--;
                visitedNode.push(currentState);
                var selectNextNodeToExplore = null;
                var parcourValue = -10000000;
                for (var j in scoresValues) {
                    if (scoresValues[j].score > parcourValue && visitedNode.indexOf(j) === -1 && scoresValues[j].currentLevel === currentLevel) {
                        parcourValue = scoresValues[j].score;
                        selectNextNodeToExplore = [];
                        selectNextNodeToExplore.push(j);
                    } else if (scoresValues[j].score === parcourValue && visitedNode.indexOf(j) === -1 && scoresValues[j].currentLevel === currentLevel) {
                        selectNextNodeToExplore.push(j);
                    }
                }
                //console.log("scorestabs", scoresValues);
                if (selectNextNodeToExplore !== null) {
                    currentState = selectNextNodeToExplore[Math.floor(Math.random() * selectNextNodeToExplore.length)];
                    //console.log("select next node to explore",currentState);
                    currentLevel++;
                }
            }
            //console.log(scoresValues);
            if (currentState === bestNode) {
                //console.log("best find");
                var bestNextNode = this.searchBestWay(this.lastState, bestNode, scoresValues);
                return this.memory[bestNextNode].action;
            } else {
                console.log("best not find " + bestNode);
                return this.memory[currentState].action;
            }
        }
    }

    heuristique(node) {
        switch(node){
         case "turnLeft:"+document.getElementById("turnLeftValue").value:
         return parseInt(document.getElementById("turnLeftValue").value);
         case "turnRight:"+document.getElementById("turnRightValue").value:
         return parseInt(document.getElementById("turnRightValue").value);
         case "touchForward:"+document.getElementById("touchForwardEmptyValue").value:
         return parseInt(document.getElementById("touchForwardEmptyValue").value);
         case "touchLeft:"+document.getElementById("touchLeftEmptyValue").value:
         return parseInt(document.getElementById("touchLeftEmptyValue").value)+parseInt(document.getElementById("turnLeftValue").value);
         case "touchRight:"+document.getElementById("touchRightEmptyValue").value:
         return parseInt(document.getElementById("touchRightEmptyValue").value)+parseInt(document.getElementById("turnRightValue").value);
         case "touchForward:"+document.getElementById("touchForwardValue").value:
         return parseInt(document.getElementById("touchForwardValue").value)+parseInt(document.getElementById("touchRightValue").value)+parseInt(document.getElementById("turnRightValue").value);
         case "touchLeft:"+document.getElementById("touchLeftValue").value:
         return parseInt(document.getElementById("touchLeftValue").value)+parseInt(document.getElementById("turnRightValue").value);
         case "touchRight:"+document.getElementById("touchRightValue").value:
         return parseInt(document.getElementById("touchRightValue").value)+parseInt(document.getElementById("turnLeftValue").value);
         case "forward:"+document.getElementById("collisionValue").value:
         return parseInt(document.getElementById("collisionValue").value)+parseInt(document.getElementById("touchRightValue").value)+parseInt(document.getElementById("turnRightValue").value);
         case "forward:"+document.getElementById("forwardValue").value:
         return 0;
        }
    }

    calculeScoreWay = function (start, node, tab) {
        if (start === node) {
            return 0;
        } else {
            return this.memory[node].value + this.calculeScoreWay(start, tab[node].parent, tab);
        }
    }

    searchBestWay = function (start, node, tab) {
        if (node === null)
            return start;
        else if (!tab[node])
            return node;
        else if (start === tab[node].parent) {
            return node;
        } else {
            return  this.searchBestWay(start, tab[node].parent, tab);
        }
    }

    randomAction = function () {
        if (this.memorySize < 1) {
            return this.listAction[Math.floor(Math.random() * this.listAction.length)];
        } else if (this.memory[this.lastState].childs.length < this.listAction.length) {
            var lastAction = this.memory[this.lastState].action;
            var tempListAction = this.listAction.slice();
            do {
                var findAction = false;
                var action = tempListAction[Math.floor(Math.random() * tempListAction.length)];
                for (var i in this.memory[this.lastState].childs) {
                    i = this.memory[this.lastState].childs[i];
                    if (tempListAction.indexOf(this.memory[i].action) !== -1) {
                        findAction = true;
                        tempListAction.splice(tempListAction.indexOf(this.memory[i].action), 1);
                    }
                }
            } while (tempListAction.length > 0 && findAction);
            return action;
        }
        return false;
    }
}

export default Agent2;