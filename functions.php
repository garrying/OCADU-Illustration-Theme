<?php

/**
*
* OCAD U Illustration Setup
*
**/

if ( ! function_exists( 'ocadu_setup' ) ) :
  function ocadu_setup() {

    /**
     * Enable Featured Images
     */

    add_theme_support( 'post-thumbnails' );

    /*
     * Add image size 
     */
    
    add_image_size( 'illustrator-social-twitter', 560 );

    /**
     * Let WordPress Manage The Document Title
     */

    add_theme_support( 'title-tag' );

    /**
     * HTML5 Markup
     */

    add_theme_support( 'html5', array(
      'search-form', 'comment-form', 'comment-list', 'gallery', 'caption'
    ));

    /**
     * Add custom menu using wp_nav_menu()
     */

    register_nav_menus( array(
      'primary' => __('Primary Navigation', 'ocaduillustration'),
    ));

    /**
     * Add custom image size
     */

    add_image_size( 'illustrator-small', 300 );

  }
endif;

add_action( 'after_setup_theme', 'ocadu_setup' );


/**
 * Wordpress Default Header Cleanup
 */

function ocadu_head_cleanup() {
  remove_action( 'wp_head', 'feed_links_extra', 3 ); // Category Feeds
  remove_action( 'wp_head', 'feed_links', 2 ); // Post and Comment Feeds
  remove_action( 'wp_head', 'rsd_link' ); // EditURI link
  remove_action( 'wp_head', 'wlwmanifest_link' ); // Windows Live Writer
  remove_action( 'wp_head', 'index_rel_link' ); // index link
  remove_action( 'wp_head', 'parent_post_rel_link', 10, 0 ); // previous link
  remove_action( 'wp_head', 'start_post_rel_link', 10, 0 ); // start link
  remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0 ); // Links for Adjacent Posts
  remove_action( 'wp_head', 'wp_generator' ); // WP version
  remove_action( 'wp_head', 'wp_shortlink_wp_head', 10, 0 ); // Shortlinks
  add_filter( 'style_loader_src', 'remove_wp_ver_css_js', 9999 ); // remove WP version from css
  add_filter( 'script_loader_src', 'remove_wp_ver_css_js', 9999 ); // remove Wp version from scripts
}

add_action('init', 'ocadu_head_cleanup');

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
 
if (!function_exists('ocadu_scripts')) {
  function ocadu_scripts() {
    if (!is_admin()) {
      wp_deregister_script('jquery');
      wp_register_script('jquery', '//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js', '','',true);
      wp_enqueue_script('jquery');
      wp_register_script('app', get_template_directory_uri().'/assets/dist/js/app.min.js?04222015', array('jquery'), '', true);
      wp_enqueue_script('app');
    }
  }
}

add_action('wp_enqueue_scripts', 'ocadu_scripts');

/**
 * Load some styles please.
 */

function ocadu_styles() {
  wp_register_style('ocadustyles', get_template_directory_uri().'/assets/dist/stylesheets/main.css?04222015');
  wp_enqueue_style('ocadustyles');
}

add_action('wp_enqueue_scripts', 'ocadu_styles');

/**
 * Clean up body_class output
 */

function ocadu_body_class( $wp_classes, $extra_classes )
{
  $whitelist = array( 'home', 'archive', 'page', 'single', 'category', 'tag', 'error404', 'logged-in', 'admin-bar', 'search' );
  $wp_classes = array_intersect( $wp_classes, $whitelist );
  return array_merge( $wp_classes, (array) $extra_classes );
}

add_filter('body_class', 'ocadu_body_class', 10, 2);

/**
 * Display navigation to next/previous pages when applicable
 */

if (!function_exists('ocadu_content_nav')) :
function ocadu_content_nav( $nav_id ) {
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

function ocadu_gallery_style_override() {
  return "<div id='pack-content' class='gallery'>";
}

add_filter('gallery_style', 'ocadu_gallery_style_override', 99);
add_filter('use_default_gallery_style', '__return_false');

/**
 * Clean titles for image attachments
 */
  
// function set_page_title($title) {
//   if (wp_attachment_is_image()) {
//     global $post;
//     $postparent = get_the_title($post->post_parent) . " | ";
//     $title = $postparent;
//   }
//   return $title;
// }

// add_filter('wp_title', 'set_page_title');

/**
 * Reduce nav classes, leaving only 'current-menu-item'
 */

function ocadu_nav_class_filter( $var ) {
  return is_array($var) ? array_intersect($var, array('current-menu-item')) : '';
}

add_filter('nav_menu_css_class', 'ocadu_nav_class_filter', 100, 1);

/**
 * Add page slug as nav IDs
 */

function cleanname($v) {
  $v = preg_replace('/[^a-zA-Z0-9s]/', '', $v);
  $v = str_replace(' ', '-', $v);
  $v = strtolower($v);
  return $v;
}

function ocadu_nav_id_filter( $id, $item ) {
  return 'nav-'.cleanname($item->title);
}

add_filter( 'nav_menu_item_id', 'ocadu_nav_id_filter', 10, 2 );

/**
 * Limit Search to Illustrators and Events
 */

function ocadu_search_filter($query) {
  if ($query->is_search) {
    $query->set('post_type',array('illustrator'));
  }
  return $query;
}

add_filter('pre_get_posts','ocadu_search_filter');

/**
 * Use proper ellipses for excerpts
 */

function ocadu_new_excerpt_more($more) {
  return '&hellip;';
}

add_filter('excerpt_more', 'ocadu_new_excerpt_more');

/**
 * Get Social Image
 */

function get_socialimage() {
  global $post, $posts;

  if(is_single() && has_post_thumbnail($post->ID) ) {
    $src = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'illustrator-social', '' );
    $socialimg = $src[0];
  } else {
    $socialimg = '';
  }

  if(empty($socialimg))
    $socialimg = get_template_directory_uri() . '/thumb.png';

  return $socialimg;
}


