"use strict";
class SeznamSousedu {
    constructor(options) {
        const { edgeType = 'undirected' } = options || {};
        this.adjacencyList = new Map();
        this.nodes = [];
        this.options = { edgeType };
    }
    addEdge(node1, node2) {
        // Initialize the inner map for node1 if it doesn't exist
        if (!this.adjacencyList.has(node1)) {
            this.adjacencyList.set(node1, new Map());
        }
        // Initialize the inner map for node2 if it doesn't exist
        if (!this.adjacencyList.has(node2)) {
            this.adjacencyList.set(node2, new Map());
        }
        // Increment the count of edge from node1 to node2
        let innerMap1 = this.adjacencyList.get(node1);
        innerMap1.set(node2, (innerMap1.get(node2) || 0) + 1);
        // If the graph is undirected, also increment the count of edge from node2 to node1
        if (this.options.edgeType === 'undirected') {
            let innerMap2 = this.adjacencyList.get(node2);
            innerMap2.set(node1, (innerMap2.get(node1) || 0) + 1);
        }
    }
    addDataRow(data) {
        for (let i = 0; i < data.length - 1; i++) {
            this.addEdge(data[i], data[i + 1]);
        }
    }
    getNodesNeighboursCount(options) {
        const { limit = Infinity, sort = 'desc', direction = 'both' } = options || {};
        const result = [];
        if (direction === 'out' || direction === 'both') {
            for (let [node, neighboursMap] of this.adjacencyList.entries()) {
                let outCount = 0;
                for (let count of neighboursMap.values()) {
                    outCount += count;
                }
                result.push([String(node), outCount]);
            }
        }
        if (direction === 'in' || direction === 'both') {
            const incomingMap = new Map();
            for (let neighboursMap of this.adjacencyList.values()) {
                for (let [neighbour, count] of neighboursMap.entries()) {
                    incomingMap.set(String(neighbour), (incomingMap.get(String(neighbour)) || 0) + count);
                }
            }
            for (let [person, count] of incomingMap.entries()) {
                const existingIndex = result.findIndex(([p]) => p === person);
                if (existingIndex !== -1) {
                    result[existingIndex][1] += count;
                }
                else {
                    result.push([person, count]);
                }
            }
        }
        if (sort === 'desc') {
            return result.sort((a, b) => b[1] - a[1]).slice(0, limit);
        }
        else {
            return result.sort((a, b) => a[1] - b[1]).slice(0, limit);
        }
    }
    getRedundantNodes() {
        const redundantNodes = [];
        for (let city of this.nodes) {
            if (!this.adjacencyList.get(city))
                redundantNodes.push(String(city));
        }
        return redundantNodes;
    }
    getNodesInLoop() {
        const nodesInLoop = [];
        for (const [node, neighbors] of this.adjacencyList) {
            if (neighbors.has(node)) {
                nodesInLoop.push(node);
            }
        }
        return nodesInLoop;
    }
    areAllNodesConnected() {
        for (let node of this.nodes) {
            if (!this.adjacencyList.get(node))
                return false;
            if (this.adjacencyList.get(node).size !== this.nodes.length - 1)
                return false;
        }
        return true;
    }
    // when two nodes are connected in one way, but not in the other
    getMissingDirectionalEdges() {
        const missingEdges = [];
        for (const [node, neighborsMap] of this.adjacencyList.entries()) {
            for (const neighbor of neighborsMap.keys()) {
                if (!this.adjacencyList.get(neighbor).has(node)) {
                    missingEdges.push([neighbor, node]);
                }
            }
        }
        return missingEdges;
    }
    hasNode(node) {
        return this.adjacencyList.has(node);
    }
    hasEdge(node1, node2) {
        var _a;
        return (_a = this.adjacencyList.get(node1)) === null || _a === void 0 ? void 0 : _a.has(node2);
    }
    print() {
        for (const [node, neighborsMap] of this.adjacencyList.entries()) {
            const neighborsList = [];
            for (const [neighbor, count] of neighborsMap.entries()) {
                for (let i = 0; i < count; i++) {
                    neighborsList.push(neighbor);
                }
            }
            if (neighborsList.length > 0)
                console.log(node, '->', neighborsList.join(', '));
        }
    }
}
