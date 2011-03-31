<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>

				<?php if ( ! empty( $post->post_parent ) ) : ?>
					<div class="post" id="illustrator-details">
					<h1 class="page-title"><a href="<?php echo get_permalink( $post->post_parent ); ?>" title="<?php esc_attr( printf( __( 'Return to %s', 'twentyten' ), get_the_title( $post->post_parent ) ) ); ?>"><?php
						/* translators: %s - title of parent post */
						printf( __( '%s'), get_the_title( $post->post_parent ) );
					?></a></h1>
					
					<?php if ( get_post_meta($post->post_parent, 'illu_sites', true) ) : ?>
						<div class="info site"><p><a title="Visit illustrator's website" href="<?php echo get_post_meta($post->ID, 'illu_sites', true) ?>"><?php echo get_post_meta($post->post_parent, 'illu_sites', true) ?></a></p></div>
					<?php endif; ?>

					<?php if ( get_post_meta($post->post_parent, 'illu_email', true) ) : ?>
					 <div class="info email"><p><a title="Email <?php the_title(); ?>" href="mailto:<?php echo get_post_meta($post->ID, 'illu_email', true) ?>"><?php echo get_post_meta($post->post_parent, 'illu_email', true) ?></a></p></div>
					<?php endif; ?>

					<?php if ( get_post_meta($post->post_parent, 'illu_phone', true) ) : ?>
					 <div class="info phone"><p><?php echo get_post_meta($post->post_parent, 'illu_phone', true) ?></p></div>
					<?php endif; ?>		
					
					<div id="image-navigation">
						<div class="nav-previous"><?php previous_image_link( true ); ?></div>
						
						<div class="nav-next"><?php next_image_link( true ); ?></div>
						

					</div><!-- #image-navigation-->
					
					<div id="image-navigation-shortcuts">
					<p>Keyboard Shortcuts:</p>
					<p><span class="arrow">&larr;</span> Next Previous // Next Image <span class="arrow">&rarr;</span></p>
					</div>
					
								
					</div>
				<?php endif; ?>

					<div class="post single-image">
<?php if ( wp_attachment_is_image() ) :
	$attachments = array_values( get_children( array( 'post_parent' => $post->post_parent, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => 'ASC', 'orderby' => 'menu_order ID' ) ) );
	foreach ( $attachments as $k => $attachment ) {
		if ( $attachment->ID == $post->ID )
			break;
	}
	$k++;
	// If there is more than 1 image attachment in a gallery
	if ( count( $attachments ) > 1 ) {
		if ( isset( $attachments[ $k ] ) )
			// get the URL of the next image attachment
			$next_attachment_url = get_attachment_link( $attachments[ $k ]->ID );
		else
			// or get the URL of the first image attachment
			$next_attachment_url = get_attachment_link( $attachments[ 0 ]->ID );
	} else {
		// or, if there's only 1 image attachment, get the URL of the image
		$next_attachment_url = wp_get_attachment_url();
	}
?>
						<a href="<?php echo $next_attachment_url; ?>" title="<?php echo esc_attr( get_the_title() ); ?>" rel="attachment">
						<?php echo wp_get_attachment_image( $post->ID,'large' ); // filterable image width with, essentially, no limit for image height.
						?></a>
						
<?php else : ?>
						<a href="<?php echo wp_get_attachment_url(); ?>" title="<?php echo esc_attr( get_the_title() ); ?>" rel="attachment"><?php echo basename( get_permalink() ); ?></a>
<?php endif; ?>
						<div class="entry-caption"><?php if ( !empty( $post->post_excerpt ) ) the_excerpt(); ?></div>

					</div><!-- .single-image -->

<?php endwhile; // end of the loop. ?>