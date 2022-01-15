<?php
  $post_id = get_the_id();

  $illu_title = get_post_meta( $post_id, 'illu_title', true);
  $illu_email = get_post_meta( $post_id, 'illu_email', true);
  $illu_sites = get_post_meta( $post_id, 'illu_sites', true);
  $illu_sites_2 = get_post_meta( $post_id, 'illu_sites_2', true);
  $illu_name = get_the_title();
  $illu_abstract = get_the_content();

  $ocaduillustration_json_ld = array(
    "@context" => "https://schema.org",
    "@type" => "CreativeWork",
    "author" => array(
      "@type" => "Person",
      "name" => $illu_name
    )
  );

  if ( has_post_thumbnail() ) {
    $featured_img = wp_get_attachment_image_src( get_post_thumbnail_id(), 'full', true );
    $ocaduillustration_json_ld['image'] = array(
      "@type" => "ImageObject",
      "url" => $featured_img[0],
      "width" => $featured_img[1],
      "height" => $featured_img[2]
    );
  }

  if ( $illu_title ) {
    $ocaduillustration_json_ld['name'] = $illu_title;
  }
  if ( $illu_email ) {
    $ocaduillustration_json_ld['author']['email'] = $illu_email;
  }
  if ( $illu_sites ) {
    $ocaduillustration_json_ld['author']['sameAs'] = $illu_sites;
    if ( $illu_sites_2 ) {
      $ocaduillustration_json_ld['author']['sameAs'] = array($illu_sites, $illu_sites_2);
    }
  }
  if ( $illu_abstract ) {
    $ocaduillustration_json_ld['abstract'] = $illu_abstract;
  }
?>

<script type="application/ld+json">
  <?php echo json_encode( $ocaduillustration_json_ld, JSON_UNESCAPED_SLASHES ); ?>
</script>

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
        <div class="illustrator-meta-description">

          <?php if ( get_post_meta( $post->ID, 'illu_title', true ) ) : ?>
            <?php
              $ocaduillustration_title_illu = get_post_meta( $post->ID, 'illu_title', true );
              echo '<h2 class="thesis-title">' . esc_html( $ocaduillustration_title_illu ) . '</h2>';
            ?>
          <?php endif; ?>

          <div class="thesis-description">
            <?php the_content(); ?>
          </div>

        </div>

        <div class="meta">
          <header class="illustrator-meta-header">
            <h1 class="illustrator-meta-name"><span id="name-blob"></span> <?php the_title(); ?></h1> 
          </header><!-- .illustrator-meta-header -->
          <div class="illustrator-meta-items">
            <?php if ( get_post_meta( $post->ID, 'illu_related', true ) ) : ?>
              <?php 
                $ocaduillustration_related_post       = get_post( get_post_meta( $post->ID, 'illu_related', true ) );
                $ocaduillustration_related_post_terms = get_the_terms( $ocaduillustration_related_post->ID, 'gradyear' );
              ?>
              <p class="meta-label"><?php echo esc_html( $ocaduillustration_related_post_terms[1]->name ); ?> ⤵</p>
              <a title="<?php echo esc_html( $ocaduillustration_related_post->post_title ); ?>" class="meta-link truncate pill" href="<?php echo esc_html( get_permalink( $ocaduillustration_related_post->ID ) ); ?>">✿ 
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
              <a target="_blank" rel="noopener" title="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites', true ) ); ?>" class="meta-link truncate pill" href="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites', true ) ); ?>">
                <?php
                  $ocaduillustration_url = esc_url( get_post_meta( $post->ID, 'illu_sites', true ) );
                  $ocaduillustration_url = preg_replace( '#^https?://#', '', $ocaduillustration_url );
                  echo esc_html( rtrim( $ocaduillustration_url, '/' ) );
                ?>
                ↗
              </a>
            <?php endif; ?>

            <?php if ( get_post_meta( $post->ID, 'illu_sites_2', true ) ) : ?>
              <a target="_blank" rel="noopener" title="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites_2', true ) ); ?>" class="meta-link truncate pill" href="<?php echo esc_url( get_post_meta( $post->ID, 'illu_sites_2', true ) ); ?>">
                <?php
                  $ocaduillustration_url = esc_url( get_post_meta( $post->ID, 'illu_sites_2', true ) );
                  $ocaduillustration_url = preg_replace( '#^https?://#', '', $ocaduillustration_url );
                  echo esc_html( rtrim( $ocaduillustration_url, '/' ) );
                ?>
                ↗
              </a>
            <?php endif; ?>

            <?php if ( get_post_meta( $post->ID, 'illu_email', true ) ) : ?>
              <a title="<?php echo esc_html( get_post_meta( $post->ID, 'illu_email', true ) ); ?>" class="meta-link truncate pill" href="mailto:<?php echo esc_html( get_post_meta( $post->ID, 'illu_email', true ) ); ?>"><?php echo esc_html( get_post_meta( $post->ID, 'illu_email', true ) ); ?> ✎</a>
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
