<?php get_header(); ?>
  
  <?php if ( is_home() || is_front_page() ) {
    $grad_year = get_terms( 'gradyear', 'hide_empty=1&order=DESC&number=1' );
    $args = array(
        'taxonomy' => 'gradyear',
        'post_type' => 'illustrator',
        'term' => $grad_year[0]->name,
        );
    $home_index = new WP_Query( $args );
  }
  ?>
  <div class="title">
    <div class="title-unit title-unit-init active">
      <div class="unit">
        <h1 class="title-primary">OCAD University<br> Illustration 2017</h1>
      </div>
    </div>
    <p  class="title-secondary message-wrapper">
      Part of the 102<sup>nd</sup> Graduate Exhibition. <br>May 3 to 7, 2017
    </p>
    <p class="title-secondary message-wrapper"><a href="/introduction" class="message">Introduction from Paul Dallas</a>.</p>
  </div>
  <div id="illustrators" class="grid illustrators-grid home-grid">

    <?php if ( $home_index->have_posts() ) : ?>

      <?php /* Start the Loop */ ?>
      <?php while ( $home_index->have_posts() ) : $home_index->the_post() ?>

        <?php get_template_part( 'content', get_post_format() ); ?>

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
