$(document).ready(function() {

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
});