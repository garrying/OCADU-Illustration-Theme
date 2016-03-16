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

          <?php the_content(); ?>

          <meta itemprop="description" content="<?php $text = strip_tags( get_the_content() ); esc_html_e( wptexturize( $text ) ) ?>">
          <meta itemprop="author copyrightHolder" content="<?php the_title(); ?>">
          <meta itemprop="image" content="<?php $image = wp_get_attachment_url( get_post_thumbnail_id( $post->ID ) ); esc_html_e( $image ) ?>">

        </div>

        <div class="meta" itemscope itemtype="http://schema.org/Person">
          <header class="illustrator-meta-header">
            <h1 class="illustrator-meta-name" itemprop="name"><?php the_title(); ?></h1>
          </header><!-- .illustrator-meta-header -->
            
          <?php if ( get_post_meta( $post->ID, 'illu_sites', true ) ) : ?>
            <div itemprop="url">
              <a title="Visit Illustrator's Website" class="site-url" href="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites', true ) ) ?>">
                <?php
                  $url = esc_url( get_post_meta( $post->ID, 'illu_sites', true ) );
                  $url = preg_replace( '#^https?://#', '', $url );
                  esc_html_e( $url );
                ?>
              </a>
            </div>
          <?php endif; ?>

          <?php if ( get_post_meta( $post->ID, 'illu_sites_2', true ) ) : ?>
            <div itemprop="url">
              <a title="Visit Illustrator's Website" class="site-url" href="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites_2', true ) ) ?>">
                <?php
                  $url = esc_url( get_post_meta( $post->ID, 'illu_sites_2', true ) );
                  $url = preg_replace( '#^https?://#', '', $url );
                  esc_html_e( $url );
                ?>
              </a>
            </div>
          <?php endif; ?>

          <?php if ( get_post_meta( $post->ID, 'illu_email', true ) ) : ?>
            <div class="email" itemprop="email">
              <a title="Email <?php the_title(); ?>" href="mailto:<?php esc_html_e( get_post_meta( $post->ID, 'illu_email', true ) ) ?>"><?php echo esc_html( get_post_meta( $post->ID, 'illu_email', true ) ) ?></a>
            </div>
          <?php endif; ?>

          <?php if ( get_post_meta( $post->ID, 'illu_phone', true ) ) : ?>
            <div class="phone" itemprop="telephone">
              <?php esc_html_e( get_post_meta( $post->ID, 'illu_phone', true ) ) ?>
            </div>
          <?php endif; ?>
        </div>
      </div>

      <ul class="illustrator-nav-single">
        <?php if ( is_singular( 'illustrator' ) ) {
            $term = get_the_terms( $post->ID, 'gradyear' )[0];
            echo '<a class="section-indicator" href="/year/'. esc_html( $term->slug ) .'" title="Return to '. esc_html( $term->name ) .' grid">↵ ';
            if ( isset( $term->name ) ) {
              esc_html_e( $term->name );
            };
            echo '</a>';
          }
        ?>
        <li class="nav-previous truncate"><?php previous_post_link_plus( array( 'order_by' => 'post_title', 'format' => '%link', 'in_same_tax' => true, 'link' => '<span class="indicator"></span> <span class="truncate name">⤺ %title</span>' ) ); ?></li>
        <li class="nav-next truncate"><?php next_post_link_plus( array( 'order_by' => 'post_title', 'format' => '%link', 'in_same_tax' => true, 'link' => '<span class="truncate name">%title ⤻</span> <span class="indicator"></span>' ) ); ?></li>
      </ul><!-- .llustrator-nav-single -->

    </div>

  </div><!-- .illustrator-meta -->

  <div class="illustrator-gallery-container">
    <?php echo do_shortcode( '[gallery size="medium" link="file" columns="0"]' ); ?>
    <div id="image-modal" class="image-modal-wrapper hidden">
      <button class="close-panel" title="Close full view" aria-label="Close full view">Close</button>
      <div class="image-modal-tip"></div>
      <div class="image-modal-container"></div>
    </div>
  </div>

</article><!-- .single-illustrator -->
