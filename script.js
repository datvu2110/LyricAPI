"use strict";
window.addEventListener("scroll", function(){
            const parallax = document.querySelector('.parallax');
            let scrollPos = window.pageYOffset;
            parallax.style.transform ='translateY(' + scrollPos * .5 + 'px)';
});


const baseURI = 'https://api.lyrics.ovh' 

$(function() {
  console.log('App loaded!');
  handleSubmit();
});

function handleSubmit(){
	$("#submit-form").on('submit', function(event) {
		event.preventDefault();
		const userInput = $('#search').val().trim();
		console.log(userInput);
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
	console.log(URL);
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
		console.log(songs.data.length);
		for (let i =0; i<songs.data.length; i++){
			$('.songs').append( `
				<li>
					<div>
						<span><strong><a class="artist-link" href="${songs.data[i].artist.link}" target='_blank'>${songs.data[i].artist.name}</a></strong></span> 
						- <span class="songName">${songs.data[i].title}</span>
						<div><audio controls preload='auto' class="audio_volume_only" src="${songs.data[i].preview}"></audio></div>
					</div>

					<div><button class="get-lyrics lyric-btn" data-artist="${songs.data[i].artist.name}" data-title="${songs.data[i].title}"> Lyrics</button></div>
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
		$('#more').append(`<button class="more-btn" onClick="getMore('${songs.next}')">Prev</button>`)
	}
	
}


function getMore(link){
	$('#result').empty();
	$('#more').empty();
	console.log(link);
	fetch (`https://cors-anywhere.herokuapp.com/${link}`)
		.then(response=>response.json())
		.then(responseJson=>displayResults(responseJson));
}




$(document).on("click",".get-lyrics", getLyrics);
$(document).on("click","#refresh", reloadPage);
function getLyrics(e){
	console.log($(this).attr("data-artist"));

	const URL  = baseURI + "/v1/" + $(this).attr("data-artist")+"/"+$(this).attr("data-title");
	console.log(URL);
	fetch (URL)
		.then(response=>response.json())
		.then(responseJson=>showLyrics(responseJson,$(this).attr("data-artist"),$(this).attr("data-title")));
}

function showLyrics(data, artist,title){
	$('#result').empty();
	$('#more').empty();
	const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
	$('#result').append(`
		<div class="title">${title} </div>
		<div class="artist"> ${artist} </div>
		<div class="songLyric">${lyrics}</div>
	`)
}

function reloadPage(e){
	window.location.reload();
}







