#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const adjusted = new Map();
let path = [];
function createEdge(node1, node2) {
    if (!adjusted.has(node1)) {
        adjusted.set(node1, []);
    }
    if (!adjusted.has(node2)) {
        adjusted.set(node2, []);
    }
    adjusted.get(node1).push(node2);
    adjusted.get(node2).push(node1);
}
function dfsWithBacktracking(current, target, visitedPaths, previous) {
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
rl.on('line', (line) => {
    const [section1, section2] = line.split('-').map((section) => section.trim());
    createEdge(section1, section2);
});
rl.on('close', () => {
    dfsWithBacktracking('mustek', 'unikovy_modul', new Set(), null);
    path.forEach((move) => {
        console.log(`${move[0]} -> ${move[1]}`);
    });
});
