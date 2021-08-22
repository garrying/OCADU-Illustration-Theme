<article class="single-illustrator">

  <div class="illustrator-gallery-container">
    <?php echo do_shortcode( '[gallery size="medium" link="file" columns="0"]' ); ?>
    <div id="image-modal" class="image-modal-wrapper hidden">
          <div class="miniview-container">
        <div class="miniview image-modal-miniview">
        </div>
      </div>
      <button class="close-panel" title="Close full view" aria-label="Close full view"><?php get_template_part( 'assets/dist/images/close.svg' ); ?><span class="hidden">Close</span></button>
      <div class="image-modal-container">
        <div class="image-modal-image"></div>
        <div class="image-modal-caption"></div>
      </div>
    </div>
  </div>

  <div class="illustrator-meta" role="complementary">
    <div class="illustrator-meta-wrapper">
      <div class="illustrator-meta-wrapper-inner">
        <div class="illustrator-meta-description" itemscope itemtype="https://schema.org/CreativeWork">

          <?php if ( get_post_meta( $post->ID, 'illu_title', true ) ) : ?>
            <?php
              $ocaduillustration_title_illu = get_post_meta( $post->ID, 'illu_title', true );
              echo '<h2 class="thesis-title" itemprop="name">' . esc_html( $ocaduillustration_title_illu ) . '</h2>';
            ?>
          <?php endif; ?>

          <div class="thesis-description" itemprop="abstract">
            <?php the_content(); ?>
          </div>

        </div>

        <div class="meta" itemscope itemtype="https://schema.org/Person">
          <header class="illustrator-meta-header">
            <h1 class="illustrator-meta-name" itemprop="name"><span id="name-blob"></span> <?php the_title(); ?></h1> 
          </header><!-- .illustrator-meta-header -->
          <div class="illustrator-meta-items">
            <?php if ( get_post_meta( $post->ID, 'illu_related', true ) ) : ?>
              <?php 
                $ocaduillustration_related_post       = get_post( get_post_meta( $post->ID, 'illu_related', true ) );
                $ocaduillustration_related_post_terms = get_the_terms( $ocaduillustration_related_post->ID, 'gradyear' );
              ?>
              <p class="meta-label"><?php echo esc_html( $ocaduillustration_related_post_terms[1]->name ); ?> ⤵</p>
              <a title="<?php echo esc_html( $ocaduillustration_related_post->post_title ); ?>" class="meta-link truncate pill" itemprop="sameAs" href="<?php echo esc_html( get_permalink( $ocaduillustration_related_post->ID ) ); ?>">✿ 
                <?php
                  if ( get_post_meta( $ocaduillustration_related_post->ID, 'illu_title', true ) ) {
                    echo esc_html( get_post_meta( $ocaduillustration_related_post->ID, 'illu_title', true ) );
                  } else {
                    echo 'View ' . esc_html( strtolower( $ocaduillustration_related_post_terms[1]->name ) );
                  }
                ?>
                </a>
              <hr class="related-separator" />
            <?php endif; ?>
            <?php if ( get_post_meta( $post->ID, 'illu_sites', true ) ) : ?>
              <a target="_blank" itemprop="sameAs" rel="noopener" title="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites', true ) ); ?>" class="meta-link truncate pill" href="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites', true ) ); ?>">
                <?php
                  $ocaduillustration_url = esc_url( get_post_meta( $post->ID, 'illu_sites', true ) );
                  $ocaduillustration_url = preg_replace( '#^https?://#', '', $ocaduillustration_url );
                  echo esc_html( rtrim( $ocaduillustration_url, '/' ) );
                ?>
                ↗
              </a>
            <?php endif; ?>

            <?php if ( get_post_meta( $post->ID, 'illu_sites_2', true ) ) : ?>
              <a target="_blank" itemprop="sameAs" rel="noopener" title="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites_2', true ) ); ?>" class="meta-link truncate pill" href="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites_2', true ) ); ?>">
                <?php
                  $ocaduillustration_url = esc_url( get_post_meta( $post->ID, 'illu_sites_2', true ) );
                  $ocaduillustration_url = preg_replace( '#^https?://#', '', $ocaduillustration_url );
                  echo esc_html( rtrim( $ocaduillustration_url, '/' ) );
                ?>
                ↗
              </a>
            <?php endif; ?>

            <?php if ( get_post_meta( $post->ID, 'illu_email', true ) ) : ?>
              <a title="<?php echo esc_html( get_post_meta( $post->ID, 'illu_email', true ) ); ?>" class="meta-link truncate pill" href="mailto:<?php echo esc_html( get_post_meta( $post->ID, 'illu_email', true ) ); ?>"><span itemprop="email"><?php echo esc_html( get_post_meta( $post->ID, 'illu_email', true ) ); ?></span> ✎</a>
            <?php endif; ?>
          </div>
        </div>
      </div>

      <div class="illustrator-nav-single-wrapper">
        <?php
        if ( is_singular( 'illustrator' ) ) {
          $ocaduillustration_class_year = get_the_terms( $post->ID, 'gradyear' );
          $ocaduillustration_base_year  = $ocaduillustration_class_year[0];
          foreach ( $ocaduillustration_class_year as $ocaduillustration_illustrator_term ) {
            $ocaduillustration_illustrator_year_section = $ocaduillustration_illustrator_term->slug;
            if ( $ocaduillustration_illustrator_term->parent <= 0 ) {
              echo '<a class="section-indicator-single" href="/year/' . esc_html( $ocaduillustration_base_year->slug ) . '" title="Return to ' . esc_html( $ocaduillustration_illustrator_term->name ) . ' index"> ☀ ' . esc_html( $ocaduillustration_illustrator_term->name ) . '</a>';
            } else {
              echo '<a class="section-indicator-single" href="/year/' . esc_html( $ocaduillustration_base_year->slug ) . '/' . esc_html( $ocaduillustration_illustrator_year_section ) . '" title="Return to ' . esc_html( $ocaduillustration_illustrator_term->name ) . ' index"> ☼ ' . esc_html( $ocaduillustration_illustrator_term->name ) . '</a>';
            }
          }
        }
        ?>
        <ul class="illustrator-nav-single">
          <?php
            $ocaduillustration_args = array(
              'post_status' => 'publish',
              'post_type'   => 'illustrator',
              'tax_query'   => array( // phpcs:ignore
                array(
                  'taxonomy' => 'gradyear',
                  'field'    => 'slug',
                  'terms'    => $ocaduillustration_base_year,
                ),
              ),
              'orderby'     => 'title',
              'order'       => 'ASC',
            );

            $ocaduillustration_query      = new WP_Query( $ocaduillustration_args );
            $ocaduillustration_posts_list = $ocaduillustration_query->get_posts();
            $ocaduillustration_posts      = array();

            foreach ( $ocaduillustration_posts_list as $ocaduillustration_post ) {
              $ocaduillustration_posts[] += $ocaduillustration_post->ID;
            }

            $ocaduillustration_current = array_search( get_the_ID(), $ocaduillustration_posts, true );
            $ocaduillustration_prev_id = $ocaduillustration_posts[ $ocaduillustration_current - 1 ] ?? null;
            $ocaduillustration_next_id = $ocaduillustration_posts[ $ocaduillustration_current + 1 ] ?? null;
          ?>
          <li class="nav-previous">
            <?php
              if ( ! empty( $ocaduillustration_prev_id ) ) {
                echo '<a href="' . esc_url( get_permalink( $ocaduillustration_prev_id ) ) . '" rel="prev" title="' . esc_html( get_the_title( $ocaduillustration_prev_id ) ) . '"><span class="name previous-link truncate">⤺ ' . esc_html( get_the_title( $ocaduillustration_prev_id ) ) . '</span></a>';
              }
            ?>
          </li>
          <li class="nav-next">
            <?php
              if ( ! empty( $ocaduillustration_next_id ) ) {
                echo '<a href="' . esc_url( get_permalink( $ocaduillustration_next_id ) ) . '" rel="next" title="' . esc_html( get_the_title( $ocaduillustration_next_id ) ) . '"><span class="name next-link truncate">' . esc_html( get_the_title( $ocaduillustration_next_id ) ) . ' ⤻</span></a>';
              }
            ?>
          </li>
        </ul><!-- .llustrator-nav-single -->
      </div>

    </div>

  </div><!-- .illustrator-meta -->

</article><!-- .single-illustrator -->
