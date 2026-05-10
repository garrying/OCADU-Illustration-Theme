<?php get_header(); ?>

<?php if (is_archive()) {
  $ocaduillustration_selected_section = get_term_by(
    'slug',
    get_query_var('term'),
    get_query_var('taxonomy')
  );
  if ($ocaduillustration_selected_section->parent > 0) {
    $ocaduillustration_selected_section_parent = get_term(
      $ocaduillustration_selected_section->parent,
      get_query_var('taxonomy')
    );
  }

  $ocaduillustration_tax_breadcrumbs = [
    [
      '@type' => 'ListItem',
      'position' => 1,
      'name' => 'Home',
      'item' => home_url('/'),
    ],
  ];
  if (isset($ocaduillustration_selected_section_parent)) {
    $ocaduillustration_tax_breadcrumbs[] = [
      '@type' => 'ListItem',
      'position' => 2,
      'name' => $ocaduillustration_selected_section_parent->name,
      'item' => get_term_link($ocaduillustration_selected_section_parent),
    ];
    $ocaduillustration_tax_breadcrumbs[] = [
      '@type' => 'ListItem',
      'position' => 3,
      'name' => $ocaduillustration_selected_section->name,
      'item' => get_term_link($ocaduillustration_selected_section),
    ];
  } else {
    $ocaduillustration_tax_breadcrumbs[] = [
      '@type' => 'ListItem',
      'position' => 2,
      'name' => $ocaduillustration_selected_section->name,
      'item' => get_term_link($ocaduillustration_selected_section),
    ];
  }
  $ocaduillustration_tax_breadcrumb_ld = [
    '@context' => 'https://schema.org',
    '@type' => 'BreadcrumbList',
    'itemListElement' => $ocaduillustration_tax_breadcrumbs,
  ];
  echo '<script type="application/ld+json">' .
    wp_json_encode(
      $ocaduillustration_tax_breadcrumb_ld,
      JSON_UNESCAPED_SLASHES
    ) .
    '</script>';

  echo '<h1 class="text-4xl w-full leading-none font-normal mt-[230px] mb-[160px] mx-auto text-center">';
  if (isset($ocaduillustration_selected_section_parent)) {
    echo esc_html($ocaduillustration_selected_section_parent->name);
    echo ', ';
    echo esc_html($ocaduillustration_selected_section->name);
  } else {
    echo esc_html($ocaduillustration_selected_section->name);
  }
  echo '</h1>';
} ?>

<div id="illustrators" class="flex flex-wrap illustrators-grid archive-grid">
  <div class="grid-col grid-col-1"></div>
  <div class="grid-col grid-col-2"></div>
  <div class="grid-col grid-col-3"></div>
  <div class="grid-col grid-col-4"></div>
  <?php $ocaduillustration_term = get_term_by(
    'slug',
    get_query_var('term'),
    get_query_var('taxonomy')
  ); ?>
  <?php
  $ocaduillustration_term_slug = $ocaduillustration_term->slug;
  $ocaduillustration_args = [
    'post_status' => 'publish',
    'post_type' => 'illustrator',
    'gradyear' => $ocaduillustration_term_slug,
    'orderby' => 'title',
    'order' => 'ASC',
  ];
  $ocaduillustration_query = new WP_Query($ocaduillustration_args);
  ?>

  <?php if ($ocaduillustration_query->have_posts()): ?>
    <?php while ($ocaduillustration_query->have_posts()):
      $ocaduillustration_query->the_post(); ?>
    <?php get_template_part('content', get_post_format()); ?>
    <?php
    endwhile; ?>
  <?php endif; ?>

  <?php wp_reset_postdata(); ?>
</div>
<?php get_footer(); ?>
