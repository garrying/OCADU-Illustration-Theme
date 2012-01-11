<?php

/**
 * Enable Featured Images
 */

add_theme_support( 'post-thumbnails' );

/**
 * Load some scripts please.
 */
 
if (!function_exists('load_my_scripts')) {
	function load_scripts() {
		if (!is_admin()) {
			wp_deregister_script( 'jquery' );
			wp_register_script('jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', '','',true);
			wp_enqueue_script('jquery');
			wp_register_script('myscript', get_template_directory_uri().'/assets/js/ui.js', array('jquery'), '1.0', true );
			wp_enqueue_script('myscript');
		}
	}
}
add_action('wp_enqueue_scripts', 'load_scripts');


/**
 * Clean up body_class output
 */
function wp_body_class( $wp_classes, $extra_classes )
{
	// List of the only WP generated classes allowed
	$whitelist = array( 'home', 'archive', 'page', 'single', 'category', 'tag', 'error404', 'logged-in', 'admin-bar', 'search' );

	// Filter the body classes
	// Whitelist result: (comment if you want to blacklist classes)
	$wp_classes = array_intersect( $wp_classes, $whitelist );

	// Add the extra classes back untouched
	return array_merge( $wp_classes, (array) $extra_classes );
}

add_filter( 'body_class', 'wp_body_class', 10, 2 );

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