<?php get_header(); ?>

  <div id="illustrators" class="grid illustrators-grid archive-grid">
  <h1 class="search-title">
    <?php printf( 'Search Results for <mark>%s</mark>', get_search_query() ); ?>
  </h1>
  <?php if ( have_posts() ) : ?>
    <?php query_posts( $query_string . '&orderby=title&order=ASC' );?><!-- Query by Title -->
    <?php /* Start the Loop */ ?>
    <?php while ( have_posts() ) : the_post(); ?>

      <?php
        get_template_part( 'content', get_post_format() );
      ?>

    <?php endwhile; ?>

  <?php else : ?>

    <article class="error-body">
      <header class="entry-header">
        <h1 class="entry-title"><?php esc_html_e( 'No Matches &#9785;', 'ocaduillustration' ); ?></h1>
        <p><?php esc_html_e( 'Sorry, but nothing matched your search criteria. Please try again with some different keywords.', 'ocaduillustration' ); ?></p>
      </header><!-- .entry-header -->
    </article><!-- .error-body -->

  <?php endif; ?>
  </div>

<?php get_footer(); ?>
