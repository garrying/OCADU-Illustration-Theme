<?php get_header(); ?>

<div id="container">
	
	<div class="single-navigation clearfix">
		<div class="container">
		<div class="prev-link"><?php previous_post_link_plus( array('order_by' => 'post_title', 'in_same_tax' => true) ); ?></div>		
		<div class="next-link"><?php next_post_link_plus( array('order_by' => 'post_title', 'in_same_tax' => true) ); ?></div>
		</div>
	</div> <!-- end navigation -->
	
		
	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	
	<div class="illu-work">
	
	<div class="gallery-item" id="illustrator-details">

	<h1><?php the_title(); ?></h1>
	
	<?php if ( get_post_meta($post->ID, 'illu_sites', true) ) : ?>
		<div class="info site"><p><a title="Visit illustrator's website" href="<?php echo get_post_meta($post->ID, 'illu_sites', true) ?>"><?php echo get_post_meta($post->ID, 'illu_sites', true) ?></a></p></div>
	<?php endif; ?>
	
	<?php if ( get_post_meta($post->ID, 'illu_email', true) ) : ?>
	 <div class="info email"><p><a title="Email <?php the_title(); ?>" href="mailto:<?php echo get_post_meta($post->ID, 'illu_email', true) ?>"><?php echo get_post_meta($post->ID, 'illu_email', true) ?></a></p></div>
	<?php endif; ?>

	<?php if ( get_post_meta($post->ID, 'illu_phone', true) ) : ?>
	 <div class="info phone"><p><?php echo get_post_meta($post->ID, 'illu_phone', true) ?></p></div>
	<?php endif; ?>

	<?php if ( get_the_content() ) : ?>
	<div class="statement">
		<?php $text = '<h2>' . 'Statement' . '</h2>' . get_the_content(); echo apply_filters('the_content', $text); ?>
	</div>
	<?php endif; ?>
	
	</div>

	<?php
	    $gallery_shortcode = '[gallery link="file" size="medium" itemtag="div" icontag="div" columns="0"]';
	    print apply_filters( 'the_content', $gallery_shortcode );
	 ?>
          
	<?php endwhile; else: ?>
 
	<p>Sorry, no posts matched your criteria.</p>

	<?php endif; ?>
	</div>
	
</div> <!-- #container -->

<?php get_footer(); ?>