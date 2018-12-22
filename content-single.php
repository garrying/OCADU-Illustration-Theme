<article class="single-illustrator" itemscope itemtype="http://schema.org/CreativeWork">

  <div class="illustrator-meta" role="complementary">
    <div class="illustrator-meta-wrapper">
      <div class="illustrator-meta-wrapper-inner">
        <div class="illustrator-meta-description">

          <?php if ( get_post_meta( $post->ID, 'illu_title', true ) ) : ?>
            <?php
              $ocaduillustration_title_illu = get_post_meta( $post->ID, 'illu_title', true );
              echo '<h2 class="thesis-title" itemprop="name">' . esc_html( $ocaduillustration_title_illu ) . '</h2>';
            ?>
          <?php endif; ?>

          <div class="thesis-description">
            <?php the_content(); ?>
          </div>

          <meta itemprop="description" content="
            <?php
              $ocaduillustration_text = strip_tags( get_the_content() );
              echo esc_html( wptexturize( $ocaduillustration_text ) );
            ?>
          ">
          <meta itemprop="author copyrightHolder" content="<?php the_title(); ?>">
          <meta itemprop="image" content="
            <?php
              $ocaduillustration_image = wp_get_attachment_url( get_post_thumbnail_id( $post->ID ) );
              echo esc_html( $ocaduillustration_image );
            ?>
          ">

        </div>

        <div class="meta" itemscope itemtype="http://schema.org/Person">
          <header class="illustrator-meta-header">
            <h1 class="illustrator-meta-name" itemprop="name"><?php the_title(); ?> →</h1>
          </header><!-- .illustrator-meta-header -->
          <div class="illustrator-meta-items">
            <?php if ( get_post_meta( $post->ID, 'illu_sites', true ) ) : ?>
              <div itemprop="url">
                <a title="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites', true ) ); ?>" class="site-url meta-link truncate" href="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites', true ) ); ?>">
                  →
                  <?php
                    $ocaduillustration_url = esc_url( get_post_meta( $post->ID, 'illu_sites', true ) );
                    $ocaduillustration_url = preg_replace( '#^https?://#', '', $ocaduillustration_url );
                    echo esc_html( $ocaduillustration_url );
                  ?>
                </a>
              </div>
            <?php endif; ?>

            <?php if ( get_post_meta( $post->ID, 'illu_sites_2', true ) ) : ?>
              <div itemprop="url">
                <a title="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites_2', true ) ); ?>" class="site-url meta-link truncate" href="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites_2', true ) ); ?>">
                  →
                  <?php
                    $ocaduillustration_url = esc_url( get_post_meta( $post->ID, 'illu_sites_2', true ) );
                    $ocaduillustration_url = preg_replace( '#^https?://#', '', $ocaduillustration_url );
                    echo esc_html( $ocaduillustration_url );
                  ?>
                </a>
              </div>
            <?php endif; ?>

            <?php if ( get_post_meta( $post->ID, 'illu_email', true ) ) : ?>
              <div class="email" itemprop="email">
                <a title="<?php echo esc_html( get_post_meta( $post->ID, 'illu_email', true ) ); ?>" class="meta-link truncate" href="mailto:<?php echo esc_html( get_post_meta( $post->ID, 'illu_email', true ) ); ?>">→ <?php echo esc_html( get_post_meta( $post->ID, 'illu_email', true ) ); ?></a>
              </div>
            <?php endif; ?>

            <?php if ( get_post_meta( $post->ID, 'illu_phone', true ) ) : ?>
              <div class="phone" itemprop="telephone">
                → <?php echo esc_html( get_post_meta( $post->ID, 'illu_phone', true ) ); ?>
              </div>
            <?php endif; ?>
          </div>
        </div>
      </div>

      <div class="illustrator-nav-single-wrapper">
        <?php
        if ( is_singular( 'illustrator' ) ) {
          $class_year                         = get_the_terms( $post->ID, 'gradyear' );
          $ocaduillustration_term_first = $class_year[0];
          if ( isset( $ocaduillustration_term_first->name ) ) {
				echo '<a class="section-indicator-single" href="/year/' . esc_html( $ocaduillustration_term_first->slug ) . '" title="Return to ' . esc_html( $ocaduillustration_term_first->name ) . ' index"> ⧖ ' . esc_html( $ocaduillustration_term_first->name ) . '</a>';
          };
        }
        ?>
        <ul class="illustrator-nav-single">
          <?php
            // phpcs:disable
          ?>
          <li class="nav-previous"><?php
        previous_post_link_plus(
             array(
            'order_by'    => 'post_title',
            'format'      => '%link',
            'in_same_tax' => true,
            'link'        => '<span class="name previous-link truncate">◐ %title</span>',
          )
            );
          ?></li>
          <li class="nav-next"><?php
        next_post_link_plus(
             array(
            'order_by'    => 'post_title',
            'format'      => '%link',
            'in_same_tax' => true,
            'link'        => '<span class="name next-link truncate">◑ %title</span>',
          )
            );
          ?></li>
          <?php
            // phpcs:enable
          ?>
        </ul><!-- .llustrator-nav-single -->
      </div>

    </div>

  </div><!-- .illustrator-meta -->

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

</article><!-- .single-illustrator -->
