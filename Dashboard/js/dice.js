var numPlaceholder = "Num";
var diePlaceholder = "Dice";


$("#addDice").on("click", function () {
	var input = 
		"<div  class=\"col-sm-9\">"
			+ "<div class=\"input-group\">"
				+ "<input type=\"number\" class=\"form-control dieNum\" min=\"0\" max=\"50\" placeholder=\"" + numPlaceholder + "\" aria-describedby=\"basic-addon1\" size=\"10\">"
				+ "<span class=\"input-group-addon\" id=\"basic-addon1\">d</span>"
				+ "<input type=\"number\" class=\"form-control dieVal\" min=\"0\" max=\"50\" placeholder=\"" + diePlaceholder + "\" aria-describedby=\"basic-addon1\" size=\"10\">"
			+ "</div>"
		+ "</div>"
		+ "<div class=\"col-sm-1 col-sm-offset-1\">"
			+ "<button class=\"btn btn-primary deleteDie\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></button>"
		+ "</div>";
	$("#dieInputs").append(input);
});

$("#dieInputs").delegate(".deleteDie", "click", function () {
	$(this).parent().prev().remove();
	$(this).parent().remove();
});

$("#calculate").click(function () {
	var numbers = [];
	var dice = [];
	$("#dieInputs").find(".dieNum").each(function () {
		numbers.push($(this).val());
	});
	$("#dieInputs").find(".dieVal").each(function () {
		dice.push($(this).val());
	});
	var total = 0;
	var subTotalArr = [];
	var subDieResults = [];
	var dieText = [];
	for (var i = 0; i < numbers.length; i++) {
		if (numbers[i] != "" && dice[i] != [i]) {
			var numDice = parseInt(numbers[i]);
			var dieValue = parseInt(dice[i]);
			dieText.push(numDice + "d" + dieValue);
			var subTotal = 0;
			var dieResults = [];
			for (var j = 0; j < numDice; j++) {
				var out = Math.floor(Math.random() * dieValue) + 1;
				dieResults.push(out);
				subTotal += out;
			}
			total += subTotal;
			subTotalArr.push(subTotal);
			subDieResults.push(dieResults);
		}
	}

	// console.log(subDieResults);

	var resultString = "";
	resultString += "Total: " + total + "\n";
	for (var i = subTotalArr.length - 1; i >= 0; i--) {
		resultString += dieText[i] + " = " + subTotalArr[i] + "\n[ ";
		for (var j = 0; j < subDieResults[i].length; j++) {
			resultString += subDieResults[i][j];
			if (subDieResults[i][j+1] != null) {
				resultString += ", ";
			}
		}
		resultString += " ]\n";
	}
	resultString += "-------------------------\n\n";
	console.log(resultString)

	$("#die-results").val(resultString + $("#die-results").val());
});

$(document).ready(function () {

});