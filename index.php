<?php get_header(); ?>

  <?php
    if ( is_home() || is_front_page() ) {
      $ocaduillustration_grad_year  = get_terms( 'gradyear', 'hide_empty=1&order=DESC&number=1' );
      $ocaduillustration_args       = array(
        'taxonomy'  => 'gradyear',
        'post_type' => 'illustrator',
        'term'      => $ocaduillustration_grad_year[0]->name,
      );
      $ocaduillustration_home_index = new WP_Query( $ocaduillustration_args );
    }
  ?>
  <div class="title">
    <div class="title-unit title-unit-init active">
      <button class="close-unit close-title" title="Close About" aria-label="Close About"><?php get_template_part( 'assets/dist/images/close.svg' ); ?><span class="hidden">Close</span></button>
      <div class="segment-first"><h1 class="title-primary">OCAD University<br> Illustration 2019</h1></div>
      <div class="segment-second">
        <h2 class="title-primary"> Part of the 104<sup>th</sup><br> GradEx May 1–5<br></h2>
        <p class="title-secondary">Spanning 2009–2019, the archive is maintained by the Illustration Department at OCAD University.</p>
        <p class="title-secondary"><a href="/about" class="message pill">About the Archive</a></p>
      </div>
    </div>

    <div class="about-unit">
      <div class="about-unit-container">
        <?php
          $ocaduillustration_about = new WP_Query( 'page_id=8' );
          while ( $ocaduillustration_about->have_posts() ) :
            $ocaduillustration_about->the_post()
        ?>
          <div class="segment-first"><h1 class="title-primary"><?php the_title(); ?></h1></div>
          <?php the_content(); ?>
        <?php endwhile; ?>
      </div>
      <button class="close-unit" title="Close About" aria-label="Close About"><?php get_template_part( 'assets/dist/images/close.svg' ); ?><span class="hidden">Close</span></button>
    </div>
  </div>
  <div id="illustrators" class="grid illustrators-grid home-grid">

    <?php if ( $ocaduillustration_home_index->have_posts() ) : ?>

      <?php /* Start the Loop */ ?>
      <?php
        while ( $ocaduillustration_home_index->have_posts() ) :
          $ocaduillustration_home_index->the_post()
      ?>

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
  <div class="title-bg"></div>

<?php get_footer(); ?>
