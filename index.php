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
  <h1 style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">
    <?php echo esc_html(get_bloginfo('name')); ?> — Graduating Class of <?php echo esc_html(
  $ocaduillustration_grad_year[0]->name,
); ?>
  </h1>
  <div id="top-mask" class="pointer-events-none top-4"></div>
  <div id="title" class="bottom-3 left-3 right-3 top-4 text-white">
    <div class="title-support-unit p-4 pointer-events-none hidden md:flex m-4 mx-5 rounded">
      <p>Maintained by the Illustration Program at OCAD University.
        <a href="/about" class="about pointer-events-auto text-white">About the archive</a>
      </p>
      <a href="https://www.instagram.com/ocaduillustration/" target="_blank" rel="noopener noreferrer" class="pointer-events-auto text-white">@ocaduillustration ↗</a>
    </div>
  </div>
  <div id="illustrators" class="grid-container bottom-4 left-4 right-4 top-4 overflow-hidden"></div>

<script id="image-data" type="application/json">
  <?php
  $ocaduillustration_images = [];
  $ocaduillustration_id = 0;
  while ($ocaduillustration_home_index->have_posts()) {
    $ocaduillustration_home_index->the_post();
    $ocaduillustration_thumb_id = get_post_thumbnail_id(get_the_ID());
    $ocaduillustration_thumb_data = $ocaduillustration_thumb_id
      ? wp_get_attachment_image_src($ocaduillustration_thumb_id, 'medium')
      : false;
    $ocaduillustration_full = get_the_post_thumbnail_url(get_the_ID(), 'full');
    $ocaduillustration_url = get_permalink();
    $ocaduillustration_title = get_the_title();
    if ($ocaduillustration_thumb_data && $ocaduillustration_full) {
      $ocaduillustration_images[] = [
        'id' => $ocaduillustration_id,
        'full_src' => $ocaduillustration_full,
        'thumb_src' => $ocaduillustration_thumb_data[0],
        'width' => $ocaduillustration_thumb_data[1],
        'height' => $ocaduillustration_thumb_data[2],
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
