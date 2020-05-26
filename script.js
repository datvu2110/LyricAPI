"use strict";
window.addEventListener("scroll", function(){
            const parallax = document.querySelector('.parallax');
            let scrollPos = window.pageYOffset;
            parallax.style.transform ='translateY(' + scrollPos * .5 + 'px)';
});


const baseURI = 'https://api.lyrics.ovh' 

$(function() {
  handleSubmit();
});

function handleSubmit(){
	$("#submit-form").on('submit', function(event) {
		event.preventDefault();
		const userInput = $('#search').val().trim();
		if (!userInput){
			alert("Please enter something to search!")
		}
		else{
			$('.songs').empty();
			$('#more').empty();
			$('#result').empty();
			$('.error').empty();
			searchForUserInput(userInput);
		}
		
	});
}

function searchForUserInput(userInput){
	const URL  = baseURI + "/suggest/" + userInput;
	fetch (URL)
		.then(response=>response.json())
		.then(responseJson=>displayResults(responseJson));
}

function displayResults(songs){

	if (songs.data <=0){
		$('.error').text('Check your search again');
	}
	else
	{
		$('#result').append(`<ul class="songs"></ul>`);
		for (let i =0; i<songs.data.length; i++){
			$('.songs').append( `
				<li>
					<div>
						<span><strong><a class="artist-link" href="${songs.data[i].artist.link}" target='_blank'>${songs.data[i].artist.name}</a></strong></span> 
						- <span class="songName">${songs.data[i].title}</span>
					</div>

					<div><button class="modal-btn get-lyrics lyric-btn" data-artist="${songs.data[i].artist.name}" data-title="${songs.data[i].title}"> Lyrics
						</button>	
					</div>
				</li>
			`);
		}
	}
	$('html,body').animate({
   		scrollTop: $(".songs").offset().top
	});

	if (songs.next){
		$('#more').append(`<button class="more-btn" onClick="getMore('${songs.next}')">Next</button>`)
	}
	if(songs.prev){
		$('#more').append(`<button class="more-btn" onClick="getMore('${songs.prev}')">Prev</button>`)
	}
	
}


function getMore(link){
	$('#result').empty();
	$('#more').empty();
	fetch (`https://cors-anywhere.herokuapp.com/${link}`)
		.then(response=>response.json())
		.then(responseJson=>displayResults(responseJson));
}




$(document).on("click",".get-lyrics", getLyrics);
$(document).on("click","#refresh", reloadPage);
$(document).on("click",".modal-close", modalClose);

function modalClose(e){
	$('.songTitle').empty();
	$('.songLyric').empty();
	$('body').removeClass('modal-open');
	$('.modal-bg').removeClass('bg-active');
}

function getLyrics(e){

	const URL  = baseURI + "/v1/" + $(this).attr("data-artist")+"/"+$(this).attr("data-title");
	fetch (URL)
		.then(response=>response.json())
		.then(responseJson=>showLyrics(responseJson,$(this).attr("data-artist"),$(this).attr("data-title")));
}

function showLyrics(data, artist,title){
	// $('#result').empty();
	// $('#more').empty();
	// $('#result').append(`
	// 	<div class="title">${title} </div>
	// 	<div class="artist"> ${artist} </div>
	// 	<div class="songLyric">${lyrics}</div>
	// `)
	if (data.error){
		$('.modal-bg').addClass('bg-active');
		$('body').addClass('modal-open');
		$('.songTitle').addClass('error');
		$('.songTitle').append('No Lyric Found!!');
	}
	const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
	$('.modal-bg').addClass('bg-active');
	$('body').addClass('modal-open');
	$('.songTitle').append(`
		${title}
		`)
	$('.songLyric').append(`
		${lyrics}
		`)
}

function reloadPage(e){
	window.location.reload();
}









