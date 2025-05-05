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
  <div id="title" class="bottom-4 left-4 right-4 top-20">
    <div class="flex md:hidden absolute inset-x-0 inset-y-0 bg-black/50 justify-center items-center z-10 p-4">
      <a class="border border-white rounded-full px-12 py-4 bg-white text-2xl hover:bg-neutral-200 hover:text-black" href="/year/2025/">View 2025 archive</a>
    </div>
    <div class="title-support-unit p-4 pt-48 pointer-events-none hidden md:flex">
        <div class="title-secondary">
          <p>Spanning 2009&ndash;2025<br /> Maintained by the Illustration Program at OCAD University</p>
          <a href="/about" class="about pointer-events-auto">About the archive</a>
        </div>
        <a href="https://www.instagram.com/ocaduillustration/" target="_blank" class="pointer-events-auto">@ocaduillustration ↗</a>
    </div>
  </div>
  <div id="illustrators" class="grid-container bottom-4 left-4 right-4 top-20 overflow-hidden"></div>

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
