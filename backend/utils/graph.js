function buildTreeAndDepth(node, adjList) {
    if (!adjList[node] || adjList[node].length === 0) {
        return { tree: {}, depth: 1 };
    }

    const tree = {};
    let maxChildDepth = 0;

    // To ensure deterministic order in tree keys if needed, though not strictly required,
    // we can sort children lexicographically.
    const children = [...adjList[node]].sort();

    for (const child of children) {
        const result = buildTreeAndDepth(child, adjList);
        tree[child] = result.tree;
        if (result.depth > maxChildDepth) {
            maxChildDepth = result.depth;
        }
    }

    return { tree, depth: maxChildDepth + 1 };
}

/**
 * Processes valid edges to construct graphs, detect cycles, calculate depths, and generate summaries.
 * 
 * @param {Array} validEdges - Array of { parent, child, original } objects.
 * @returns {Object} { hierarchies, summary }
 */
function processGraph(validEdges) {
    const childToParent = {};
    const adjList = {};
    const nodes = new Set();
    const undirectedAdjList = {};

    // 1. Build Graph with Multi-parent Discard Rule
    for (const edge of validEdges) {
        const u = edge.parent;
        const v = edge.child;
        
        nodes.add(u);
        nodes.add(v);
        
        if (childToParent[v] === undefined) {
            childToParent[v] = u;
            
            if (!undirectedAdjList[u]) undirectedAdjList[u] = [];
            if (!undirectedAdjList[v]) undirectedAdjList[v] = [];
            if (!adjList[u]) adjList[u] = [];
            if (!adjList[v]) adjList[v] = [];
            
            adjList[u].push(v);
            undirectedAdjList[u].push(v);
            undirectedAdjList[v].push(u);
        }
    }

    // 2. Find Weakly Connected Components
    const visited = new Set();
    const components = [];

    // Process nodes in sorted order for deterministic results
    const sortedNodes = Array.from(nodes).sort();

    for (const node of sortedNodes) {
        if (!visited.has(node)) {
            const compNodes = [];
            const queue = [node];
            visited.add(node);
            
            let head = 0;
            while(head < queue.length) {
                const curr = queue[head++];
                compNodes.push(curr);
                for (const neighbor of undirectedAdjList[curr] || []) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);
                    }
                }
            }
            components.push(compNodes);
        }
    }

    const hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;
    let largest_tree_root = null;
    let max_depth = 0;

    for (const comp of components) {
        // Find roots (nodes with in-degree 0 in this component)
        const roots = comp.filter(n => childToParent[n] === undefined);
        
        if (roots.length === 0) {
            // Pure cycle (every node has exactly 1 parent)
            comp.sort(); // Lexicographical sort
            const root = comp[0];
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
            total_cycles++;
        } else {
            // Tree (since max in-degree is 1, a component with a root is a tree)
            // Sort roots lexicographically just in case, though there should only be 1 root per component.
            roots.sort();
            const root = roots[0];
            const { tree, depth } = buildTreeAndDepth(root, adjList);
            hierarchies.push({
                root,
                tree: { [root]: tree },
                depth
            });
            total_trees++;

            // Update summary statistics
            if (depth > max_depth) {
                max_depth = depth;
                largest_tree_root = root;
            } else if (depth === max_depth) {
                if (largest_tree_root === null || root < largest_tree_root) {
                    largest_tree_root = root;
                }
            }
        }
    }

    // Sort hierarchies by root lexicographically to ensure consistent output order
    hierarchies.sort((a, b) => a.root.localeCompare(b.root));

    return {
        hierarchies,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
}

module.exports = { processGraph };
