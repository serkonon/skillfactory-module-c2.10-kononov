const surl = "https://sf-pyw.mosyag.in";
let ES = null;

function handleVoteButton() {
	const pets = $(this).attr("id");
	const vsurl = `${surl}/sse/vote/${pets}`;  	
  	$.post(vsurl);

  	//Инвертируем цвета нажатой кнопки
  	const col = $(this).css("color");
  	const bgcol = $(this).css("background-color");
  	$(this).css("color", col);
  	$(this).css("background-color", bgcol);

  	$(".j-btn").prop("disabled", true);
  	$("#votelink").css("display", "block");  	
}

function handleVoteResultLink(event) {
	const header = new Headers({
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Origin': '*'
	})
	let valuemax = 0;
	let vdata = null;

	function handleVoteProgress(pets) {
		let perc = vdata[pets] / valuemax * 100;

		$(`#pgs-${pets}`)
     	.css("width", `${perc}%`)
     	.attr("aria-valuenow", vdata[pets])
     	.attr("aria-valuemax", valuemax)
     	.text(vdata[pets]);
	}

	if (!ES) {
		ES = new EventSource(`${surl}/sse/vote/stats`, header);

		ES.onopen = event => {
		  console.log(event)
		}

		ES.onerror = error => {
		  ES.readyState ? console.error("⛔ EventSource failed: ", error) : null;
		}

		ES.onmessage = message => {
			vdata = $.parseJSON(message.data);

			valuemax = Math.max(...Object.values(vdata));
			
			handleVoteProgress("cats");
			handleVoteProgress("dogs");
			handleVoteProgress("parrots");
			$(".pgs-panel").css("display", "block");
		}
	}

	event.preventDefault();
	$("#votelink").css("display", "none"); 
}


$(document).ready(() => {
	$(".j-btn").click(handleVoteButton);
	$("#votelink").click(handleVoteResultLink);
});