/**
 * Open Graph
 */

function ocadu_social_meta() {
  echo "\n" . '<!-- social meta -->' . "\n";
  echo '<meta property="fb:app_id" content="148674908582475">' . "\n";
  echo '<meta property="og:site_name" content="'. get_bloginfo("name") .'">' . "\n";
  if (is_singular() && is_attachment() !== true ) {
    global $post;
    $the_excerpt = wptexturize(strip_tags($post->post_content));
    echo '<meta property="og:url" content="'. get_permalink() .'">' . "\n";
    echo '<meta property="og:title" content="'. get_the_title() .'">' . "\n";
    echo '<meta property="og:type" content="article"/>' . "\n";
    echo '<meta property="og:description" content="'. $the_excerpt .'">' . "\n";
    echo '<meta property="og:image" content="'. get_socialimage() .'">' . "\n";

    echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
    echo '<meta name="twitter:site" content="@ocaduillu">' . "\n";
    echo '<meta name="twitter:title" content="'. get_the_title() .'">' . "\n";
    echo '<meta name="twitter:description" content="'. $the_excerpt .'">' . "\n";
    echo '<meta name="twitter:image:src" content="'. get_socialimage() .'">' . "\n";

  }
  if (is_home() || is_archive()) {
    if (is_home()) {
      echo '<meta property="og:title" content="'. get_bloginfo("name") .'">' . "\n";
    } else {
      $selected_year = single_term_title('', false);
      echo '<meta property="og:title" content="'. get_bloginfo("name") ." ". $selected_year .'">' . "\n";
    }
    echo '<meta property="og:url" content="'. site_url() .'">' . "\n";
    echo '<meta property="og:image" content="'. get_socialimage() .'">' . "\n";
    echo '<meta property="og:description" content="An archive and showcase presented by the Illustration Department at OCAD U featuring work from the graduating class of 2015.">' . "\n";
    echo '<meta property="og:type" content="website">' . "\n";

    echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
    echo '<meta name="twitter:site" content="@ocaduillu">' . "\n";
    echo '<meta name="twitter:title" content="'. get_bloginfo("name") .'">' . "\n";
    echo '<meta name="twitter:description" content="An archive and showcase presented by the Illustration Department at OCAD U featuring work from the graduating class of 2015.">' . "\n";
    echo '<meta name="twitter:image:src" content="'. get_socialimage() .'">' . "\n";

  }
  echo '<!-- end social meta -->' . "\n";

}

/**
 * General description meta
 */

function ocadu_plain_description() {
  if (is_singular() && is_attachment() !== true) {
    global $post;
    $the_excerpt = strip_tags($post->post_content);
    echo '<meta name="description" content="'. $the_excerpt .'">' . "\n";
  }
  if (is_home() || is_archive()) {
    echo '<meta name="description" content="An archive and showcase presented by the Illustration Department at OCAD U featuring work from the graduating class of 2015.">' . "\n";
  }
}


function ocadu_remove_tax_name( $title, $sep, $seplocation ) {
  if ( is_tax() ) {
    $term_title = single_term_title( '', false );

    // Determines position of separator
    if ( 'right' == $seplocation ) {
      $title = $term_title . " $sep " . get_bloginfo("name");
    } else {
      $title = get_bloginfo("name") . " $sep " . $term_title;
    }
  }

  return $title;
}

add_filter( 'wp_title', 'ocadu_remove_tax_name', 10, 3 );


/**
 * Prefetch Illustrator Pages
 */

function ocadu_prefetch() {
  if (is_single() && is_attachment() !== true) {
    $theUrl = next_post_link_plus( array('order_by' => 'post_title', 'in_same_tax' => true, 'return' => 'href') );
    echo '<!-- prefetch and render -->' . "\n";
    echo '<link rel="prefetch" href="'.$theUrl.'">' . "\n";
    echo '<link rel="prerender" href="'.$theUrl.'">' . "\n";
  }
}

add_action('wp_head', 'ocadu_social_meta');
add_action('wp_head', 'ocadu_plain_description');
add_action('wp_head', 'ocadu_prefetch');

/**
 * Hijack image titles for copyright alt
 */

function ocadu_gallery_filter( $attr ) {
  global $post;
  $attr['alt'] = "Illustration by ". get_the_title() ."";
  if (is_home() || is_archive()) {
    $attr['title'] = get_the_title();
  } else {
    $attr['title'] = 'Enlarge';
  }
  return $attr; 
}

add_filter( 'wp_get_attachment_image_attributes', 'ocadu_gallery_filter' );

/**
 * Adding data attributes to clean stuff up
 */

function ocadu_modify_attachment_link( $markup, $id, $size, $permalink ) {
  global $post;
  $thumbnailURL = wp_get_attachment_image_src($id,'medium')[0];
  if ( ! $permalink ) {
    $markup = str_replace( '<a href', '<a data-thumbnail="'. $thumbnailURL .'"  href', $markup );
  }
  return $markup;
}

add_filter( 'wp_get_attachment_link', 'ocadu_modify_attachment_link', 10, 4 );

/**
 * Simplify post classes
 */

function ocadu_simplify_post_class($classes) {
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

add_filter('post_class', 'ocadu_simplify_post_class');

/**
 * Remove emoji
 */

remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

?>