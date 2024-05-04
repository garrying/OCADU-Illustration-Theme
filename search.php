<?php get_header(); ?>

<h2 class="section-indicator-index"><?php printf(
  'Search results for <mark>%s</mark>',
  get_search_query()
); ?></h2>

<div id="illustrators" class="flex flex-wrap illustrators-grid archive-grid">
  <div class="grid-col grid-col-1"></div>
  <div class="grid-col grid-col-2"></div>
  <div class="grid-col grid-col-3"></div>
  <div class="grid-col grid-col-4"></div>
  <?php if (have_posts()): ?>
    <?php while (have_posts()):
      the_post(); ?>

      <?php get_template_part('content', get_post_format()); ?>

    <?php
    endwhile; ?>

  <?php else: ?>

    <article class="fixed flex items-center justify-center">
      <header class="entry-header">
        <h1 class="font-normal"><?php esc_html_e(
          'No Matches &#9785;',
          'ocaduillustration'
        ); ?></h1>
        <p>Sorry, but nothing matched your search criteria.<br> Please try again with some different keywords.</p>
      </header><!-- .entry-header -->
    </article>

  <?php endif; ?>
</div>

<?php get_footer(); ?>
