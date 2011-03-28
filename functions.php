<?php
add_theme_support( 'post-thumbnails' );

// Adding a nifty widget'd menu

if ( function_exists('register_sidebar') ) {
	register_sidebar(array(
		'name' => 'Global Navigation Bar',
		'before_widget' => '<li id="%1$s" class="widget %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h3 class="widgettitle">',
		'after_title' => '</h3>',
	));
}

// Fix for embedded CSS when using gallery shortcode

add_filter( 'gallery_style', 'my_gallery_style', 99 );
function my_gallery_style() {
    return "<div class='gallery'>";
}

// Add custom menu using wp_nav_menu()

register_nav_menus( array(
	'primary' => __( 'Primary Navigation', 'ocaduillustration' ),
) );


// Limit search to Events and Illustrators

function SearchFilter($query) {
    if ($query->is_search) {
        $query->set('post_type', array( 'illustrator', 'event' ));
    }
    return $query;
}
 
add_filter('pre_get_posts','SearchFilter');
?>