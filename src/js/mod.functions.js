// FUNCTION LOAD JSON BASE
function loadJson() {

    return new Promise(function(resolve, reject) {
        $.ajax({
			type	: "GET",
			dataType: "json",
			url		: "data.json",
			success: function (reponse) {
				resolve(reponse);
			},
			error: function (xhr, options, thrown) {
				reject({
					xhr: xhr,
					options: options,
					thrown: thrown
				});
			}
		});
	});

}

// FUNCTION GENERATION PAGES
function loadApp(data){
	// AQUI VOCE PODE IMPLEMENTAR O QUE DESEJAR COM OS DADOS DO JSON
	console.log(data);
}
