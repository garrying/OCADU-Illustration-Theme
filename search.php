<?php get_header(); ?>

  <div id="illustrators" class="grid illustrators-grid archive-grid">
    <div class="gallery-item">
      <h1 class="search-title">
        <?php printf( 'Search Results for <mark>%s</mark>', get_search_query() ); ?>
      </h1>
    </div>
  <?php if ( have_posts() ) : ?>
    <?php
    while ( have_posts() ) :
      the_post();
  ?>

      <?php
        get_template_part( 'content', get_post_format() );
      ?>

    <?php endwhile; ?>

  <?php else : ?>

    <article class="error-body">
      <header class="entry-header">
        <h1 class="entry-title"><?php esc_html_e( 'No Matches &#9785;', 'ocaduillustration' ); ?></h1>
        <p>Sorry, but nothing matched your search criteria.<br> Please try again with some different keywords.</p>
      </header><!-- .entry-header -->
    </article><!-- .error-body -->

  <?php endif; ?>
  </div>

<?php get_footer(); ?>
