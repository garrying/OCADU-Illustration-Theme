<?php

/**
 * Autocomplete Search Stuff
 */

function ocaduillu_autocomplete_init() {
	// Register our jQuery UI style and our custom javascript file
	wp_register_script( 'acsearch', get_template_directory_uri() . '/assets/js/acsearch.js', array('jquery-ui-autocomplete'),null,true);
	wp_localize_script( 'acsearch', 'AcSearch', array('url' => admin_url( 'admin-ajax.php' )));
	// Function to fire whenever search form is displayed
	add_action( 'get_search_form', 'ocaduillu_autocomplete_search_form' );
	// Functions to deal with the AJAX request - one for logged in users, the other for non-logged in users.
	add_action( 'wp_ajax_ocaduillu_autocompletesearch', 'ocaduillu_autocomplete_suggestions' );
	add_action( 'wp_ajax_nopriv_ocaduillu_autocompletesearch', 'ocaduillu_autocomplete_suggestions' );
}

function ocaduillu_autocomplete_search_form(){
	wp_enqueue_script( 'acsearch' );
}

function ocaduillu_autocomplete_suggestions(){
	// Query for suggestions
	$posts = get_posts( array(
		's' =>$_REQUEST['term'],
	) );
	// Initialise suggestions array
	$suggestions=array();


	global $post;
	foreach ($posts as $post): setup_postdata($post);
		// Initialise suggestion array
		$suggestion = array();
		$suggestion['thumb'] = get_the_post_thumbnail($page->ID, 'thumbnail');
		$suggestion['link'] = get_permalink();
		$suggestion['label'] = esc_html($post->post_title);

		$year = get_the_terms( $post->ID, 'gradyear' );

		foreach( $year as $years ) {
			$suggestion['category'] = $years->name;
		}

		// Add suggestion to suggestions array
		$suggestions[]= $suggestion;
	endforeach;
	// JSON encode and echo
	$response = $_GET["callback"] . "(" . json_encode($suggestions) . ")";
	echo $response;
	// Don't forget to exit!
	exit;
}

add_action( 'init', 'ocaduillu_autocomplete_init' );

/**
 * Enable Featured Images
 */

add_theme_support( 'post-thumbnails' );

/**
 * Setting Content Width
 */

if (!isset( $content_width ) ) $content_width = 900;

/**
 * Wordpress Default Header Cleanup
 */

function ocad_head_cleanup() {
	remove_action( 'wp_head', 'feed_links_extra', 3 ); // Category Feeds
	remove_action( 'wp_head', 'feed_links', 2 ); // Post and Comment Feeds
	remove_action( 'wp_head', 'rsd_link' ); // EditURI link
	remove_action( 'wp_head', 'wlwmanifest_link' ); // Windows Live Writer
	remove_action( 'wp_head', 'index_rel_link' ); // index link
	remove_action( 'wp_head', 'parent_post_rel_link', 10, 0 ); // previous link
	remove_action( 'wp_head', 'start_post_rel_link', 10, 0 ); // start link
	remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0 ); // Links for Adjacent Posts
	remove_action( 'wp_head', 'wp_generator' ); // WP version
	add_filter( 'style_loader_src', 'remove_wp_ver_css_js', 9999 ); // remove WP version from css
	add_filter( 'script_loader_src', 'remove_wp_ver_css_js', 9999 ); // remove Wp version from scripts
}

add_action('init', 'ocad_head_cleanup');

/**
 * Remove WP version from scripts
 */

function remove_wp_ver_css_js( $src ) {
	if ( strpos( $src, 'ver=' ) )
		$src = remove_query_arg( 'ver', $src );
	return $src;
}

/**
 * Load some scripts please.
 */
 
if (!function_exists('load_my_scripts')) {
	function load_scripts() {
		if (!is_admin()) {
			wp_deregister_script('jquery');
			wp_register_script('jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', '','',true);
			wp_enqueue_script('jquery');
			wp_register_script('jqueryCookie', get_template_directory_uri().'/assets/js/lib/jquery.cookie.js', array('jquery'), '', true);
			wp_enqueue_script('jqueryCookie');
			wp_register_script('modernizer', get_template_directory_uri().'/assets/js/lib/modernizr-2.6.2.min.js', '','',false);
			wp_enqueue_script('modernizer');
			wp_register_script('imagesloaded', get_template_directory_uri().'/assets/js/lib/imagesloaded.min.js', array('jquery'), '', true);
			wp_enqueue_script('imagesloaded');
			wp_register_script('packery', get_template_directory_uri().'/assets/js/lib/packery.pkgd.min.js', array('jquery'), '', true);
			wp_enqueue_script('packery');
			wp_register_script('spin', get_template_directory_uri().'/assets/js/lib/spin.min.js', '', '', true);
			wp_enqueue_script('spin');
			wp_register_script('ui', get_template_directory_uri().'/assets/js/ui.min.js', array('jquery'), '', true);
			wp_enqueue_script('ui');
		}
	}
}

