<?php get_header(); ?>
<div id="container">
	
	<div class="single-page">

		<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

		<h1><?php the_title(); ?></h1>
		
		<div class="event-image"><?php the_post_thumbnail('medium', array('alt' => '.get_the_title().', 'title' => ''.get_the_title().'' )); ?></div>

		<?php the_content('Continue reading &rarr;'); ?>

		<?php endwhile; else: ?>

		<p>Sorry, no posts matched your criteria.</p>

		<?php endif; ?>

	</div>
	
	<div class="single-navigation clearfix">
		<div class="container">
			<div class="prev-link"><?php previous_post_link_plus( array('order_by' => 'post_date', 'format' => '%link') ); ?></div>		
			<div class="next-link"><?php next_post_link_plus( array('order_by' => 'post_date', 'format' => '%link') ); ?></div>
		</div>
	</div>
	
</div>

<?php get_footer(); ?>