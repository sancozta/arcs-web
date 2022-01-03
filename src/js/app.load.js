// VARIAVEL DE CONTROLE DE SLIDES
var ControlerSlider;

// CONTROLE DE INICIALIZACAO
var IntervalLoad = setInterval(function() {
    if(document.readyState === "complete") {

		// DOCUMENT READY
		$(document).ready(function () {

			//CAPTURAR JSON COM INTERATIONS
			loadJson().then(function(data) {

				// GERACAO DINAMICA DE ELEMENTOS
				loadApp(data);

			}).catch(function(error) {

				// OBJECT ERROR AJAX
				console.log(error);

				//ERROR NO CARREGAMENTO DOS JSONS
				console.log("Error Load JSONs For Promises");

			});

		});

		console.log("Document Complet Load");

		clearInterval(IntervalLoad);

    }
}, 10);
