<article class="single-illustrator" role="article" itemscope itemtype="http://schema.org/CreativeWork">

  <div class="illustrator-meta" role="complementary">
    <div class="illustrator-meta-wrapper">
      <div class="illustrator-meta-wrapper-inner">
        <div class="illustrator-meta-description">

          <?php if ( get_post_meta( $post->ID, 'illu_title', true ) ) : ?>
            <?php
              $title_illu = get_post_meta( $post->ID, 'illu_title', true );
              echo '<h2 class="thesis-title" itemprop="name">' . esc_html( $title_illu ) . '</h2>';
            ?>
          <?php endif; ?>

          <div class="thesis-description">
            <?php the_content(); ?>
          </div>

          <meta itemprop="description" content="
            <?php
              $text = strip_tags( get_the_content() );
              echo esc_html( wptexturize( $text ) );
            ?>
          ">
          <meta itemprop="author copyrightHolder" content="<?php the_title(); ?>">
          <meta itemprop="image" content="
            <?php
              $image = wp_get_attachment_url( get_post_thumbnail_id( $post->ID ) );
              echo esc_html( $image );
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
                <a title="Visit Illustrator's Website" class="site-url" href="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites', true ) ); ?>">
                  →
                  <?php
                    $url = esc_url( get_post_meta( $post->ID, 'illu_sites', true ) );
                    $url = preg_replace( '#^https?://#', '', $url );
                    echo esc_html( $url );
                  ?>
                </a>
              </div>
            <?php endif; ?>

            <?php if ( get_post_meta( $post->ID, 'illu_sites_2', true ) ) : ?>
              <div itemprop="url">
                <a title="Visit Illustrator's Website" class="site-url" href="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites_2', true ) ); ?>">
                  →
                  <?php
                    $url = esc_url( get_post_meta( $post->ID, 'illu_sites_2', true ) );
                    $url = preg_replace( '#^https?://#', '', $url );
                    echo esc_html( $url );
                  ?>
                </a>
              </div>
            <?php endif; ?>

            <?php if ( get_post_meta( $post->ID, 'illu_email', true ) ) : ?>
              <div class="email" itemprop="email">
                <a title="Email <?php the_title(); ?>" href="mailto:<?php echo esc_html( get_post_meta( $post->ID, 'illu_email', true ) ); ?>">→ <?php echo esc_html( get_post_meta( $post->ID, 'illu_email', true ) ); ?></a>
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
          $term = get_the_terms( $post->ID, 'gradyear' )[0];
          if ( isset( $term->name ) ) {
				echo '<a class="section-indicator-single" href="/year/' . esc_html( $term->slug ) . '" title="Return to ' . esc_html( $term->name ) . ' index"> ● ' . esc_html( $term->name ) . '</a>';
          };
        }
        ?>
        <ul class="illustrator-nav-single">
                  <li class="nav-previous">
                  <?php
        previous_post_link_plus(
             array(
            'order_by' => 'post_title',
            'format' => '%link',
            'in_same_tax' => true,
            'link' => '<span class="name previous-link">○ %title</span>',
          )
            );
          ?>
          <li class="nav-next">
          <?php
        next_post_link_plus(
             array(
            'order_by' => 'post_title',
            'format' => '%link',
            'in_same_tax' => true,
            'link' => '<span class="name next-link">%title ●</span>',
          )
            );
          ?>
          </li>
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
