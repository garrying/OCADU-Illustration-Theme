<?php get_header(); ?>
  <?php if ( is_home() || is_front_page() ) {
    $grad_year = get_terms('gradyear', 'hide_empty=1&order=DESC&number=1'); 
    $args = array(
        'taxonomy' => 'gradyear',
        'post_type' => 'illustrator',
        'term' => $grad_year[0]->name,
        'orderby' => 'rand'
        );
    $home_index = new WP_Query($args);
  }
  ?>
  <div class="title">
    <div class="title-unit">
      <div class="title-unit-init unit">
        <p class="title-primary">OCAD University Illustration featuring work from the graduating class of 2015</p>
        <p class="title-secondary">Coinciding with the 100th Annual Graduate Exhibition. April 29 to May 3, 2015</p>
        <p><a href="/introduction" class="message">Introduction from Paul Dallas</a></p>
        <p class="colophon">
          Maintained by the Illustration Department at OCAD U<br> <a href="/about">Colophon</a>
        </p>
        
      </div>
    </div>
  </div>
  <div id="illustrators">
    <?php if ( $home_index->have_posts() ) : ?>

      <?php /* Start the Loop */ ?>
      <?php while($home_index->have_posts()) : $home_index->the_post() ?>

        <?php get_template_part( 'content', get_post_format() ); ?>

      <?php endwhile; ?>

    <?php else : ?>

      <article class="post no-results not-found">
        <header class="entry-header">
          <h1 class="entry-title"><?php _e( 'Nothing Found', 'ocaduillustration' ); ?></h1>
        </header><!-- .entry-header -->

        <div class="entry-content">
          <p><?php _e( 'Apologies, but no results were found for the requested archive. Perhaps searching will help find a related post.', 'ocaduillustration' ); ?></p>
        </div><!-- .entry-content -->
      </article><!-- #post-0 -->

    <?php endif; ?>
  </div>
      
<?php get_footer(); ?>