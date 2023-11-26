#!/usr/bin/env node
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Node {
    value: number;
    depth: number;
    leftChild: Node | null;
    rightChild: Node | null;

    constructor(value: number) {
        this.value = value;
        this.depth = 1;
        this.leftChild = null;
        this.rightChild = null;
    }
}

class AVLTree {
    root: Node | null;

    constructor() {
        this.root = null;
    }

    getNodeDepth(node: Node | null) {
        if (!node) return 0;
        return node.depth;
    }

    checkBalanceFactor(node: Node | null){
        if (!node) return 0;
        return this.getNodeDepth(node.leftChild) - this.getNodeDepth(node.rightChild);
    }

    rotateToRight(pivotNode: Node): Node {
        const newRoot = pivotNode.leftChild!;
        const movedSubTree = newRoot.rightChild;

        newRoot.rightChild = pivotNode;
        pivotNode.leftChild = movedSubTree;

        pivotNode.depth = Math.max(this.getNodeDepth(pivotNode.leftChild), this.getNodeDepth(pivotNode.rightChild)) + 1;
        newRoot.depth = Math.max(this.getNodeDepth(newRoot.leftChild), this.getNodeDepth(newRoot.rightChild)) + 1;

        return newRoot;
    }

    rotateToLeft(pivotNode: Node) {
        const newRoot = pivotNode.rightChild!;
        const movedSubTree = newRoot.leftChild;

        newRoot.leftChild = pivotNode;
        pivotNode.rightChild = movedSubTree;

        pivotNode.depth = Math.max(this.getNodeDepth(pivotNode.leftChild), this.getNodeDepth(pivotNode.rightChild)) + 1;
        newRoot.depth = Math.max(this.getNodeDepth(newRoot.leftChild), this.getNodeDepth(newRoot.rightChild)) + 1;

        return newRoot;
    }

    addNode(node: Node | null, value: number) {
        if (!node) return new Node(value);

        if (value < node.value) {
            node.leftChild = this.addNode(node.leftChild, value);
        } else {
            node.rightChild = this.addNode(node.rightChild, value);
        }

        node.depth = 1 + Math.max(this.getNodeDepth(node.leftChild), this.getNodeDepth(node.rightChild));

        const balance = this.checkBalanceFactor(node);

        // Handling AVL tree rotations
        if (balance > 1 && value < node.leftChild!.value) {
            return this.rotateToRight(node);
        }
        if (balance < -1 && value > node.rightChild!.value) {
            return this.rotateToLeft(node);
        }
        if (balance > 1 && value > node.leftChild!.value) {
            node.leftChild = this.rotateToLeft(node.leftChild!);
            return this.rotateToRight(node);
        }
        if (balance < -1 && value < node.rightChild!.value) {
            node.rightChild = this.rotateToRight(node.rightChild!);
            return this.rotateToLeft(node);
        }

        return node;
    }

    print() {
        if (!this.root) return "";
        const queue: (Node | null)[] = [this.root];
        const result: string[] = [];

        while (queue.length) {
            const levelSize = queue.length;
            const currentLevel: (number | string)[] = [];

            for (let i = 0; i < levelSize; i++) {
                const currentNode = queue.shift();

                if (currentNode) {
                    currentLevel.push(currentNode.value);
                    queue.push(currentNode.leftChild);
                    queue.push(currentNode.rightChild);
                } else {
                    currentLevel.push("_");
                }
            }

            if (currentLevel.some(val => val !== "_")) {
                result.push(currentLevel.join(" "));
            }
        }

        return result.join("|");
    }
}

function main(){
    const tree = new AVLTree();
    const treeStructure: string[] = [];

    rl.on('line', (inputLine: string) => {
        const values = inputLine.split(' ').map(Number);
        values.forEach(value => {
            tree.root = tree.addNode(tree.root, value);
        });
        treeStructure.push(tree.print());
    });

    rl.on('close', () => {
        treeStructure.forEach(treeLine => {
            console.log(treeLine);
        });
    });
}

main();
