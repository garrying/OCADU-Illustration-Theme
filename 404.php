<?php get_header(); ?>

<div id="container">

<div id="page-not-found">
	<h1 class="entry-title"><?php _e( 'Not Found'); ?></h1>
	<div class="entry-content">
		<p><?php _e( 'Apologies, but the page you requested could not be found. Perhaps searching will help.'); ?></p>
		<?php get_search_form(); ?>
	</div><!-- .entry-content -->
</div>

</div> <!-- #container -->

<?php get_footer(); ?>