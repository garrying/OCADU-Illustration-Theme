<?php
if (!function_exists('ocaduillustration_setup')):
  function ocaduillustration_setup()
  {
    /**
     * Enable Featured Images
     */
    add_theme_support('post-thumbnails');

    /*
     * Add image size
     */
    add_image_size('illustrator-social-twitter', 560);
    add_image_size('illustrator-small', 300);
    add_image_size('illustrator-extra-small', 150);
    add_image_size('illustrator-icon', 100, 100, true);

    /**
     * Let WordPress Manage The Document Title
     */
    add_theme_support('title-tag');

    /**
     * HTML5 Markup
     */
    add_theme_support('html5', [
      'search-form',
      'comment-form',
      'comment-list',
      'gallery',
      'caption',
      'style',
      'script',
    ]);

    /**
     * Add custom menu using wp_nav_menu()
     */
    register_nav_menus([
      'primary' => __('Primary Navigation', 'ocaduillustration'),
    ]);
  }
endif;

add_action('after_setup_theme', 'ocaduillustration_setup');

/**
 * WordPress Default Header Cleanup
 */
function ocaduillustration_head_cleanup()
{
  remove_action('wp_head', 'feed_links_extra', 3); // Category Feeds.
  remove_action('wp_head', 'feed_links', 2); // Post and Comment Feeds.
  remove_action('wp_head', 'rsd_link'); // EditURI link.
  remove_action('wp_head', 'wlwmanifest_link'); // Windows Live Writer.
  remove_action('wp_head', 'index_rel_link'); // index link.
  remove_action('wp_head', 'parent_post_rel_link', 10, 0); // previous link.
  remove_action('wp_head', 'start_post_rel_link', 10, 0); // start link.
  remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0); // Links for Adjacent Posts.
  remove_action('wp_head', 'wp_generator'); // WP version.
  remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0); // Shortlinks.
  add_filter(
    'style_loader_src',
    'ocaduillustration_remove_wp_ver_css_js',
    9999
  ); // remove WP version from css.
  add_filter(
    'script_loader_src',
    'ocaduillustration_remove_wp_ver_css_js',
    9999
  ); // remove Wp version from scripts.
}

add_action('init', 'ocaduillustration_head_cleanup');

/**
 * Remove WP version from scripts
 *
 * @param string $src provides function with string to remove version numbers.
 *
 * @return string
 */
function ocaduillustration_remove_wp_ver_css_js($src)
{
  $ver_var = strpos($src, 'ver=');
  if ($ver_var) {
    $src = remove_query_arg('ver', $src);
  }
  return $src;
}

/**
 * Load some scripts please.
 */
if (!function_exists('ocaduillustration_scripts')) {
  function ocaduillustration_scripts()
  {
    if (!is_admin()) {
      wp_deregister_script('wp-embed');
      wp_register_script(
        'app',
        get_template_directory_uri() . '/assets/dist/app.js?1746494352',
        '',
        '2025',
        true
      );
      wp_enqueue_script('app');
    }
    if (is_home()) {
      wp_register_script(
        'home',
        get_template_directory_uri() . '/assets/dist/home.js?1746494352',
        '',
        '2025',
        true
      );
      wp_enqueue_script('home');
    }
  }
}

add_action('wp_enqueue_scripts', 'ocaduillustration_scripts');

/**
 * Load some styles please.
 */

function ocaduillustration_styles()
{
  wp_register_style(
    'ocadustyles',
    get_template_directory_uri() . '/assets/dist/main.css?1746494352',
    '',
    '2025'
  );
  wp_enqueue_style('ocadustyles');
}

add_action('wp_enqueue_scripts', 'ocaduillustration_styles');

/**
 * Clean up body_class output
 *
 * @param array  $extra_classes extra classes to add to body class.
 *
 * @return array
 */
function ocaduillustration_body_class($wp_classes, $extra_classes)
{
  $whitelist = [
    'home',
    'archive',
    'page',
    'single',
    'category',
    'tag',
    'error404',
    'logged-in',
    'admin-bar',
    'search',
  ];
  $wp_classes = array_intersect($wp_classes, $whitelist);
  return array_merge($wp_classes, (array) $extra_classes);
}

add_filter('body_class', 'ocaduillustration_body_class', 10, 2);

/**
 * Display navigation to next/previous pages when applicable
 */
if (!function_exists('ocaduillustration_content_nav')):
  function ocaduillustration_content_nav($nav_id)
  {
    global $wp_query;

    if ($wp_query->max_num_pages > 1): ?>
    <nav id="<?php echo esc_attr($nav_id); ?>">
      <h3 class="assistive-text"><?php esc_html_e(
        'Post navigation',
        'ocaduillustration'
      ); ?></h3>
      <div class="nav-next"><?php next_posts_link(
        __(
          'Next Page <span class="meta-nav">&rarr;</span>',
          'ocaduillustration'
        )
      ); ?></div>
      <div class="nav-previous"><?php previous_posts_link(
        __(
          '<span class="meta-nav">&larr;</span> Previous Page',
          'ocaduillustration'
        )
      ); ?></div>
    </nav><!-- #nav-above -->
  <?php endif;
  }
