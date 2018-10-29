$(document).ready(function() {


	//add book
	$("#ab_button").click((e)=>{
		e.preventDefault();
		var book_isbn = $("#ab_isbn").val(), book_name = $("#ab_book_name").val(), book_author = $("#ab_author").val(), book_q = $("#ab_book_q").val();
		$("#ab_isbn").val(''); $("#ab_book_name").val(''); $("#ab_author").val(''); $("#ab_book_q").val('');

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
		console.log("clicked");
	});
	//search book
	$("#sb_button").click((e)=>{
		e.preventDefault();
		var isbn = $("#sb_isbn").val(); $("#sb_isbn").val('');

		console.log("search_book: ", isbn);
	});

	//add user
	$("#au_button").click(function(e){
		e.preventDefault();
		var user_id = $('#au_user_id').val(), user_name = $('#au_user_name').val(), user_dept = $('#au_user_dept').val(), user_pass = $('#au_user_pass').val();
		$('#au_user_id').val(''); $('#au_user_name').val(''); $('#au_user_dept').val(''); $('#au_user_pass').val('');
		console.log('these: ', user_id, user_name, user_dept, user_pass);


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
		console.log("clicked");
	});

	//search user
	$("#su_button").click((e)=>{
		e.preventDefault();
		var user_id = $("#su_user_id").val(); $("#su_user_id").val('');

		console.log("search_user: ", user_id);
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
});