<?php

/**
 * Enable Featured Images
 */

add_theme_support( 'post-thumbnails' );

/**
 * Load some scripts please.
 */
 


/**
 * Display navigation to next/previous pages when applicable
 */
if ( ! function_exists( 'ocadillu_content_nav' ) ) :
function ocadillu_content_nav( $nav_id ) {
	global $wp_query;

	if ( $wp_query->max_num_pages > 1 ) : ?>
		<nav id="<?php echo $nav_id; ?>">
			<h3 class="assistive-text"><?php _e( 'Post navigation' ); ?></h3>
			<div class="nav-previous"><?php next_posts_link( __( '<span class="meta-nav">&larr;</span> Older posts' ) ); ?></div>
			<div class="nav-next"><?php previous_posts_link( __( 'Newer posts <span class="meta-nav">&rarr;</span>' ) ); ?></div>
		</nav><!-- #nav-above -->
	<?php endif;
}
endif;

?>