<?php get_header(); ?>

  <?php if (is_home() || is_front_page()) {
    $ocaduillustration_grad_year = get_terms(
      'gradyear',
      'hide_empty=1&order=DESC&number=1&parent=0'
    );
    $ocaduillustration_args = [
      'post_type' => 'illustrator',
      'tax_query' => [
        // phpcs:ignore
        [
          'taxonomy' => 'gradyear',
          'field' => 'slug',
          'terms' => $ocaduillustration_grad_year[0]->name,
        ],
        [
          'taxonomy' => 'gradyear',
          'field' => 'slug',
          'terms' => 'major-works',
          'operator' => 'NOT IN',
        ],
      ],
    ];
    $ocaduillustration_home_index = new WP_Query($ocaduillustration_args);
  } ?>
  <div id="title">
    <div class="title-unit">
      <div class="segment-first">
        <h1 class="title-primary">OCAD U Illustration 2023</h1>
      </div>
    </div>
    <div class="title-support-unit">
        <div class="title-secondary">
          <p>Spanning 2009&ndash;2023<br /> Maintained by the Illustration Program at OCAD University</p>
          <a href="/about" class="about">About the archive</a>
        </div>
        <a href="https://www.instagram.com/ocaduillustration/" target="_blank" class="instagram">@ocaduillustration ↗</a>
    </div>
  </div>
  <div id="illustrators" class="flex flex-wrap illustrators-grid home-grid">

    <?php if ($ocaduillustration_home_index->have_posts()): ?>

      <?php
      /* Start the Loop */
      ?>
      <?php while ($ocaduillustration_home_index->have_posts()):
        $ocaduillustration_home_index->the_post(); ?>

        <?php get_template_part('content', get_post_format()); ?>

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
