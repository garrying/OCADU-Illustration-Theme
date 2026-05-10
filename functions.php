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
    9999,
  ); // remove WP version from css.
  add_filter(
    'script_loader_src',
    'ocaduillustration_remove_wp_ver_css_js',
    9999,
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
        get_template_directory_uri() . '/assets/dist/app.js?1778370981',
        '',
        '2026',
        true,
      );
      wp_enqueue_script('app');
    }
    if (is_home()) {
      wp_register_script(
        'home',
        get_template_directory_uri() . '/assets/dist/home.js?1778370981',
        '',
        '2026',
        true,
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
    get_template_directory_uri() . '/assets/dist/main.css?1778370981',
    '',
    '2026',
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
        'ocaduillustration',
      ); ?></h3>
      <div class="nav-next"><?php next_posts_link(
        __(
          'Next Page <span class="meta-nav">&rarr;</span>',
          'ocaduillustration',
        ),
      ); ?></div>
      <div class="nav-previous"><?php previous_posts_link(
        __(
          '<span class="meta-nav">&larr;</span> Previous Page',
          'ocaduillustration',
        ),
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
  $v = preg_replace('/[^a-zA-Z0-9\s]/', '', $v);
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
 * Build a term_id => [thumb_attachment_id, ...] map across all gradyear terms.
 *
 * Cached in a transient so the year-select panel in the header can pick
 * a random thumbnail per pageload (in PHP) without firing a WP_Query
 * per term on every load.
 *
 * @return array
 */
function ocaduillustration_year_thumb_ids()
{
  $cached = get_transient('ocaduillustration_year_thumb_ids');
  if (false !== $cached) {
    return $cached;
  }

  $out = [];
  $terms = get_terms([
    'taxonomy' => 'gradyear',
    'hide_empty' => true,
    'order' => 'DESC',
    'parent' => 0,
  ]);

  if (is_wp_error($terms) || empty($terms)) {
    return $out;
  }

  foreach ($terms as $ocaduillustration_term) {
    $ocaduillustration_query = new WP_Query([
      'posts_per_page' => -1,
      'post_type' => 'illustrator',
      'gradyear' => $ocaduillustration_term->slug,
      'no_found_rows' => true,
      'fields' => 'ids',
    ]);

    $ocaduillustration_thumb_ids = [];
    foreach ($ocaduillustration_query->posts as $ocaduillustration_pid) {
      $ocaduillustration_tid = get_post_thumbnail_id($ocaduillustration_pid);
      if ($ocaduillustration_tid) {
        $ocaduillustration_thumb_ids[] = $ocaduillustration_tid;
      }
    }

    if (!empty($ocaduillustration_thumb_ids)) {
      $out[$ocaduillustration_term->term_id] = $ocaduillustration_thumb_ids;
    }
  }

  set_transient('ocaduillustration_year_thumb_ids', $out, DAY_IN_SECONDS);
  return $out;
}

/**
 * Build a gradyear-slug => ordered post ID list map for illustrators.
 *
 * Used by single-illustrator prev/next nav so each detail page doesn't run
 * a full WP_Query of every illustrator in the year on every request.
 *
 * @return array<string, int[]>
 */
function ocaduillustration_year_post_ids()
{
  $cached = get_transient('ocaduillustration_year_post_ids');
  if (false !== $cached) {
    return $cached;
  }

  $out = [];
  $terms = get_terms([
    'taxonomy' => 'gradyear',
    'hide_empty' => true,
  ]);

  if (is_wp_error($terms) || empty($terms)) {
    return $out;
  }

  foreach ($terms as $ocaduillustration_term) {
    $ocaduillustration_query = new WP_Query([
      'post_status' => 'publish',
      'post_type' => 'illustrator',
      'gradyear' => $ocaduillustration_term->slug,
      'orderby' => 'title',
      'order' => 'ASC',
      'posts_per_page' => -1,
      'no_found_rows' => true,
      'fields' => 'ids',
      'update_post_meta_cache' => false,
      'update_post_term_cache' => false,
    ]);
    $out[$ocaduillustration_term->slug] = $ocaduillustration_query->posts;
  }

  set_transient('ocaduillustration_year_post_ids', $out, DAY_IN_SECONDS);
  return $out;
}

function ocaduillustration_bust_year_post_ids()
{
  delete_transient('ocaduillustration_year_post_ids');
}

add_action('save_post_illustrator', 'ocaduillustration_bust_year_post_ids');
add_action('deleted_post', 'ocaduillustration_bust_year_post_ids');

if (!function_exists('ocaduillustration_year_item_navigation')) {
  function ocaduillustration_year_item_navigation(
    $term_obj,
    $term_active,
    $term_image,
    $term_srcset,
  ) {
    return "<a class='year-item " .
      esc_attr($term_active) .
      "' href='" .
      esc_url(get_term_link($term_obj->slug, 'gradyear')) .
      "' title='View Work From " .
      esc_attr($term_obj->name) .
      "'><span class='year-text'>" .
      esc_html($term_obj->name) .
      "</span><img srcset='" .
      esc_attr($term_srcset) .
      "' loading='lazy' width='300' height='460' src='" .
      esc_url($term_image) .
      "' sizes='300px' class='year-item-image' alt='Illustration work from " .
      esc_attr($term_obj->name) .
      " graduating class' /></a>";
  }
}

function ocaduillustration_bust_year_thumb_ids()
{
  delete_transient('ocaduillustration_year_thumb_ids');
}

add_action('save_post_illustrator', 'ocaduillustration_bust_year_thumb_ids');
add_action('edited_gradyear', 'ocaduillustration_bust_year_thumb_ids');
add_action('created_gradyear', 'ocaduillustration_bust_year_thumb_ids');
add_action('delete_term', 'ocaduillustration_bust_year_thumb_ids');

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
 * @return array{0:string,1:int,2:int} [url, width, height]
 */
function ocaduillustration_get_socialimage()
{
  $img = null;

  if (is_singular() && has_post_thumbnail()) {
    $img = wp_get_attachment_image_src(
      get_post_thumbnail_id(),
      'illustrator-social-twitter',
    );
  } elseif (is_tax('gradyear')) {
    $term = get_queried_object();
    if ($term && isset($term->term_id)) {
      $thumb_map = ocaduillustration_year_thumb_ids();
      if (!empty($thumb_map[$term->term_id])) {
        $first = reset($thumb_map[$term->term_id]);
        $img = wp_get_attachment_image_src(
          $first,
          'illustrator-social-twitter',
        );
      }
    }
  }

  if (!$img) {
    $img = [get_template_directory_uri() . '/thumb.jpg', 1200, 630];
  }

  return $img;
}

/**
 * Build a short, single-line description from a post excerpt.
 *
 * @return string
 */
function ocaduillustration_meta_description_from_post()
{
  $excerpt = wp_strip_all_tags(get_the_excerpt(), true);
  $excerpt = preg_replace('/\s+/', ' ', $excerpt);
  if (mb_strlen($excerpt) > 160) {
    $excerpt = rtrim(mb_substr($excerpt, 0, 157)) . '…';
  }
  return wptexturize($excerpt);
}

/**
 * Open Graph
 */
function ocaduillustration_social_meta()
{
  $social_image = ocaduillustration_get_socialimage();
  $social_image_w = (int) $social_image[1];
  $social_image_h = (int) $social_image[2];

  echo "\n" . '<!-- social meta -->' . "\n";
  echo '<meta property="og:site_name" content="' .
    esc_attr(get_bloginfo('name')) .
    '">' .
    "\n";
  echo '<meta property="og:locale" content="en_US">' . "\n";

  if (is_singular() && !is_attachment()) {
    $description = ocaduillustration_meta_description_from_post();
    $ocaduillustration_year_image = wp_get_attachment_image_src(
      get_post_thumbnail_id(),
      'illustrator-icon',
      '',
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
      esc_attr($description) .
      '">' .
      "\n";
    echo '<meta property="og:image" content="' .
      esc_url($social_image[0]) .
      '">' .
      "\n";
    echo '<meta property="og:image:width" content="' .
      esc_attr($social_image_w) .
      '">' .
      "\n";
    echo '<meta property="og:image:height" content="' .
      esc_attr($social_image_h) .
      '">' .
      "\n";

    echo '<meta name="description" content="' .
      esc_attr($description) .
      '">' .
      "\n";
    if ($ocaduillustration_year_image) {
      echo '<link rel="shortcut icon" href="' .
        esc_url($ocaduillustration_year_image[0]) .
        '">' .
        "\n";
    }
  } elseif (is_home() || is_front_page() || is_archive()) {
    $social_description =
      'Presented by the Illustration Program at OCAD U featuring work from the graduating class of 2026.';

    if (is_home() || is_front_page()) {
      $social_title = get_bloginfo('name');
      $social_url = home_url('/');
    } elseif (is_tax()) {
      $term = get_queried_object();
      $social_title = get_bloginfo('name') . ' ' . single_term_title('', false);
      $social_url = $term ? get_term_link($term) : home_url('/');
      if (is_wp_error($social_url)) {
        $social_url = home_url('/');
      }
    } else {
      $social_title = get_bloginfo('name');
      $social_url = home_url('/');
    }

    if (is_paged()) {
      $paged_url = get_pagenum_link(get_query_var('paged'));
      if ($paged_url) {
        $social_url = $paged_url;
      }
    }

    echo '<meta property="og:title" content="' .
      esc_attr($social_title) .
      '">' .
      "\n";
    echo '<meta property="og:url" content="' . esc_url($social_url) . '">' . "\n";
    echo '<meta property="og:image" content="' .
      esc_url($social_image[0]) .
      '">' .
      "\n";
    echo '<meta property="og:image:width" content="' .
      esc_attr($social_image_w) .
      '">' .
      "\n";
    echo '<meta property="og:image:height" content="' .
      esc_attr($social_image_h) .
      '">' .
      "\n";
    echo '<meta property="og:description" content="' .
      esc_attr($social_description) .
      '">' .
      "\n";
    echo '<meta property="og:type" content="website">' . "\n";

    echo '<meta name="description" content="' .
      esc_attr($social_description) .
      '">' .
      "\n";
  }
  echo '<!-- end social meta -->' . "\n";
}

function ocaduillustration_document_title_parts($parts)
{
  if (is_tax('gradyear')) {
    $parts['title'] = single_term_title('', false);
  }
  return $parts;
}

add_filter('document_title_parts', 'ocaduillustration_document_title_parts');

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

  if (is_home() || is_archive() || is_search()) {
    // Archive/search: native browser responsive loading, no lazysizes.
    // Small thumb in src gives the blur-up something to display from first paint;
    // srcset/sizes let the browser upgrade to the right variant for the rendered cell.
    $attr['src'] = get_the_post_thumbnail_url($post, 'illustrator-extra-small');
    $attr['sizes'] = '(min-width: 1024px) 25vw, (min-width: 667px) 33vw, 50vw';
    $attr['loading'] = 'lazy';
    $attr['decoding'] = 'async';
    $attr['class'] = 'blur-up';
  } else {
    // Single illustrator galleries: lazysizes handles adaptive sizing across many images.
    $attr['data-sizes'] = 'auto';
    if (isset($attr['srcset'])) {
      $attr['data-srcset'] = $attr['srcset'];
      unset($attr['srcset']);
      unset($attr['sizes']);
      $attachment_small = wp_get_attachment_image_src(
        $attachment->ID,
        'illustrator-extra-small',
      );
      $attr['data-src'] = $attachment_small[0];
    }
    $attr['class'] = 'lazyload blur-up';
  }

  $attr['alt'] = 'Illustration by ' . get_the_title() . '';
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
    2,
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
  $permalink,
) {
  global $post;
  $image_url = wp_get_attachment_image_src($id, 'full');
  $image_srcset = wp_get_attachment_image_srcset($id);
  $image_sizes = wp_get_attachment_image_sizes($id, 'large');
  $image_caption = esc_attr(get_post($id)->post_excerpt);

  $image_data = wp_get_attachment_image_src($id, 'large');
  $image_width = $image_data[1];
  $image_height = $image_data[2];

  if (!$permalink) {
    $markup = str_replace(
      '<a href',
      '<a class="gallery-icon-anchor block cursor-zoom-in" data-srcset="' .
        $image_srcset .
        '" data-src-large="' .
        $image_url[0] .
        '" data-caption="' .
        $image_caption .
        '" data-sizes="' .
        $image_sizes .
        '" href',
      $markup,
    );
  }
  return $markup;
}

add_filter(
  'wp_get_attachment_link',
  'ocaduillustration_modify_attachment_link',
  10,
  4,
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
remove_action('wp_footer', 'wp_enqueue_global_styles', 1);

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
  100,
);

// Removes the decoding attribute from images added inside post content.
add_filter('wp_img_tag_add_decoding_attr', '__return_false');

// Remove the decoding attribute from featured images and the Post Image block.
add_filter('wp_get_attachment_image_attributes', function ($attributes) {
  unset($attributes['decoding']);
  return $attributes;
});

/**
 * Emit a canonical URL for templates WordPress core doesn't cover.
 *
 * Core's rel_canonical() handles singular posts/pages, so only emit on
 * front/home, taxonomy, and post-type archives here to avoid duplicates.
 */
function ocaduillustration_canonical()
{
  if (is_singular()) {
    return;
  }

  $canonical = '';

  if (is_front_page() || is_home()) {
    $canonical = home_url('/');
  } elseif (is_tax()) {
    $term = get_queried_object();
    if ($term) {
      $term_link = get_term_link($term);
      if (!is_wp_error($term_link)) {
        $canonical = $term_link;
      }
    }
  } elseif (is_post_type_archive()) {
    $canonical = get_post_type_archive_link(get_query_var('post_type'));
  }

  if ($canonical && is_paged()) {
    $paged = get_pagenum_link(get_query_var('paged'));
    if ($paged) {
      $canonical = $paged;
    }
  }

  if ($canonical) {
    echo '<link rel="canonical" href="' . esc_url($canonical) . '">' . "\n";
  }
}

add_action('wp_head', 'ocaduillustration_canonical', 1);

/**
 * Tell crawlers not to index low-value pages.
 */
add_filter('wp_robots', function ($robots) {
  if (is_search() || is_404()) {
    $robots['noindex'] = true;
    $robots['follow'] = true;
  }
  return $robots;
});

/**
 * Site-wide Organization + WebSite JSON-LD on the front page.
 */
function ocaduillustration_site_schema()
{
  if (!is_front_page()) {
    return;
  }

  $home = home_url('/');
  $graph = [
    [
      '@type' => 'Organization',
      'name' => get_bloginfo('name'),
      'url' => $home,
      'logo' => get_template_directory_uri() . '/thumb.jpg',
      'sameAs' => ['https://www.instagram.com/ocaduillustration/'],
    ],
    [
      '@type' => 'WebSite',
      'name' => get_bloginfo('name'),
      'url' => $home,
      'potentialAction' => [
        '@type' => 'SearchAction',
        'target' => [
          '@type' => 'EntryPoint',
          'urlTemplate' => $home . '?s={search_term_string}',
        ],
        'query-input' => 'required name=search_term_string',
      ],
    ],
  ];

  $payload = [
    '@context' => 'https://schema.org',
    '@graph' => $graph,
  ];

  echo '<script type="application/ld+json">' .
    wp_json_encode($payload, JSON_UNESCAPED_SLASHES) .
    '</script>' .
    "\n";
}

add_action('wp_head', 'ocaduillustration_site_schema');

?>
