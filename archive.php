<?php get_header(); ?>

<div id="illustrators" class="grid illustrators-grid archive-grid">

  <div class="grid-sizer"></div>
  <div class="gutter-sizer"></div>

  <?php if ( have_posts() ) : ?>

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
    </article><!-- .post -->

  <?php endif; ?>
  
</div>

<?php get_footer(); ?>