endif;

/**
 * Remove inline css from gallery shortcode
 */
function ocaduillustration_gallery_style_override()
{
  return "<div id='pack-content' class='flex flex-wrap gallery-grid'><div class='grid-col grid-col-1'></div>
  <div class='grid-col grid-col-2'></div>
  <div class='grid-col grid-col-3'></div>
  <div class='grid-col grid-col-4'></div>";
}

add_filter('gallery_style', 'ocaduillustration_gallery_style_override', 99);
add_filter('use_default_gallery_style', '__return_false');

/**
 * Reduce nav classes, leaving only 'current-menu-item'
 *
 * @param array $menuclasses takes the default wp menu classes.
 *
 * @return array
 */
function ocaduillustration_nav_class_filter($menuclasses)
{
  return is_array($menuclasses)
    ? array_intersect($menuclasses, ['current-menu-item'])
    : '';
}

add_filter('nav_menu_css_class', 'ocaduillustration_nav_class_filter', 100, 1);

/**
 * Add page slug as nav IDs
 *
 * @param string $v normalizes navigation ids.
 */
function ocaduillustration_cleanname($v)
{
  $v = preg_replace('/[^a-zA-Z0-9s]/', '', $v);
  $v = str_replace(' ', '-', $v);
  $v = strtolower($v);
  return $v;
}

function ocaduillustration_nav_id_filter($id, $item)
{
  return 'nav-' . ocaduillustration_cleanname($item->title);
}

add_filter('nav_menu_item_id', 'ocaduillustration_nav_id_filter', 10, 2);

/**
 * Limit Search to Illustrators and Events
 */
function ocaduillustration_search_filter($query)
{
  if ($query->is_search && $query->is_main_query() && !is_admin()) {
    $query->set('post_type', ['illustrator']);
  }
  return $query;
}

add_filter('pre_get_posts', 'ocaduillustration_search_filter');

/**
 * Use proper ellipses for excerpts
 *
 * @return string
 */
function ocaduillustration_new_excerpt_more()
{
  return '&hellip;';
}

add_filter('excerpt_more', 'ocaduillustration_new_excerpt_more');

/**
 * Get Social Image
 *
 * @return string
 */
function ocaduillustration_get_socialimage()
{
  global $post, $posts;

  if (is_single() && has_post_thumbnail($post->ID)) {
    $src = wp_get_attachment_image_src(
      get_post_thumbnail_id($post->ID),
      'medium',
      ''
    );

    $socialimg = $src[0];
  } else {
    $socialimg = '';
  }

  if (empty($socialimg)) {
    $socialimg = get_template_directory_uri() . '/thumb.jpg';
  }

  return $socialimg;
}

/**
 * Open Graph
 */
function ocaduillustration_social_meta()
{
  echo "\n" . '<!-- social meta -->' . "\n";
  echo '<meta property="og:site_name" content="' .
    esc_html(get_bloginfo('name')) .
    '">' .
    "\n";
  if (is_singular() && is_attachment() !== true) {
    global $post;
    $the_excerpt = wptexturize(wp_strip_all_tags($post->post_content));
    $ocaduillustration_year_image = wp_get_attachment_image_src(
      get_post_thumbnail_id($post->ID),
      'illustrator-icon',
      ''
    );
    echo '<meta property="og:url" content="' .
      esc_url(get_permalink()) .
      '">' .
      "\n";
    echo '<meta property="og:title" content="' .
      esc_attr(get_the_title()) .
      '">' .
      "\n";
    echo '<meta property="og:type" content="article">' . "\n";
    echo '<meta property="og:description" content="' .
      esc_html($the_excerpt) .
      '">' .
      "\n";
    echo '<meta property="og:image" content="' .
      esc_url(ocaduillustration_get_socialimage()) .
      '">' .
      "\n";

    echo '<meta name="description" content="' .
      esc_html($the_excerpt) .
      '">' .
      "\n";
    if ($ocaduillustration_year_image) {
      echo '<link rel="shortcut icon" href="' .
        esc_html($ocaduillustration_year_image[0]) .
        '">' .
        "\n"; // phpcs:ignore
    }
  }
  if (is_home() || is_archive()) {
    $social_description =
      'Presented by the Illustration Program at OCAD U featuring work from the graduating class of 2025.';
    if (is_home()) {
      $social_title = get_bloginfo('name');
    } else {
      $selected_year = single_term_title('', false);
      $social_title = get_bloginfo('name') . ' ' . $selected_year;
    }

    echo '<meta property="og:title" content="' .
      esc_html($social_title) .
      '">' .
      "\n";
    echo '<meta property="og:url" content="' .
      esc_url(site_url()) .
      '">' .
      "\n";
    echo '<meta property="og:image" content="' .
      esc_url(ocaduillustration_get_socialimage()) .
      '">' .
      "\n";
    echo '<meta property="og:description" content="' .
      esc_html($social_description) .
      '">' .
      "\n";
    echo '<meta property="og:type" content="website">' . "\n";

    echo '<meta name="description" content="' .
      esc_html($social_description) .
      '">' .
      "\n";
  }
  echo '<!-- end social meta -->' . "\n";
}

