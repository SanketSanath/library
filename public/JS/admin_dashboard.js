$(document).ready(function() {

	//issue book
	$("#ib_button").click((e)=>{
		e.preventDefault();
		var book_id = $("#ib_book_id").val(), issue_to = $("#ib_user_id").val(); $("#ib_book_id").val(''); $("#ib_user_id").val('');
		
		var data = {book_id, issue_to};
		$.ajax({
			type: 'POST',
			url: '/issue_book',
			data,
			success: function(responseText) {
				alert('issued successfully');
			},
			error: function(error) {	
				console.log(error);	
				alert(error.responseText);
				console.log(error.responseText);
			}
		});

	});

	//return book
	$("#rb_button").click((e)=>{
		e.preventDefault();
		var book_id = $("#rb_book_id").val(); $("#rb_book_id").val('');
		console.log(book_id);

		$.ajax({
			type: 'DELETE',
			url: '/return_book',
			data: {book_id},
			success: function(responseText) {
				alert(responseText);
			},
			error: function(error) {	
				console.log(error);	
				alert(error.responseText);
				console.log(error.responseText);
			}
		});
	});

	//add book
	$("#ab_button").click((e)=>{
		e.preventDefault();
		var book_isbn = $("#ab_isbn").val(), book_name = $("#ab_book_name").val(), book_author = $("#ab_author").val(), book_q = $("#ab_book_q").val();
		$("#ab_isbn").val(''); $("#ab_book_name").val(''); $("#ab_author").val(''); $("#ab_book_q").val('');
		var data = {book_isbn, book_name, book_author, book_q};
		$.ajax({
			type: 'POST',
			url: '/add_book',
			data,
			success: function(value) {
				console.log("Added books")
				if(confirm("Get barcodes for books added"))
					window.location.href="/barcodes/"+value;
			},
			error: function(error) {	
			console.log(error);	
				alert(error.responseText);
				console.log(error.responseText);
			}
		});

		console.log('add book: ', book_isbn, book_name, book_author, book_q);
	});

	//update book
	$("#ub_button").click((e)=>{
		e.preventDefault();
		var isbn = $("#ub_isbn").val(), book_q = $("#ub_book_q").val();
		$("#ub_isbn").val(''); $("#ub_book_q").val('');

		console.log('update book: ', isbn, book_q);
	});

	//list book
	$("#lb_button").click(function(e){
		e.preventDefault();
		window.location.href = "/book_list";
	});
	//search book
	$("#sb_button").click((e)=>{
		e.preventDefault();
		console.log("doing")
		var isbn = $("#sb_isbn").val(); 
		$("#sb_isbn").val('');

		var ch = $('input[name=sb_type]:checked').val();
		console.log(ch);
		if(ch=='isbn')
			window.location.href = "/admin/book/"+isbn;
		else if(ch=='name')
			window.location.href = "/admin/book_name/"+isbn;
		else if(ch=='author')
			window.location.href = "/admin/book_author/"+isbn;
	});

	//search radio
	$("#sb_type").change((e)=>{
		var val = $('input[name=sb_type]:checked').val();
		 $("#sb_isbn").placeholder(val);
	})

	//add user
	$("#au_button").click(function(e){
		e.preventDefault();
		var user_id = $('#au_user_id').val(), user_name = $('#au_user_name').val(), user_roll = $("#au_user_roll").val(), user_dept = $('#au_user_dept').val(), user_pass = $('#au_user_pass').val();
		$('#au_user_id').val(''); $('#au_user_name').val(''); $("#au_user_roll").val(''); $('#au_user_dept').val(''); $('#au_user_pass').val('');

		var data = {user_id, user_name, user_roll, user_dept, user_pass};
		$.ajax({
			type: 'POST',
			url: '/add_user',
			data,
			success: function(value) {
				console.log("Added stuff")
				console.log(value);
				alert('one user added');
			},
			error: function(error) {	
			console.log(error);	
				alert(error.responseText);
				console.log(error.responseText);
			}
		});


	});

	//update user
	$("#uu_button").click(function(e){
		e.preventDefault();
		var user_id = $("#uu_user_id").val(), user_pass = $("#uu_user_pass").val();
		$("#uu_user_id").val(''); $("#uu_user_pass").val('');

		console.log('update user: ', user_id, user_pass);
	});


	//list user
	$("#lu_button").click(function(e){
		e.preventDefault();
		window.location.href = "/user_list";
	});

	//search user
	$("#su_button").click((e)=>{
		e.preventDefault();
		var user_id = $("#su_user_id").val(); $("#su_user_id").val('');
		window.location.href = "/view_user/"+user_id;

		console.log("search_user: ", user_id);
	});

	//update user
	$("#cf_button").click(function(e){
		e.preventDefault();
		var user_id = $("#cf_user_id").val();
		if($("#cf_button").text()==='Submit Fine') {
			var submitted = $('#cf_submitted_fine').val();
			$('#cf_submitted_fine').val('');
			var data ={ submitted, user_id };
			$.ajax({
			type: 'POST',
			url: '/submit_fine',
			data,
			success: function(value) {
				$("#cf_user_id").val('');
				$('#cf_due_fine').val('');
				$('#cf_due_fine').hide()
				$('#cf_submitted_fine').css('style', 'display: none;')
				$('#cf_submitted_fine').hide()
				$("#cf_button").text('Get Fine')
				alert('Fine reduced')
			},
			error: function(error) {	
				console.log(error);	
				alert(error.responseText);
				console.log(error.responseText);
			}
		});
			return;
		}
		
		var data ={ user_id };
		$.ajax({
			type: 'POST',
			url: '/get_fine',
			data,
			success: function(value) {
				console.log('Done')
				var fine = (value.fine);
				$('#cf_due_fine').show()
				$('#cf_due_fine').text('Due fine is: '+fine);
				$('#cf_submitted_fine').show()
				$("#cf_button").text('Submit Fine')
			},
			error: function(error) {	
			console.log(error);	
				alert(error.responseText);
				console.log(error.responseText);
			}
		});
	});




	var eau_degree = 0, eab_degree = 0, euu_degree=0, eub_degree=0, elu_degree=0, elb_degree=0;
	$('.expand').click(function(e) {
		var angle=((parseInt($(this).getRotateAngle()))+180)%360;
		$(this).rotate({
			animateTo:angle
		})
	})
	$('#expand_add_user').click(function() {
		$('#add_user').toggle(500);
	});

	$('#expand_add_book').click(function() {
		$('#add_book').toggle(500);
	});

	$('#expand_collect_fine').click(function() {
		$('#collect_fine').toggle(500);
	});


	$('#expand_update_user').click(function() {
		$('#update_user').toggle(500);
	});

	$('#expand_update_book').click(function() {
		$('#update_book').toggle(500);
	});

	$('#expand_list_user').click(function() {
		$('#list_user').toggle(500);
	});

	$('#expand_list_book').click(function() {
		$('#list_book').toggle(500);
	});

	$('#expand_search_user').click(function() {
		$('#search_user').toggle(500);
	});

	$('#expand_search_book').click(function() {
		$('#search_book').toggle(500);
	});

	$('#expand_issue_book').click(function() {
		$('#issue_book').toggle(500);
	});

	$('#expand_return_book').click(function() {
		$('#return_book').toggle(500);
	});
});