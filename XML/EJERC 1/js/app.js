class GraphConverter {
    constructor() {
        this.graphData = null;
    }

    loadGraphFromFile(file) {
        const reader = new FileReader();

        reader.onload = (event) => {
            const content = event.target.result;
            this.graphData = this.parseGraphML(content);
            this.generateAdjacencyMatrixTable();
        };

        reader.readAsText(file);
    }

    parseGraphML(graphMLContent) {
        const nodes = {};
        const edges = [];

        $(graphMLContent).find('node').each(function() {
            const nodeId = $(this).attr('id');
            const nodeName = $(this).find('data[key="label"]').text();
            nodes[nodeId] = nodeName;
        });

        $(graphMLContent).find('edge').each(function() {
            const sourceNode = $(this).attr('source');
            const targetNode = $(this).attr('target');
            edges.push({ source: sourceNode, target: targetNode });
        });

        return { nodes, edges };
    }

    generateAdjacencyMatrix() {
        const nodes = Object.keys(this.graphData.nodes).sort();
        const matrix = [];

        // Inicializar la matriz con ceros
        for (let i = 0; i < nodes.length; i++) {
            const row = [];
            for (let j = 0; j < nodes.length; j++) {
                row.push(0);
            }
            matrix.push(row);
        }

        // Rellenar la matriz con las relaciones
        for (const edge of this.graphData.edges) {
            const sourceNode = edge.source;
            const targetNode = edge.target;

            const sourceIndex = nodes.indexOf(sourceNode);
            const targetIndex = nodes.indexOf(targetNode);

            matrix[sourceIndex][targetIndex] = 1;
        }

        return { nodes, matrix };
    }

    generateAdjacencyMatrixTable() {
        const adjacencyMatrix = this.generateAdjacencyMatrix();

        const matrixTable = $('<table>').addClass('adjacency-matrix');
        const thead = $('<thead>');
        const tbody = $('<tbody>');

        // Creación del encabezado
        const headRow = $('<tr>');
        headRow.append($('<th>').text('Nodo'));
        for (const node of adjacencyMatrix.nodes) {
            headRow.append($('<th>').text(node));
        }
        thead.append(headRow);
        matrixTable.append(thead);

        // Creación de filas
        for (let i = 0; i < adjacencyMatrix.nodes.length; i++) {
            const row = $('<tr>');
            row.append($('<td>').text(adjacencyMatrix.nodes[i]));
            for (let j = 0; j < adjacencyMatrix.nodes.length; j++) {
                row.append($('<td>').text(adjacencyMatrix.matrix[i][j]));
            }
            tbody.append(row);
        }

        matrixTable.append(tbody);
        $('#graphContainer').empty().append(matrixTable);
    }

    addNode(nodeName) {
        const newNode = { id: nodeName, label: nodeName };
        this.graphData.nodes[nodeName] = nodeName;

        // Si deseas que la tabla se actualice automáticamente
        this.generateAdjacencyMatrixTable();

        return newNode;
    }

    addEdge(sourceNode, targetNode) {
        const newEdge = { source: sourceNode, target: targetNode}; // Por defecto, se asume un peso de 1
        this.graphData.edges.push(newEdge);
        console.log(this.graphData.edges);
        return newEdge;
    }

    removeNode(nodeId) {
        // Eliminar el nodo del objeto nodes
        delete this.graphData.nodes[nodeId];

        // Eliminar todas las relaciones que involucren al nodo
        this.graphData.edges = this.graphData.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);

        // Si deseas que la tabla se actualice automáticamente
        this.generateAdjacencyMatrixTable();
    }

    removeEdge(sourceNode, targetNode) {
        // Eliminar la relación del array de edges
        this.graphData.edges = this.graphData.edges.filter(edge => !(edge.source === sourceNode && edge.target === targetNode));

        // Si deseas que la tabla se actualice automáticamente
        this.generateAdjacencyMatrixTable();
    }

    saveGraphML() {
        const nodes = this.graphData.nodes;
        const edges = this.graphData.edges;

        let graphMLContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
        graphMLContent += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n';
        graphMLContent += '  <graph id="G" edgedefault="undirected">\n';

        // Escribir nodos
        for (const nodeId in nodes) {
            const nodeName = nodes[nodeId];
            graphMLContent += `    <node id="${nodeId}"><data key="label">${nodeName}</data></node>\n`;
        }

        // Escribir relaciones
        for (const edge of edges) {
            graphMLContent += `    <edge source="${edge.source}" target="${edge.target}"/>\n`;
        }

        graphMLContent += '  </graph>\n';
        graphMLContent += '</graphml>';

        const blob = new Blob([graphMLContent], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'graph.graphml';
        link.click();
    }
}

// Uso del código
const graphConverter = new GraphConverter();

$(document).ready(function () {
    $('#fileInput').change(function (e) {
        const file = e.target.files[0];
        graphConverter.loadGraphFromFile(file);
    });

    $('#addNodeBtn').click(function () {
        const nodeName = $('#newNodeName').val();
        if (nodeName) {
            graphConverter.addNode(nodeName);
            $('#newNodeName').val(''); // Limpiar el input
        }
    });
    $('#addEdgeBtn').click(function () {
        const sourceNode = $('#sourceNode').val();
        const targetNode = $('#targetNode').val();
        if (sourceNode && targetNode) {
            graphConverter.addEdge(sourceNode, targetNode);
            $('#sourceNode').val('');
            $('#targetNode').val('');
            graphConverter.generateAdjacencyMatrixTable(); // Llamar a la función para renderizar el grafo
        }
    });
    $('#removeNodeBtn').click(function () {
        const nodeToRemove = $('#nodeToRemove').val();
        if (nodeToRemove) {
            graphConverter.removeNode(nodeToRemove)
            $('#nodeToRemove').val(''); // Llamar a la función para renderizar el grafo
        }
    });

    $('#removeEdgeBtn').click(function () {
        const sourceNode = $('#sourceRemoveNode').val();
        const targetNode = $('#targetRemoveNode').val();

        console.log(sourceNode);
        console.log(targetNode);
        if (sourceNode && targetNode) {
            graphConverter.removeEdge(sourceNode, targetNode);
            $('#sourceRemoveNode').val('');
            $('#targetRemoveNode').val('');
        }
    });

    $('#saveGraphML').click(function () {
        graphConverter.saveGraphML();
    });
});