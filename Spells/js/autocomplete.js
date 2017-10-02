function myFunction() {
	// Declare variables 
	var filter, table, tr, td, i;
	$input = $("#myInput");
	filter = $input.val().toUpperCase();
	$table = $("#spells");
	console.log($table);
	$tr = $table.find("li").each(function () {
		$(this).hide();
		td = $(this).find("#sp-name").text();
		if (td) {
			if (td.toUpperCase().indexOf(filter) > -1) {
				$(this).show();
			} else {
				$(this).hide();
			}
		}
	});
	// Loop through all table rows, and hide those who don't match the search query
}