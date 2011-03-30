<?php get_header(); ?>

<div id="container">	
	<div id="image-single">

	<?php
	/* Run the loop to output the attachment.
	 * If you want to overload this in a child theme then include a file
	 * called loop-attachment.php and that will be used instead.
	 */
	get_template_part( 'loop', 'attachment' );
	?>

	</div><!-- #image-single -->
</div><!-- #container -->

<?php get_footer(); ?>
