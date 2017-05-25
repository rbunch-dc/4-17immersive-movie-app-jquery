// Wait until the DOM is loaded...
$(document).ready(function(){
	// console.log("test")
	// All api calls go to the this link
	const apiBaseUrl = 'http://api.themoviedb.org/3';
	// All images use this link
	const imageBaseUrl = 'http://image.tmdb.org/t/p/';

	const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key='+apiKey
	// console.log(nowPlayingUrl);

	var buttonsHTML = '';
	for(let i = 0; i<genreArray.length; i++){
		buttonsHTML += `<button class="btn btn-primary genre-button">${genreArray[i].name}</button>`;
	}
	$('#genre-buttons').html(buttonsHTML);

	// Make AJAX request to the nowPlayingUrl
	console.log(nowPlayingUrl)
	$.getJSON(nowPlayingUrl,(nowPlayingData)=>{
		// console.log(nowPlayingData);
		var nowPlayingHTML = getHTML(nowPlayingData);
		$('#movie-grid').html(nowPlayingHTML);
		$('.movie-poster').click(function(){
			// Change teh HTML inside the modal
			var thisMovieId = $(this).attr('movie-id');
			console.log(thisMovieId);
			var thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}`;
			$.getJSON(thisMovieUrl,(thisMovieData)=>{
				console.log(thisMovieData);
				$('#myModalLabel').html(thisMovieData.title);
				// Open teh modal
				$("#myModal").modal();
			});
		});
		$grid = $('#movie-grid').isotope({
			itemSelector: '.movie-poster'
		});

		$('.genre-button').click(function(){
			// console.dir(this.innerText);
			$grid.isotope({filter: '.'+this.innerText})
		})

		$('#all-genres').click(function(){
			$grid.isotope({ filter: '' });
		});		
		

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

			// Set up a var for the genre ids for THIS movie
			var thisMovieGenres = data.results[i].genre_ids;
			var movieGenreClassList = " ";

			// Loop through ALL known genres
			for(let j = 0; j < genreArray.length; j++){
				// The genre that we are on (genreArray[j]), check to see
				// if it is in THIS movies genre id list.
				if(thisMovieGenres.indexOf(genreArray[j].id) > -1){
					// HIT! This genre_id is in THIS movie's genre_id list
					// So we need to add the name tot he class list
					movieGenreClassList += genreArray[j].name + " ";
				}
				// console.log(genreArray[j].id);
			}
			console.log(movieGenreClassList);
			var posterUrl = imageBaseUrl + 'w300' + data.results[i].poster_path;
			newHTML += '<div class="col-sm-6 col-md-3 movie-poster '+movieGenreClassList+'" movie-id='+data.results[i].id+'>';
				newHTML += `<img src="${posterUrl}">`;
			newHTML += `</div>`;
		}
		return newHTML;
	}
});

