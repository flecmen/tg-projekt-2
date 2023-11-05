#!/usr/bin/env node

import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const adjusted: Map<string, string[]> = new Map();
let path: [string, string][] = [];

function createEdge(node1: string, node2: string): void {
    if (!adjusted.has(node1)) {
        adjusted.set(node1, []);
    }
    if (!adjusted.has(node2)) {
        adjusted.set(node2, []);
    }

    adjusted.get(node1)!.push(node2);
    adjusted.get(node2)!.push(node1);
}

function dfsWithBacktracking(current: string, target: string, visitedPaths: Set<string>, previous?: string | null): boolean {
    if (current === target) {
        return true;
    }

    let neighbors = adjusted.get(current) || [];
    if (previous && neighbors.length > 1) {
        neighbors = neighbors.filter(neighbor => `${current}-${neighbor}` !== previous);
    }

    for (let neighbor of neighbors) {
        const pathKey = `${current}-${neighbor}`;
        if (!visitedPaths.has(pathKey) && !visitedPaths.has(`${neighbor}-${current}`)) {
            visitedPaths.add(pathKey);
            path.push([current, neighbor]);

            if (dfsWithBacktracking(neighbor, target, visitedPaths, pathKey)) {
                return true;
            }
            
            // Backtrack step
            path.push([neighbor, current]);
        }
    }

    return false;
}

rl.on('line', (line: string) => {
    const [section1, section2] = line.split('-').map((section) => section.trim());
    createEdge(section1, section2);
});

rl.on('close', () => {
    dfsWithBacktracking('mustek', 'unikovy_modul', new Set(), null);
    path.forEach((move) => {
        console.log(`${move[0]} -> ${move[1]}`);
    });
});
