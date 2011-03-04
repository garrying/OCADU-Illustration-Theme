<?php get_header(); ?>
<div id="container">

	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

	<?php the_content('Continue reading &rarr;'); ?>
         
	<?php endwhile; else: ?>

	<p>Sorry, no posts matched your criteria.</p>

	<?php endif; ?>

</div> <!-- #container -->

<?php get_footer(); ?>