$(document).ready(function () {
    // Carga del archivo GraphML
    let graphData = null;

    // Manejar el cambio en el input de tipo file
    $('#fileInput').change(function (e) {
        const file = e.target.files[0];
        console.log(file);
        const reader = new FileReader();

        reader.onload = function (event) {
            const content = event.target.result;
            console.log(content);
            graphData = content;
            alert('¡Archivo cargado con éxito!');
            renderGraph();
        };

        reader.readAsText(file)
    });

    // Representación del grafo
    // Utiliza jQuery y HTML/CSS para mostrar el grafo
    function renderGraph() {
        if (graphData) {
            const graphContainer = $('#graphContainer');
            graphContainer.empty();

            // Recorrer los nodos en graphData y representarlos
            $(graphData).find('node').each(function() {
                const nodeId = $(this).attr('id');
                const nodeName = $(this).find('data[key="name"]').text();

                const nodeElement = $('<li>').text(nodeName);
                nodeElement.attr('id', 'node_' + nodeId);

                graphContainer.append(nodeElement);
            });

            // Recorrer los bordes en graphData y conectar los nodos
            $(graphData).find('edge').each(function() {
                const sourceNode = $(this).attr('source');
                const targetNode = $(this).attr('target');

                const edgeElement = $('<div>').addClass('edge');
                edgeElement.attr('id', 'edge_' + sourceNode + '_' + targetNode);

                $('#node_' + sourceNode).append(edgeElement);
            });
        }
    }

    // Interactividad
    $('#addNode').click(function () {
        // Implementa la lógica para agregar nodos aquí
    });

    $('#removeNode').click(function () {
        // Implementa la lógica para eliminar nodos aquí
    });

    $('#modifyNode').click(function () {
        // Implementa la lógica para modificar nodos aquí
    });

    // Guardado de cambios
    $('#saveGraphML').click(function () {
        // Implementa la lógica para guardar cambios en GraphML aquí
    });
});