<?php get_header(); ?>

  <?php if (is_home() || is_front_page()) {
    $ocaduillustration_grad_year = get_terms(
      'gradyear',
      'hide_empty=1&order=DESC&number=1&parent=0'
    );
    $ocaduillustration_args = [
      'post_type' => 'illustrator',
      'tax_query' => [
        [
          'taxonomy' => 'gradyear',
          'field' => 'slug',
          'terms' => $ocaduillustration_grad_year[0]->name,
        ],
      ],
    ];
    $ocaduillustration_home_index = new WP_Query($ocaduillustration_args);
  } ?>
  <div id="title" class="bottom-4 left-4 right-4 top-20">
    <div class="flex md:hidden absolute inset-x-0 inset-y-0 bg-black/50 justify-center items-center z-10 p-4">
      <a class="border border-white rounded-full px-12 py-4 bg-white text-2xl hover:bg-neutral-200 hover:text-black" href="/year/2024/">View 2024 archive</a>
    </div>
    <div class="title-support-unit p-4 pt-48 pointer-events-none hidden md:flex">
        <div class="title-secondary">
          <p>Spanning 2009&ndash;2024<br /> Maintained by the Illustration Program at OCAD University</p>
          <a href="/about" class="about pointer-events-auto">About the archive</a>
        </div>
        <a href="https://www.instagram.com/ocaduillustration/" target="_blank" class="pointer-events-auto">@ocaduillustration ↗</a>
    </div>
  </div>
  <div id="illustrators" class="grid js-grid pointer-events-none">

    <?php if ($ocaduillustration_home_index->have_posts()): ?>

      <?php
      /* Start the Loop */
      ?>
      <?php while ($ocaduillustration_home_index->have_posts()):
        $ocaduillustration_home_index->the_post(); ?>

        <div class="gallery-item"><figure class="js-plane" data-src="<?php the_post_thumbnail_url('illustrator-large'); ?>" data-href="<?php the_permalink(); ?>"></figure></div>

      <?php
      endwhile; ?>

    <?php else: ?>

      <article class="post no-results not-found">
        <header class="entry-header">
          <h1 class="entry-title"><?php esc_html_e(
            'Nothing Found',
            'ocaduillustration'
          ); ?></h1>
        </header><!-- .entry-header -->

        <div class="entry-content">
          <p><?php esc_html_e(
            'Apologies, but no results were found for the requested archive. Perhaps searching will help find a related post.',
            'ocaduillustration'
          ); ?></p>
        </div><!-- .entry-content -->
      </article><!-- #post-0 -->

    <?php endif; ?>
  </div>

<?php get_footer(); ?>
