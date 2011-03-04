<?php get_header(); ?>
<div id="container">
	
	<div class="single-navigation">
		<div class="prev-link"><?php previous_post_link_plus( array('order_by' => 'post_title', 'in_same_tax' => true) ); ?></div>
		<div class="next-link"><?php next_post_link_plus( array('order_by' => 'post_title', 'in_same_tax' => true) ); ?></div>
	</div> <!-- end navigation -->	
	
	
	
	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	
	<h1><?php the_title(); ?></h1>
		
	<?php the_content('Continue reading &rarr;'); ?>

	<?php if ( get_post_meta($post->ID, 'illu_email', true) ) : ?>
	 <p><a href="mailto:<?php echo get_post_meta($post->ID, 'illu_email', true) ?>"><?php echo get_post_meta($post->ID, 'illu_email', true) ?></a></p>
	<?php endif; ?>

	<?php if ( get_post_meta($post->ID, 'illu_phone', true) ) : ?>
	 <p><?php echo get_post_meta($post->ID, 'illu_phone', true) ?></p>
	<?php endif; ?>

	<?php if ( get_post_meta($post->ID, 'illu_sites', true) ) : ?>
		<p><a href="<?php echo get_post_meta($post->ID, 'illu_sites', true) ?>" title="<?php the_title(); ?>"><?php echo get_post_meta($post->ID, 'illu_sites', true) ?></a></p>
	<?php endif; ?>

	<?php
	    $gallery_shortcode = '[gallery link="file" size="medium" itemtag="div" icontag="div" columns="0"]';
	    print apply_filters( 'the_content', $gallery_shortcode );
	 ?>
          
	<?php endwhile; else: ?>
 
	<p>Sorry, no posts matched your criteria.</p>

	<?php endif; ?>
	

</div> <!-- #container -->

<?php get_footer(); ?>