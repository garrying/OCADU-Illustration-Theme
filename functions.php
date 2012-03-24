<?php

/**
 * Enable Featured Images
 */

add_theme_support( 'post-thumbnails' );

/**
 * Wordpress Default Header Cleanup
 */

function ocad_head_cleanup() {
	remove_action( 'wp_head', 'feed_links_extra', 3 );                    // Category Feeds
	remove_action( 'wp_head', 'feed_links', 2 );                          // Post and Comment Feeds
	remove_action( 'wp_head', 'rsd_link' );                               // EditURI link
	remove_action( 'wp_head', 'wlwmanifest_link' );                       // Windows Live Writer
	remove_action( 'wp_head', 'index_rel_link' );                         // index link
	remove_action( 'wp_head', 'parent_post_rel_link', 10, 0 );            // previous link
	remove_action( 'wp_head', 'start_post_rel_link', 10, 0 );             // start link
	remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0 ); // Links for Adjacent Posts
	remove_action( 'wp_head', 'wp_generator' );                           // WP version
}

add_action('init', 'ocad_head_cleanup');

/**
 * Load some scripts please.
 */
 
if (!function_exists('load_my_scripts')) {
	function load_scripts() {
		if (!is_admin()) {
			wp_deregister_script( 'jquery' );
			wp_register_script('jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', '','',true);
			wp_enqueue_script('jquery');
			wp_register_script('modernizer', get_template_directory_uri().'/assets/js/modernizr-2.5.3.min.js', '','',false);
			wp_enqueue_script('modernizer');
			wp_register_script('masonry', get_template_directory_uri().'/assets/js/jquery.masonry.min.js', array('jquery'), '', true );
			wp_enqueue_script('masonry');
			wp_register_script('spin', get_template_directory_uri().'/assets/js/spin.min.js', array('jquery'), '', true );
			wp_enqueue_script('spin');
			wp_register_script('myscript', get_template_directory_uri().'/assets/js/ui.js', array('jquery'), '', true );
			wp_enqueue_script('myscript');
		}
	}
}
add_action('wp_enqueue_scripts', 'load_scripts');

/**
 * Load some styles please.
 */

function load_ocad_styles() {
	wp_register_style('fontdeck', 'http://f.fontdeck.com/s/css/uH5+KWQnibDTJRYggGJ9XZLTAgw/ocaduillustration.dev/17386.css');
	wp_enqueue_style('fontdeck');
	wp_register_style('ocadustyles', get_template_directory_uri().'/assets/stylesheets/main.css');
	wp_enqueue_style('ocadustyles');
}

add_action('wp_enqueue_scripts', 'load_ocad_styles');

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
			<div class="nav-next"><?php next_posts_link( __( 'Next Page <span class="meta-nav">&rarr;</span>' ) ); ?></div>
			<div class="nav-previous"><?php previous_posts_link( __( '<span class="meta-nav">&larr;</span> Previous Page' ) ); ?></div>
		</nav><!-- #nav-above -->
	<?php endif;
}
endif;

/**
 * Remove inline css from gallery shortcode
 */

function my_gallery_style() {
    return "<div class='gallery'>";
}
add_filter( 'gallery_style', 'my_gallery_style', 99 );

add_filter( 'use_default_gallery_style', '__return_false' );

/**
 * Clean titles for image attachments
 */
	
function set_page_title($title) {
	if (wp_attachment_is_image()) {
		global $post;
		$postparent = get_the_title($post->post_parent) . " | ";
		$title = $postparent;  
	}
  return $title;
}

add_filter('wp_title', 'set_page_title');

/**
 * Add custom menu using wp_nav_menu()
 */

register_nav_menus( array(
	'primary' => __( 'Primary Navigation', 'ocaduillustration' ),
) );

/**
 * Added menu functionality for Events post type in menu
 */

function x_nav_menu_css_class( $classes, $item = null, $args = null ) {
$post_type = "event";
  if ( is_singular( $post_type ) ) {
          $pto = get_post_type_object( get_query_var('post_type') );
          if ( $pto->rewrite['slug'] == $item->post_name )
          $classes[] = 'current-menu-item';
  }
  return $classes;
}

add_filter( 'nav_menu_css_class', 'x_nav_menu_css_class', 10, 3 );

/**
 * Reduce nav classes, leaving only 'current-menu-item'
 */

function nav_class_filter( $var ) {
	return is_array($var) ? array_intersect($var, array('current-menu-item')) : '';
}
add_filter('nav_menu_css_class', 'nav_class_filter', 100, 1);

/**
 * Add page slug as nav IDs
 */

function cleanname($v) {
	$v = preg_replace('/[^a-zA-Z0-9s]/', '', $v);
	$v = str_replace(' ', '-', $v);
	$v = strtolower($v);
	return $v;
}

function nav_id_filter( $id, $item ) {
	return 'nav-'.cleanname($item->title);
}
add_filter( 'nav_menu_item_id', 'nav_id_filter', 10, 2 );

/**
 * Limit Search to Illustrators and Events
 */

