class Convertidor {
    constructor(xmlStr) {
        this.xmlDoc = $.parseXML(xmlStr);
        this.$xml = $(this.xmlDoc);
    }

    generarHTML() {
        var nombre = this.$xml.find('nombre').text();
        var logo = this.$xml.find('logo').text();
        var imagenPrincipal = this.$xml.find('imagen_principal').text();

        var horarios = '';
        this.$xml.find('horario').each(function () {
            var horario = $(this).text();
            horarios += `<li>${horario}</li>`;
        });

        var localizaciones = '';
        this.$xml.find('localizacion').each(function () {
            var nombreLocalizacion = $(this).find('nombre_localizacion').text();
            var direccion = $(this).find('direccion').text();
            localizaciones += `
                <li>
                    <h3>${nombreLocalizacion}</h3>
                    <p>${direccion}</p>
                </li>
            `;
        });

        var facebook = this.$xml.find('facebook').text();
        var instagram = this.$xml.find('instagram').text();
        var twitter = this.$xml.find('twitter').text();

        var html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>${nombre}</title>
            </head>
            <body>
                <header>
                    <h1>${nombre}</h1>
                    <img src="${logo}" alt="Logo">
                </header>
                <section>
                    <h2>Bienvenido a ${nombre}</h2>
                    <img src="${imagenPrincipal}" alt="Imagen Principal">
                </section>
                <section>
                    <h2>Horarios</h2>
                    <ul>${horarios}</ul>
                </section>
                <section>
                    <h2>Localizaciones</h2>
                    <ul>${localizaciones}</ul>
                </section>
                <footer>
                    <h2>Redes Sociales</h2>
                    <p>Facebook: ${facebook}</p>
                    <p>Instagram: ${instagram}</p>
                    <p>Twitter: ${twitter}</p>
                </footer>
            </body>
            </html>
        `;

        const blob = new Blob([html], { type: 'application/html' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = nombre + ".html";
        link.click();
    }
}

$(document).ready(function () {
    $('#convertir').on('click', function () {
        var file = $('#xmlFile')[0].files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var xmlContent = e.target.result;
                var convertidor = new Convertidor(xmlContent);
                convertidor.generarHTML();
            }
            reader.readAsText(file);
        }
    });
});