<?php get_header(); ?>

  <?php if (is_home() || is_front_page()) {
    $ocaduillustration_grad_year = get_terms([
      'taxonomy' => 'gradyear',
      'hide_empty' => true,
      'order' => 'DESC',
      'number' => 1,
      'parent' => 0,
    ]);

    $ocaduillustration_args = [
      'post_type' => 'illustrator',
      'posts_per_page' => -1,
      'gradyear' => $ocaduillustration_grad_year[0]->slug,
    ];

    $ocaduillustration_home_index = new WP_Query($ocaduillustration_args);
  } ?>
  <div id="top-mask" class="pointer-events-none top-4"></div>
  <div id="title" class="bottom-4 left-4 right-4 top-4">
    <div class="title-support-unit p-3 pointer-events-none hidden md:flex m-4 mx-5 text-xs rounded-full">
      <p>Maintained by the Illustration Program at OCAD University.
        <a href="/about" class="about pointer-events-auto">About the archive</a>
      </p>
      <a href="https://www.instagram.com/ocaduillustration/" target="_blank" class="pointer-events-auto">@ocaduillustration ↗</a>
    </div>
  </div>
  <div id="illustrators" class="grid-container bottom-4 left-4 right-4 top-4 overflow-hidden"></div>

<script id="image-data" type="application/json">
  <?php
  $ocaduillustration_images = [];
  $ocaduillustration_id = 0;
  while ($ocaduillustration_home_index->have_posts()) {
    $ocaduillustration_home_index->the_post();
    $ocaduillustration_thumb = get_the_post_thumbnail_url(
      get_the_ID(),
      'medium'
    );
    $ocaduillustration_full = get_the_post_thumbnail_url(get_the_ID(), 'full');
    $ocaduillustration_url = get_permalink();
    $ocaduillustration_title = get_the_title();
    if ($ocaduillustration_thumb && $ocaduillustration_full) {
      $ocaduillustration_images[] = [
        'id' => $ocaduillustration_id,
        'full_src' => $ocaduillustration_full,
        'thumb_src' => $ocaduillustration_thumb,
        'link' => $ocaduillustration_url,
        'name' => $ocaduillustration_title,
      ];
      ++$ocaduillustration_id;
    }
  }
  echo wp_json_encode(['images' => $ocaduillustration_images]);
  ?>
</script>



<?php get_footer(); ?>
