<?php get_header(); ?>

		<div id="primary" class="image">
			<div id="content" role="main">
				
			<?php while ( have_posts() ) : the_post(); ?>

					<article <?php post_class(); ?>>

								<div class="illustrator-image">
<?php
	/**
	 * Grab the IDs of all the image attachments in a gallery so we can get the URL of the next adjacent image in a gallery,
	 * or the first image (if we're looking at the last image in a gallery), or, in a gallery of one, just the link to that image file
	 */
	$attachments = array_values( get_children( array( 'post_parent' => $post->post_parent, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => 'ASC', 'orderby' => 'menu_order ID' ) ) );
	foreach ( $attachments as $k => $attachment ) {
		if ( $attachment->ID == $post->ID )
			break;
	}
	$k++;
	// If there is more than 1 attachment in a gallery
	if ( count( $attachments ) > 1 ) {
		if ( isset( $attachments[ $k ] ) )
			// get the URL of the next image attachment
			$next_attachment_url = get_attachment_link( $attachments[ $k ]->ID );
		else
			// or get the URL of the first image attachment
			$next_attachment_url = get_attachment_link( $attachments[ 0 ]->ID );
	} else {
		// or, if there's only 1 image, get the URL of the image
		$next_attachment_url = wp_get_attachment_url();
	}
?>
									<a href="<?php echo esc_url( $next_attachment_url ); ?>" title="<?php the_title_attribute(); ?>" rel="attachment"><?php
									$attachment_size = apply_filters( 'ocadu_attachment_size', 848 );
									echo wp_get_attachment_image( $post->ID, array( $attachment_size, 1024 ) ); // filterable image width with 1024px limit for image height.
									?></a>

								</div><!-- .illustrator-image -->
						
						<div id="illustrator-meta-guide">
						<aside id="illustrator-meta" role="complementary">
						<header class="entry-header">
							<h1 class="entry-title"><?php echo get_the_title( $post->post_parent ); ?></h1>
							<hr />
						</header><!-- .entry-header -->

								<?php if ( get_post_meta($post->post_parent, 'illu_sites', true) ) : ?>
									<div class="info site"><a title="Visit illustrator's website" href="<?php echo get_post_meta($post->ID, 'illu_sites', true) ?>"><?php echo get_post_meta($post->post_parent, 'illu_sites', true) ?></a></div><hr />

								<?php endif; ?>

								<?php if ( get_post_meta($post->post_parent, 'illu_sites_2', true) ) : ?>
									<div class="info site"><a title="Visit illustrator's website" href="<?php echo get_post_meta($post->ID, 'illu_sites_2', true) ?>"><?php echo get_post_meta($post->post_parent, 'illu_sites_2', true) ?></a></div><hr />
								<?php endif; ?>

								<?php if ( get_post_meta($post->post_parent, 'illu_email', true) ) : ?>
								 <div class="info email"><a title="Email <?php the_title(); ?>" href="mailto:<?php echo get_post_meta($post->ID, 'illu_email', true) ?>"><?php echo get_post_meta($post->post_parent, 'illu_email', true) ?></a></div><hr />
								<?php endif; ?>

								<?php if ( get_post_meta($post->post_parent, 'illu_phone', true) ) : ?>
								 <div class="info phone"><?php echo get_post_meta($post->post_parent, 'illu_phone', true) ?></div>	<hr />
								<?php endif; ?>


						   <?php $parent = get_post($post->post_parent); ?>
					     <?php echo apply_filters('the_content', $parent->post_content); ?>

						<footer class="nav-single image">
							
							<nav id="nav-single">							
								<h3 class="assistive-text"><?php _e( 'Image navigation' ); ?></h3>
								<ul>
								<li class="nav-previous"><?php previous_image_link( false, __( '&larr; Previous' ) ); ?></li>
								<li class="nav-next"><?php next_image_link( false, __( 'Next &rarr;' ) ); ?></li>
								</ul>
							</nav><!-- #nav-single -->
							
							<a href="<?php echo get_permalink( $post->post_parent ); ?>" title="View All Work" id="illustrator-back">
								<?php echo "View all work by ". get_the_title( $post->post_parent);?>
							</a>
				
						</footer><!-- .nav-single .image -->



						<span class="vertical-rule-main"></span>
						<span class="vertical-rule-corner-top"></span>
						<span class="vertical-rule-corner-bottom"></span>

						</aside><!-- aside -->
						</div>

					</article><!-- #post-<?php the_ID(); ?> -->

				<?php endwhile; // end of the loop. ?>

			</div><!-- #content -->
		</div><!-- #primary -->

<?php get_footer(); ?>