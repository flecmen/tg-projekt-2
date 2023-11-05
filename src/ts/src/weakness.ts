#!/usr/bin/env node
import { createInterface } from "readline";

interface graphOptions{ 
    edgeType?: 'oriented' | 'unoriented' 
}

class SeznamSousedu {
    adjacencyList: Map<string, string[]>;
    options: graphOptions

    constructor(options?: graphOptions) {
        const { edgeType = 'unoriented' } = options || {};
        
        this.adjacencyList = new Map();
        this.options = { edgeType };
    }

    addEdge(from: string, to: string) {
        if (!this.adjacencyList.has(from)) {
            this.adjacencyList.set(from, []);
        }
        if (!this.adjacencyList.has(to)) {
            this.adjacencyList.set(to, []);
        }
    
        this.adjacencyList.get(from)!.push(to);
        if (this.options.edgeType === 'unoriented') {
            this.adjacencyList.get(to)!.push(from);
        }
    }
}

function findBridges(graph: SeznamSousedu): [string, string][] {
    let bridges: [string, string][] = [];
    let visited: Set<string> = new Set();
    let disc: Map<string, number> = new Map();
    let low: Map<string, number> = new Map();
    let parent: Map<string, string | null> = new Map();
    let time = 0;

    const dfs = (node: string) => {
        visited.add(node);
        disc.set(node, time);
        low.set(node, time);
        time++;

        for (let neighbor of graph.adjacencyList.get(node)!) {
            if (!visited.has(neighbor)) {

                parent.set(neighbor, node);
                dfs(neighbor);

                // Update low value
                low.set(node, Math.min(low.get(node)!, disc.get(neighbor)!));

                // Check for a bridge
                if (disc.get(node)! > low.get(neighbor)!) {
                    bridges.push([node, neighbor]);
                }
            } else if (neighbor !== parent.get(node)) {
                low.set(node, Math.min(low.get(node)!, disc.get(neighbor)!));

                if (disc.get(node)! > low.get(neighbor)!) {
                    bridges.push([node, neighbor]);
                }
            }
        }
    };

    for (let node of graph.adjacencyList.keys()) {
        dfs(node);
        break;
    }

    // find values that are multiple times in bridges
    let multipleBridges: [string, string][] = [];
    for (let bridge of bridges) {
        if (bridges.filter(([a, b]) => (a === bridge[0] && b === bridge[1]) || (a === bridge[1] && b === bridge[0])).length > 1) {
            multipleBridges.push(bridge);
        }
    }
    // now remove all of them from bridges
    bridges = bridges.filter(bridge => !multipleBridges.includes(bridge));

    return bridges;
}



const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

function main(){
    const graph = new SeznamSousedu({edgeType: 'oriented'});
    let lines: { [key: string]: string[] } = {};

    rl.on('line', (line) => {
        if (!line.startsWith('City: ')) {
            const [lineName, route] = line.split(': ');
            const cities = route.split(' -> ');
            lines[lineName] = cities;
        }
    }).on('close', () => {
        for (let line in lines) {
            let cities = lines[line];
            for (let i = 0; i < cities.length - 1; i++) {
                graph.addEdge(cities[i], cities[i + 1]);
            }
        }
        const bridges = findBridges(graph);
        const output = []

        for (let line in lines) {
            let cities = lines[line];
            for (let i = 0; i < cities.length - 1; i++) {
                if (bridges.some(bridge => (bridge[0] === cities[i] && bridge[1] === cities[i+1]))) {
                   output.push(`${line}: ${cities[i]} -> ${cities[i+1]}`);
                }
            }
        }

        console.log(output.reverse().join('\n'));
    });
}

main();