function SearchFilter($query) {
    if ($query->is_search) {
        $query->set('post_type',array('illustrator','event'));
    }
return $query;
}
add_filter('pre_get_posts','SearchFilter');

/**
 * Use proper ellipses for excerpts
 */

function new_excerpt_more($more) {
	return '&hellip;';
}
add_filter('excerpt_more', 'new_excerpt_more');

function get_socialimage() {
  global $post, $posts;

  $src = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), '', '' );

  if ( has_post_thumbnail($post->ID) ) {
    $socialimg = $src[0];
  } else {
    $socialimg = '';
    $output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches);
    if (array_key_exists(1, $matches))
      if (array_key_exists(0, $matches[1]))
        $socialimg = $matches [1] [0];
  }

  if(empty($socialimg))
    $socialimg = get_template_directory_uri() . '/assets/images/nothumb.png';

  return $socialimg;
}

// For truncating excerpt text in OpenGraph/G+ header

function ellipsis($text, $max=155, $append='...') {
	if (strlen($text) <= $max) return $text;
	$out = substr($text,0,$max);
	if (strpos($text,' ') === FALSE) return $out.$append;
	return preg_replace('/\w+$/','',$out).$append;
}

// facebook share
function facebook_connect() {
	if (is_singular() && is_attachment() !== true ) {
		echo "\n" . '<!-- facebook open graph -->' . "\n";
		echo '<meta property="fb:app_id" content="148674908582475"/>' . "\n";
		global $post;
		$the_excerpt = strip_tags($post->post_content);
		echo '<meta property="og:site_name" content="'. get_bloginfo("name") .'"/>' . "\n";
		echo '<meta property="og:url" content="'. get_permalink() .'"/>' . "\n";
		echo '<meta property="og:title" content="'.get_the_title().'" />' . "\n";
		echo '<meta property="og:type" content="article"/>' . "\n";
		echo '<meta property="og:description" content="'.ellipsis($the_excerpt).'" />' . "\n";
		echo '<meta property="og:image" content="'. get_socialimage() .'"/>' . "\n";
		echo '<!-- end facebook open graph -->' . "\n";
	}
	if (is_home()) {
		echo "\n" . '<!-- facebook open graph -->' . "\n";
		echo '<meta property="fb:app_id" content="148674908582475"/>' . "\n";
		echo '<meta property="og:site_name" content="'. get_bloginfo("name") .'"/>' . "\n";
		echo '<meta property="og:title" content="'. get_bloginfo("name") .'"/>' . "\n";
		echo '<meta property="og:url" content="'. site_url() .'"/>' . "\n";
		echo '<meta property="og:image" content="'. get_socialimage() .'"/>' . "\n";
		echo '<meta property="og:description" content="OCAD U Illustration is an evolving archive and showcase presented by the Illustration Department at OCAD University" />' . "\n";
		echo '<meta property="og:type" content="website"/>' . "\n";
		echo '<!-- end facebook open graph -->' . "\n";
	}
}

// google +1 meta info
function google_header() {
	if (is_singular()  && is_attachment() !== true) {
		echo '<!-- google +1 tags -->' . "\n";
		global $post;
		$the_excerpt = strip_tags($post->post_content);
		echo '<meta itemprop="name" content="'.get_the_title().'">' . "\n";
		echo '<meta itemprop="description" content="'.ellipsis($the_excerpt).'">' . "\n";
		echo '<meta itemprop="image" content="'. get_socialimage() .'">' . "\n";
		echo '<!-- end google +1 tags -->' . "\n";
	}
	if (is_home()) {
		echo '<!-- google +1 tags -->' . "\n";
		echo '<meta itemprop="name" content="'. get_bloginfo("name") .'"/>' . "\n";
		echo '<meta property="description" content="OCAD U Illustration is an evolving archive and showcase presented by the Illustration Department at OCAD University" />' . "\n";
		echo '<meta itemprop="image" content="'. get_socialimage() .'">' . "\n";
		echo '<!-- end google +1 tags -->' . "\n";
	}
}

// general description meta
function plain_description() {
	if (is_singular() && is_attachment() !== true) {
		global $post;
		$the_excerpt = strip_tags($post->post_content);
		echo '<meta name="description" content="'.ellipsis($the_excerpt).'">' . "\n";
	}
	if (is_home()) {
		echo '<meta name="description" content="OCAD U Illustration is an evolving archive and showcase presented by the Illustration Department at OCAD University" />' . "\n";
	}
}
	
// add this in the header 
add_action('wp_head', 'facebook_connect');
add_action('wp_head', 'google_header');
add_action('wp_head', 'plain_description');

// hijack image titles for copyright stuff

function ocadu_gallery_filter( $attr ) {
	global $post;
	if (wp_attachment_is_image()) {
		$postparent = get_the_title($post->post_parent);
		$attr['alt'] = "Illustration by ". $postparent .""; 
		$attr['title'] = "Click for Next Illustration"; 
	} else {
		$attr['alt'] = "Illustration by ". get_the_title() .""; 
		$attr['title'] = "Click to View"; 
	}
	return $attr; 
} 

add_filter( 'wp_get_attachment_image_attributes', 'ocadu_gallery_filter' );

?>