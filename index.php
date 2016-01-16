<?php if ( !isset( $_SERVER['HTTP_X_PJAX'] ) ) : ?>
    <?php get_header(); ?>
  <?php else : ?>
    <title><?php wp_title( '&#8211;', true, 'right'); bloginfo('name'); ?></title>
<?php endif; ?>
  
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
    <div class="title-unit">
      <div class="title-unit-init unit">
        <p class="title-primary">OCAD U Illustration featuring work from the graduating class of 2015</p>
        <p class="title-secondary">Coinciding with the 100th Annual Graduate Exhibition. April 29 to May 3, 2015 <span class="message-wrapper"><a href="/introduction" class="message">Introduction from Paul Dallas</a></span></p>
        <p class="colophon">
          Maintained by the Illustration Department at OCAD U<br> <a class="heading" href="/about">About</a>
        </p>
      </div>
    </div>
  </div>
  <div id="illustrators" class="illustrators-grid home-grid">
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
      
<?php if ( !isset($_SERVER['HTTP_X_PJAX']) ) : ?>
  <?php get_footer(); ?>
<?php endif; ?>
