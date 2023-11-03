"use strict";
class MaticeSousednosti {
    constructor(data) {
        this.nodes = data;
        this.matrix = Array(data.length).fill(0).map(() => Array(data.length).fill(0));
    }
    addEdge(node1, node2) {
        const index1 = this.nodes.indexOf(node1);
        const index2 = this.nodes.indexOf(node2);
        if (index1 === -1 || index2 === -1) {
            throw new Error("City not found in the list.");
        }
        this.matrix[index1][index2] += 1;
    }
    addDataRow(data) {
        for (let i = 0; i < data.length - 1; i++) {
            this.addEdge(data[i], data[i + 1]);
        }
    }
    getRedundantEdges() {
        const redundantEdges = [];
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                if (this.matrix[i][j] > 1) {
                    redundantEdges.push(`${this.nodes[i]} -> ${this.nodes[j]}`);
                }
            }
        }
        return redundantEdges;
    }
    getNodes() {
        return this.nodes;
    }
}
