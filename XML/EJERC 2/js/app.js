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
            var dia = $(this).prev().text(); // Obtener el día del elemento anterior
            var horario = $(this).text();
            horarios += `<li>${dia}: ${horario}</li>`;
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
            <section>
                <h2>${nombre}</h2>
                <img src="${logo}" alt="Logo">
            </section>
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
            <section>
                <h2>Redes Sociales</h2>
                <p>Facebook: ${facebook}</p>
                <p>Instagram: ${instagram}</p>
                <p>Twitter: ${twitter}</p>
            </section>
        `;

        return html;
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
                var html = convertidor.generarHTML();
                $('#resultado').html(html);
            }
            reader.readAsText(file);
        }
    });
});