var people = [];
var numPlayers = 0;
var isDup = false;
var gameStartHidden = "hidden";

// ******************************************************** //
//          Format string to look like a name    			//
// 	    		- Eliminates white space					//
//				- Capiltalizes name							//
// ******************************************************** //
function toName(s) {
	s = s.replace( /[\s\n\r]+/g, ' ' );
	var words = s.split(" ");
	//console.log(words);
	var final = "";
	for (var i = 0; i < words.length; i++) {
		final += words[i].charAt(0).toUpperCase() 
		if(words[i].length > 1)
			final += words[i].substring(1, words[i].length).toLowerCase();
		final += " ";
	}
	return final;
}
// ******************************************************** //
//             Determine if string has HTML 				//
// 	    - Returns true if string contains html tags			//
// ******************************************************** //
function isHTML(str) {
	var a = document.createElement('div');
	a.innerHTML = str;
	for (var c = a.childNodes, i = c.length; i--; ) {
		if (c[i].nodeType == 1) return true; 
	}
	return false;
}

// ******************************************************** //
//            Check name input 								//
// 	    		- Returns formatted string					//
// ******************************************************** //
function validate(person) {
	if(isHTML(person)) {
		person = $(person)[0].textContent;
	}
	return toName(person).trim();
}

// ******************************************************** //
//            Sort entries in initiative list				//
// ******************************************************** //
// https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_localecompare
function sortInitiatives() {
	$("#initiative-list").find("li").sort(function(a, b) {
		var aStr = parseInt($(a).find(".delete-player").data('init'));
		var bStr = parseInt($(b).find(".delete-player").data('init'));

		// console.log($(a).find(".delete-player").data('init'));
		// console.log($(b).find(".delete-player").data('init'));

		if (aStr > bStr) { return -1; }
		else if (aStr == bStr) { return 0; }
		else { return 1; }
	}).each(function() {
		$("#initiative-list").append(this);
	});
}


$("ul").delegate(".delete-player", "click", function () {
	console.log("delete player");
	$list_all = $("#initiative-list").find("li");
	$list_all.each(function () {
		if ($(this).attr("class") == "list-group-item row-fluid player list-group-item-success") {
			if ($(this).next().length == 0) {
				$(".list-group-item").first().attr("class", "list-group-item row-fluid player list-group-item-success");
			} else {
				$(this).next().attr("class", "list-group-item row-fluid player list-group-item-success");
			}
			$(this).attr("class", "list-group-item row-fluid player");
			return false;
		}
	});
	var index = people.indexOf($(this).data('name'));
	for (var i = 0; i < people.length; i++) {
		if (people[i][0] == $(this).data('name')) {
			people.splice(i, 1);
		}
	}
	$(this).parent().remove();
	numPlayers--;
	console.log(people);
});


// ******************************************************** //
//            JQuery Function for Add Item Button 			//
// 	    	- on click #AddItemButton, add person			//
// ******************************************************** //
$('#addPlayerButton').click(function() {
	console.log("Add Player");
	
	$player = $('#playerName');
	$initiative = $('#initiative');
	$(".init-issue").remove();

	// remove any error messages
	$player.attr("class", "form-control");
	$player.parent().find(".help-block").remove();
	$initiative.attr("class", "form-control");
	$initiative.parent().find(".help-block").remove();

	// error message for bad name input
	if($player.val() == 0) {
		$player.attr("class", "form-control has-issue");
		// $player.parent().append('<p class="help-block issue init-issue">Please enter a valid name.</p>')
	}

	// error message for bad initiative input
	if ($initiative.val() == '') {
		$initiative.attr("class", "form-control has-issue");
		// $initiative.parent().append('<p class="help-block issue init-issue">Please enter an initiative score.</p>')
	}

	// Remove any html or white space on input, capitalize the words	
	var name = validate($player.val().trim());

	if ($player.val() != 0 && $initiative.val() != '') {
		var isDup = false;

		// Check if name exists in the array people
		for (var i = 0; i < people.length; i++) {
			if (people[i][0] == name) {
				$player.attr("class", "form-control has-issue");
				// $player.parent().append('<p class="help-block issue">Please enter a unique name.</p>')
				isDup = true;
			}
		}

		if(!isDup) {
			// Append the new person to the list
			// $('#initiative-list').append('<li class="list-group-item" id="player' + numPlayers + '"><span class="badge">' + $initiative.val() + '</span>' + name + '</li>');
			$('#initiative-list').append('<li class="list-group-item row-fluid player">'
				+ '<span class="badge pull-left">' + $initiative.val() + '</span>&nbsp;' 
				+ '<span class="col-md-8 col-md-offset-1">' + name + '</span>' 
				// + name
				+ '<div id="" class="delete-player pull-right" data-name="' + name + '" data-init="' + $initiative.val() + '">'
					+ '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' 
				+ '</div>'
			+ '</li>');

			// 

			// order by initiative values
			sortInitiatives();

			// add person to list of people
			var player = [name, $initiative.val()];
			people.push(player);
			console.log(people);

			numPlayers++;

			// reset input box
			$player.val("");
			$initiative.val("");
		}
	}
});

$("#next-player").click(function () {
	$success = $("#initiative-list").find(".list-group-item-success");
	// if no players are marked, mark the first one
	if ($success.length == 0) {
		$(".list-group-item").first().attr("class", "list-group-item row-fluid player list-group-item-success");
	} else {
		$list_all = $("#initiative-list").find("li");
		$list_all.each(function () {
			if ($(this).attr("class") == "list-group-item row-fluid player list-group-item-success") {
				if ($(this).next().length == 0) {
					$(".list-group-item").first().attr("class", "list-group-item row-fluid player list-group-item-success");
				} else {
					$(this).next().attr("class", "list-group-item row-fluid player list-group-item-success");
				}

				$(this).attr("class", "list-group-item row-fluid player");
				return false;
			}
		});
		// $success.attr("class", "list-group-item row-fluid player");

	}


});

$(document).ready(function () {




});