function ocaduillustration_remove_tax_name($title, $sep, $seplocation)
{
  if (is_tax()) {
    $term_title = single_term_title('', false);

    // Determines position of separator.
    if ('right' === $seplocation) {
      $title = $term_title . " $sep " . get_bloginfo('name');
    } else {
      $title = get_bloginfo('name') . " $sep " . $term_title;
    }
  }

  return $title;
}

add_filter('wp_title', 'ocaduillustration_remove_tax_name', 10, 3);

add_action('wp_head', 'ocaduillustration_social_meta');

/**
 * Hijack image titles for copyright alt
 *
 * @param string $attr takes gallery image attributes.
 *
 * @return string
 */
function ocaduillustration_gallery_filter($attr, $attachment)
{
  global $post;
  $attr['data-sizes'] = 'auto';
  if (isset($attr['srcset'])) {
    $attr['data-srcset'] = $attr['srcset'];
    unset($attr['srcset']);
    unset($attr['sizes']);
    if (is_home() || is_archive() || is_search()) {
      $attr['src'] =
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' .
        wp_get_attachment_image_src($attachment->ID, 'large')[1] .
        ' ' .
        wp_get_attachment_image_src($attachment->ID, 'large')[2] .
        '"%3E%3C/svg%3E';
      $attr['data-src'] = get_the_post_thumbnail_url(
        $post,
        'illustrator-extra-small'
      );
    } else {
      $attachment_small = wp_get_attachment_image_src(
        $attachment->ID,
        'illustrator-extra-small'
      );
      $attr['data-src'] = $attachment_small[0];
    }
  }
  $attr['alt'] = 'Illustration by ' . get_the_title() . '';
  $attr['class'] = 'lazyload blur-up';
  if (is_home() || is_archive()) {
    unset($attr['title']);
  } else {
    $attr['title'] = 'Enlarge';
  }
  return $attr;
}

if (!is_admin()) {
  add_filter(
    'wp_get_attachment_image_attributes',
    'ocaduillustration_gallery_filter',
    10,
    2
  );
}

/**
 * Adding data attributes to clean stuff up
 *
 * @param mixed   $markup regular markup from gallery.
 *
 * @param integer $id the post id.
 *
 * @param mixed   $size size of gallery item.
 *
 * @param string  $permalink the link to the asset.
 */
function ocaduillustration_modify_attachment_link(
  $markup,
  $id,
  $size,
  $permalink
) {
  global $post;
  $image_url = wp_get_attachment_image_src($id, 'full');
  $image_srcset = wp_get_attachment_image_srcset($id);
  $image_sizes = wp_get_attachment_image_sizes($id, 'large');
  $image_caption = esc_html(wpautop(get_post($id)->post_excerpt));

  $image_data = wp_get_attachment_image_src($id, 'large');
  $image_width = $image_data[1];
  $image_height = $image_data[2];

  if (!$permalink) {
    $markup = str_replace(
      '<a href',
      '<a class="gallery-icon-anchor" data-srcset="' .
        $image_srcset .
        '" data-src-large="' .
        $image_url[0] .
        '" data-caption="' .
        $image_caption .
        '" data-sizes="' .
        $image_sizes .
        '" href',
      $markup
    );
  }
  return $markup;
}

add_filter(
  'wp_get_attachment_link',
  'ocaduillustration_modify_attachment_link',
  10,
  4
);

/**
 * Simplify post classes
 *
 * @param array $classes takes the post class and cleans it.
 *
 * @return array
 */
function ocaduillustration_simplify_post_class($classes)
{
  global $post;

  foreach ($classes as $id => $class) {
    if (
      strpos($class, 'tag-') !== false ||
      strpos($class, 'format-') !== false ||
      strpos($class, 'type-') !== false ||
      strpos($class, 'status-') !== false ||
      strpos($class, 'category-') !== false ||
      '' === $class
    ) {
      unset($classes[$id]);
    }
  }
  return $classes;
}

add_filter('post_class', 'ocaduillustration_simplify_post_class');

/**
 * Remove emoji
 */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

/**
 * Disable gutenberg style in Front
 */
function ocaduillustration_wps_deregister_styles()
{
  wp_dequeue_style('global-styles');
  wp_dequeue_style('wp-block-library');
}

add_action(
  'wp_enqueue_scripts',
  'ocaduillustration_wps_deregister_styles',
  100
);

// Removes the decoding attribute from images added inside post content.
add_filter('wp_img_tag_add_decoding_attr', '__return_false');

// Remove the decoding attribute from featured images and the Post Image block.
add_filter('wp_get_attachment_image_attributes', function ($attributes) {
  unset($attributes['decoding']);
  return $attributes;
});

?>
