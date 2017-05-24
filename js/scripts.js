// Wait until the DOM is loaded...
$(document).ready(function(){
	// console.log("test")
	// All api calls go to the this link
	const apiBaseUrl = 'http://api.themoviedb.org/3';
	// All images use this link
	const imageBaseUrl = 'http://image.tmdb.org/t/p/';

	const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key='+apiKey
	// console.log(nowPlayingUrl);

	// Make AJAX request to the nowPlayingUrl
	console.log(nowPlayingUrl)
	$.getJSON(nowPlayingUrl,(nowPlayingData)=>{
		// console.log(nowPlayingData);
		var nowPlayingHTML = getHTML(nowPlayingData);
		$('#movie-grid').html(nowPlayingHTML);
	});

	$('#movie-form').submit((event)=>{
		// Dont submit form! JS will handle
		event.preventDefault();
		var userInput = $('#search-input').val();
		$('#search-input').val('');
		var safeUserInput = encodeURI(userInput);
		var searchUrl = apiBaseUrl + '/search/movie?query='+safeUserInput+'&api_key='+apiKey;
		// console.log(searchUrl);
		$.getJSON(searchUrl,(searchMovieData)=>{
			var searchMovieHTML = getHTML(searchMovieData);
			$('#movie-grid').html(searchMovieHTML);
		})
	})

	function getHTML(data){
		var newHTML = '';
		for(let i = 0; i < data.results.length; i++){
			var posterUrl = imageBaseUrl + 'w300' + data.results[i].poster_path;
			newHTML += '<div class="col-sm-6 col-md-3">';
				newHTML += `<img src="${posterUrl}">`;
			newHTML += `</div>`;
		}
		return newHTML;
	}

});

