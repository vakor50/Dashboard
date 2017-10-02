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
		var aStr = parseInt($(a).find(".defeat").data('init'));
		var bStr = parseInt($(b).find(".defeat").data('init'));

		// console.log($(a).find(".defeat").data('init'));
		// console.log($(b).find(".defeat").data('init'));

		if (aStr > bStr) { return -1; }
		else if (aStr == bStr) { return 0; }
		else { return 1; }
	}).each(function() {
		$("#initiative-list").append(this);
	});
}

function addToDefeateList (name, initiative, type) {
	console.log("add to defeat list");
	console.log(name);
	console.log(initiative);
	$("#defeated-list").append('<li class="list-group-item gray-out" data-name="' + name + '" data-init="' + initiative + '" data-type="' + type + '">'
			+ '<div id="shift-back" class="pull-left"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></div>'
			+ '<div class="col-md-8 col-md-offset-1">' + name + '</div>&nbsp;' 
		+ '</li>');
}

$("ul").delegate("#shift-back", "click", function () {
	var init = $(this).parent().data('init');
	var name = $(this).parent().data('name');
	var type = $(this).parent().data('type');

	console.log(init + " - " + name + " - " + type);

	var alert = "";
	if (type == "player") {
		alert = "list-group-item-success"
	} else {
		alert = "list-group-item-danger"
	}

	$("#initiative-list").append('<li class=" list-group-item row-fluid ' + type + ' ' + alert + '">'
				+ '<span class="badge pull-left">' + init + '</span>&nbsp;' 
				+ '<span class="col-md-8 col-md-offset-1">' + name + '</span>' 
				// + name
				+ '<div id="" class="defeat col-md-offset-1 pull-right ' + gameStartHidden + '" data-name="' + name + '" data-init="' + init + '" data-type="'+ type + '">'
					+ '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>'
				+ '</div>'
				+ '<div id="" class="delete-' + type + ' pull-right hidden" data-name="' + name + '" data-init="' + init + '">'
					+ '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' 
				+ '</div>'
			+ '</li>');

	sortInitiatives();

	$(this).parent().remove();
});

$("ul").delegate(".defeat", "click", function () {
	addToDefeateList($(this).data('name'), $(this).data('init'), $(this).data('type'));
	var index = people.indexOf($(this).data('name'));
	for (var i = 0; i < people.length; i++) {
		if (people[i][0] == $(this).data('name')) {
			people.splice(i, 1);
		}
	}
	$(this).parent().remove();
});

