export class Node {
    data: Number;
    left: Node | null;
    right: Node | null;
    constructor(data: Number){
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

export class BinaryTree {
    root: Node | null;
    constructor(){
        this.root = null;
    }

    insert(data: Number): void {
        const newNode = new Node(data);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    removeLeaf(data: Number): void {
        this.root = this.removeLeafNode(this.root, data);
    }

    contains(data: Number): boolean {
        let node = this.root;
        while (node !== null) {
            if (data === node.data) return true;
            node = data < node.data ? node.left : node.right;
        }
        return false;
    }

    inOrder(): Number[] {
        const result: Number[] = [];
        const walk = (node: Node | null): void => {
            if (node === null) return;
            walk(node.left);
            result.push(node.data);
            walk(node.right);
        };
        walk(this.root);
        return result;
    }


    // case 1: leaf node -> remove the child
    // case 2: node with one child -> replace node with its child
    // case 3: node with two children -> find the minimum value in the right subtree, replace the node's data with that value, and then remove the minimum value node from the right subtree
    //  case 3 : either replace with successor or predecessor, [ successor is the minimum value in the right subtree, predecessor is the maximum value in the left subtree]


    private findMinNode (node: Node): Node {
        if(node.left === null) return node;
        return this.findMinNode(node.left);
    }

    private findMaxNode(node: Node): Node {
        if(node.right === null) return node;
        return this.findMaxNode(node.right);
    }

    private findSuccessor(node: Node): Node | null {
        return node.right? this.findMinNode(node.right) : null;
    }

    private findPredecessor(node: Node): Node | null {
        return node.left? this.findMaxNode(node.left) : null;
    }

    private removeLeafNode(node: Node|null, data: Number) : Node | null {
        // Walked off the tree without finding `data` - nothing to do.
        if(node == null) return null;

        // Target is smaller than this node's data: recurse into the left
        // subtree, and reattach whatever comes back (unchanged, or null if
        // the target node was just detached there).
        if(data < node.data){
            node.left = this.removeLeafNode(node.left, data);
        }
        // Target is larger: same idea, but down the right subtree.
        if(data > node.data){
            node.right = this.removeLeafNode(node.right, data);
        }
        // Found the target node. This function only handles Case 1 (leaf
        // removal): if it has no children, detach it by returning null,
        // which the recursive caller above assigns back into the parent's
        // left/right pointer. If it has children, leave it alone - removing
        // a node with children is Case 2/3, handled elsewhere.
        if(data === node.data && node.left === null && node.right === null){
            return null;
        }
        return node;
    }

    private insertNode(node: Node, newNode: Node): void {
        if (newNode.data < node.data) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }
}
