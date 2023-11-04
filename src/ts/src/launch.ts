#!/usr/bin/env node
import { createInterface } from "readline";

interface Edge {
    from: string;
    to: string;
    weight: number;
};

class Graph {
    edges: Edge[];
    nodes: Set<string>;

    constructor() {
        this.edges = [];
        this.nodes = new Set<string>();
    }

    addEdge(from: string, to: string, weight: number) {
        this.edges.push({ from, to, weight });
        this.nodes.add(from);
        this.nodes.add(to);
    }

    wouldCreateCycle(edge: Edge, currentEdges: Edge[]) {
        let visited: Set<string> = new Set();
        let stack: string[] = [edge.from];

        while (stack.length > 0) {
            let currentNode = stack.pop()!;
            if (currentNode === edge.to) return true;
            visited.add(currentNode);

            for (let e of currentEdges) {
                if (e.from === currentNode && !visited.has(e.to)) {
                    stack.push(e.to);
                } else if (e.to === currentNode && !visited.has(e.from)) {
                    stack.push(e.from);
                }
            }
        }
        return false;
    }

    activateEdges() {
        let result: Edge[] = [];

        // Sort edges by weight
        let sortedEdges = [...this.edges].sort((a, b) => a.weight - b.weight);

        for (let edge of sortedEdges) {
            if (!this.wouldCreateCycle(edge, result)) {
                result.push(edge);
            }
        }

        return result;
    }
}

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

function main(){
    const graph = new Graph();
    let modules: string[] = [];
    let connections: Edge[] = [];
    
    rl.on('line', (line) => {
        if (line.startsWith('CPU: ')) {
            modules = line.split(': ')[1].split(', ').map((modul) => modul.trim());
        } else {
            const parts = line.split(': ');
            const nodes = parts[0].split(' - ');
            const weight = parseInt(parts[1].split('s')[0].trim(), 10);
            graph.addEdge(nodes[0].trim(), nodes[1].trim(), weight)
        }
    });
    
    rl.on('close', () => {
        console.log(graph.activateEdges().map((edge) => `${edge.from} - ${edge.to}`).join('\n'))
    });
}

main();