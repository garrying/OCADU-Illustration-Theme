<?php get_header(); ?>

<?php if ( is_archive() ) {
    $selected_year = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) )->name;
    echo '<div class="section-indicator-index"><span class="section-indicator" href="/" title="Return to homepage">';
    if ( isset( $selected_year ) ) {
      esc_html_e( $selected_year );
    };
    echo '</span></div>';
  }
?>

<div id="illustrators" class="grid illustrators-grid archive-grid">
  
  <?php if ( have_posts() ) : ?>

    <?php query_posts( $query_string . '&orderby=title&order=ASC' );?>

    <?php /* Start the Loop */ ?>
    <?php while ( have_posts() ) : the_post(); ?>

      <?php
        get_template_part( 'content', get_post_format() );
      ?>

    <?php endwhile; ?>

  <?php else : ?>

    <article class="post no-results not-found">
      <header class="entry-header">
        <h1 class="entry-title"><?php esc_html_e( 'Nothing Found', 'ocaduillustration' ); ?></h1>
      </header><!-- .entry-header -->

      <div class="entry-content">
        <p><?php esc_html_e( 'Apologies, but no results were found for the requested archive. Perhaps searching will help find a related post.', 'ocaduillustration' ); ?></p>
      </div><!-- .entry-content -->
    </article><!-- #post-0 -->

  <?php endif; ?>
</div>

<?php get_footer(); ?>