$("ul").delegate(".delete-player", "click", function () {
	console.log("delete player");
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

$("ul").delegate(".delete-monster", "click", function () {
	console.log("delete monster");
	var index = people.indexOf($(this).data('name'));
	for (var i = 0; i < people.length; i++) {
		if (people[i][0] == $(this).data('name')) {
			people.splice(i, 1);
		}
	}

	$(this).parent().remove();
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

	// remove any error messages
	$player.attr("class", "form-control");
	$player.parent().find(".help-block").remove();
	$initiative.attr("class", "form-control");
	$initiative.parent().find(".help-block").remove();

	// error message for bad name input
	if($player.val() == 0) {
		$player.attr("class", "form-control has-issue");
		$player.parent().append('<p class="help-block issue">Please enter a valid name.</p>')
	}

	// error message for bad initiative input
	if ($initiative.val() == '') {
		$initiative.attr("class", "form-control has-issue");
		$initiative.parent().append('<p class="help-block issue">Please enter an initiative score.</p>')
	}

	// Remove any html or white space on input, capitalize the words	
	var name = validate($player.val().trim());

	if ($player.val() != 0 && $initiative.val() != '') {
		var isDup = false;

		// Check if name exists in the array people
		for (var i = 0; i < people.length; i++) {
			if (people[i][0] == name) {
				$player.attr("class", "form-control has-issue");
				$player.parent().append('<p class="help-block issue">Please enter a unique name.</p>')
				isDup = true;
			}
		}


		if(!isDup) {
			// Append the new person to the list
			// $('#initiative-list').append('<li class="list-group-item" id="player' + numPlayers + '"><span class="badge">' + $initiative.val() + '</span>' + name + '</li>');
			$('#initiative-list').append('<li class=" list-group-item row-fluid player list-group-item-success">'
				+ '<span class="badge pull-left">' + $initiative.val() + '</span>&nbsp;' 
				+ '<span class="col-md-8 col-md-offset-1">' + name + '</span>' 
				// + name
				+ '<div id="" class="defeat col-md-offset-1 pull-right ' + gameStartHidden + '" data-name="' + name + '" data-init="' + $initiative.val() + '" data-type="player">'
					+ '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>'
				+ '</div>'
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

$("#addMonsterButton").click(function () {
	console.log("Add Monster");
	
	$monster = $('#monsterName');
	$initiative = $('#initiativeMonster');

	// remove any error messages
	$monster.attr("class", "form-control");
	$monster.parent().find(".help-block").remove();
	$initiative.attr("class", "form-control");
	$initiative.parent().find(".help-block").remove();

	// error message for bad name input
	if($monster.val() == 0) {
		$monster.attr("class", "form-control has-issue");
		$monster.parent().append('<p class="help-block issue">Please enter a valid name.</p>')
	}

	// error message for bad initiative input
	if ($initiative.val() == '') {
		$initiative.attr("class", "form-control has-issue");
		$initiative.parent().append('<p class="help-block issue">Please enter an initiative score.</p>')
	}

	// Remove any html or white space on input, capitalize the words	
	var name = validate($monster.val().trim());

	if ($monster.val() != 0 && $initiative.val() != '') {
		// Append the new person to the list
		// $('#initiative-list').append('<li class="list-group-item" id="player' + numPlayers + '"><span class="badge">' + $initiative.val() + '</span>' + name + '</li>');
		$('#initiative-list').append('<li class=" list-group-item row-fluid monster list-group-item-danger">'
			+ '<span class="badge pull-left" data-init="' + $initiative.val() + '">' + $initiative.val() + '</span>&nbsp;' 
			+ '<span class="col-md-8 col-md-offset-1">' + name + '</span>' 
			// + name
			+ '<div id="" class="defeat col-md-offset-1 pull-right ' + gameStartHidden + '" data-name="' + name + '" data-init="' + $initiative.val() + '" data-type="monster">'
				+ '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>'
			+ '</div>'
			+ '<div id="" class="delete-monster pull-right" data-name="' + name + '">'
				+ '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' 
			+ '</div>'
		+ '</li>');
		// 
		// order by initiative values
		sortInitiatives();

		// add person to list of people
		var monster = [name, $initiative.val()];
		people.push(monster);
		console.log(people);

		// numPlayers = numPlayers + 1;

		// reset input box
		$monster.val("");
		$initiative.val("");
	}
});

$(".row").delegate("#startEncounterButton", "click", function () {
	console.log("start Encounter");
	gameStartHidden = "";

	$(".init-div").attr("class", "col-md-6 col-lg-6 init-div");
	$(".defeat-div").attr("class", "col-md-6 col-lg-6 defeat-div");
	$('.defeat').each(function() {
	    $(this).attr("class", "defeat col-md-offset-1 pull-right" );
	});
	$('.delete-player').each(function() {
		console.log("!!!!")
	    $(this).attr("class", "delete-player pull-right hidden" );
	});
	$('.delete-monster').each(function() {
	    $(this).attr("class", "delete-monster pull-right hidden" );
	});
	
	$(".addPeople").attr("class", "row hidden");

	$("#startEncounterButton").text("End Encounter");
	$("#startEncounterButton").attr("id", "endEncounterButton");
});

$(".row").delegate("#endEncounterButton", "click", function () {
	console.log("end Encounter");
	gameStartHidden = "hidden";

	$(".init-div").attr("class", "col-md-8 col-lg-8 init-div");
	$(".defeat-div").attr("class", "col-md-6 col-lg-6 defeat-div hidden");
	$('.defeat').each(function() {
	    $(this).attr("class", "defeat col-md-offset-1 pull-right hidden" );
	});
	$('.delete-player').each(function() {
	    $(this).attr("class", "delete-player pull-right" );
	});
	$('.delete-monster').each(function() {
	    $(this).attr("class", "delete-monster pull-right" );
	});
	$(".addPeople").attr("class", "row");

	$("#endEncounterButton").text("Start Encounter");
	$("#endEncounterButton").attr("id", "startEncounterButton");
});

$(document).ready(function () {




});
