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

// Trimming default wp head

remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0 );
remove_action( 'wp_head', 'start_post_rel_link', 10, 0 );

add_action( 'widgets_init', 'my_remove_recent_comments_style' );
function my_remove_recent_comments_style() {
	global $wp_widget_factory;
	remove_action( 'wp_head', array( $wp_widget_factory->widgets['WP_Widget_Recent_Comments'], 'recent_comments_style'  ) );
}

// Added menu functionality for Events post type in menu

add_filter( 'nav_menu_css_class', 'x_nav_menu_css_class', 10, 3 );
function x_nav_menu_css_class( $classes, $item = null, $args = null ) {
	$post_type = "event";
       if ( is_singular() || is_post_type_archive( $post_type ) ) {
               $pto = get_post_type_object( get_query_var('post_type') );
               if ( $pto->rewrite['slug'] == $item->post_name )
                       $classes[] = 'current-menu-item';
       }
       return $classes;
			
	   }

?>