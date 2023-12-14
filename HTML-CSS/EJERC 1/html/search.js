function search() {
    // Limpiar resultados anteriores
    document.getElementById("resultsList").innerHTML = "";

    // Obtener el término de búsqueda
    var searchTerm = document.getElementById("searchInput").value.toLowerCase();

    // Utilizar fetch para cargar el sitemap.xml de forma asíncrona
    fetch("sitemap.xml")  // Reemplaza con la ruta correcta
        .then(response => response.text())
        .then(sitemapContent => {
            // Parsear el contenido del sitemap.xml
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(sitemapContent, "text/xml");

            // Encontrar todas las URL en el sitemap
            var urls = xmlDoc.getElementsByTagName("url");

            // Filtrar las URL que contienen el término de búsqueda
            var matchingUrls = Array.from(urls).filter(url => url.getElementsByTagName(textContent)[0].textContent.toLowerCase().includes(searchTerm));

            // Mostrar los resultados en la lista de enlaces
            displayResults(matchingUrls);
        })
        .catch(error => {
            console.error("Error al cargar el sitemap:", error);
        });
}

// Esta función muestra los resultados en la lista de enlaces
function displayResults(results) {
    var resultsList = document.getElementById("resultsList");

    if (results.length > 0) {
        results.forEach(result => {
            var listItem = document.createElement("li");
            var link = document.createElement("a");
            link.href = result.textContent;
            link.target = "_blank"; // Abre el enlace en una nueva pestaña
            link.textContent = result.getElementsByTagName(loc)[0].textContent;
            listItem.appendChild(link);
            resultsList.appendChild(listItem);
        });
    } else {
        var listItem = document.createElement("li");
        listItem.textContent = "No se encontraron resultados.";
        resultsList.appendChild(listItem);
    }
}