add_action('wp_enqueue_scripts', 'load_scripts');

/**
 * Load some styles please.
 */

function load_ocad_styles() {
	wp_register_style('ocadustyles', get_template_directory_uri().'/assets/stylesheets/main.css');
	wp_enqueue_style('ocadustyles');
}

add_action('wp_enqueue_scripts', 'load_ocad_styles');

/**
 * Clean up body_class output
 */

function wp_body_class( $wp_classes, $extra_classes )
{
	$whitelist = array( 'home', 'archive', 'page', 'single', 'category', 'tag', 'error404', 'logged-in', 'admin-bar', 'search' );
	$wp_classes = array_intersect( $wp_classes, $whitelist );
	return array_merge( $wp_classes, (array) $extra_classes );
}

add_filter('body_class', 'wp_body_class', 10, 2);

/**
 * Display navigation to next/previous pages when applicable
 */

if (!function_exists('ocadillu_content_nav')) :
function ocadillu_content_nav( $nav_id ) {
	global $wp_query;

	if ( $wp_query->max_num_pages > 1 ) : ?>
		<nav id="<?php echo $nav_id; ?>">
			<h3 class="assistive-text"><?php _e( 'Post navigation', 'ocaduillustration' ); ?></h3>
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

add_filter('gallery_style', 'my_gallery_style', 99);
add_filter('use_default_gallery_style', '__return_false');

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
	'primary' => __('Primary Navigation', 'ocaduillustration'),
));

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
		$query->set('post_type',array('illustrator'));
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

/**
 * Get Social Image
 */

function get_socialimage() {
	global $post, $posts;

	if(is_single() && has_post_thumbnail($post->ID) ) {
		$src = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'thumbnail', '' );
		$socialimg = $src[0];
	} else {
		$socialimg = '';
	}

	if(empty($socialimg))
		$socialimg = get_template_directory_uri() . '/assets/images/nothumb.png';

	return $socialimg;
}

/**
 * For truncating excerpt text in OpenGraph/G+ header
 */

function ellipsis($text, $max=155, $append='...') {
	if (strlen($text) <= $max) return $text;
	$out = substr($text,0,$max);
	if (strpos($text,' ') === FALSE) return $out.$append;
	return preg_replace('/\w+$/','',$out).$append;
}

/**
 * Facebook share
 */

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
		echo '<meta property="og:description" content="An archive and showcase presented by the Illustration Department at OCAD U featuring work from the graduating class of 2013." />' . "\n";
		echo '<meta property="og:type" content="website"/>' . "\n";
		echo '<!-- end facebook open graph -->' . "\n";
	}
}

/**
 * Google +1 meta info
 */

function google_header() {
	if (is_singular() && is_attachment() !== true) {
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
		echo '<meta itemprop="name" content="'. get_bloginfo("name") .'">' . "\n";
		echo '<meta itemprop="description" content="An archive and showcase presented by the Illustration Department at OCAD U featuring work from the graduating class of 2013.">' . "\n";
		echo '<meta itemprop="image" content="'. get_socialimage() .'">' . "\n";
		echo '<!-- end google +1 tags -->' . "\n";
	}
}

/**
 * General description meta
 */

function plain_description() {
	if (is_singular() && is_attachment() !== true) {
		global $post;
		$the_excerpt = strip_tags($post->post_content);
		echo '<meta name="description" content="'.ellipsis($the_excerpt).'">' . "\n";
	}
	if (is_home()) {
		echo '<meta name="description" content="An archive and showcase presented by the Illustration Department at OCAD U featuring work from the graduating class of 2013." />' . "\n";
	}
}

/**
 * Prefetch Illustrator Pages
 */

function html_prefetch() {
	if (is_single() && is_attachment() !== true) {
		$theUrl = next_post_link_plus( array('order_by' => 'post_title', 'in_same_tax' => true, 'return' => 'href') );
		echo '<!-- prefetch and render -->' . "\n";
		echo '<link rel="prefetch" href="'.$theUrl.'">' . "\n";
		echo '<link rel="prerender" href="'.$theUrl.'">' . "\n";
	}
}

add_action('wp_head', 'facebook_connect');
add_action('wp_head', 'google_header');
add_action('wp_head', 'plain_description');
add_action('wp_head', 'html_prefetch');

/**
 * Hijack image titles for copyright alt
 */

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

/**
 * Simplify post classes
 */

function simplify_post_class($classes) {
	global $post;

	foreach($classes as $id => $class)

		if( (strpos($class, "tag-") !== false) 
		|| (strpos($class, "format-") !== false)
		|| (strpos($class, "type-") !== false) 
		|| (strpos($class, "status-") !== false)
		|| (strpos($class, "category-") !== false)
		|| $class == "")
		{
			unset($classes[$id]);
		}

	return $classes;
}

add_filter('post_class', 'simplify_post_class');

?>