<article <?php post_class( 'gallery-item' ); ?>>
  <a href="<?php the_permalink(); ?>" class="illustrator-link" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
    <figure>
      <div class="illustrator-image">
        <?php the_post_thumbnail( 'illustrator-large' ); ?>
      </div>
    </figure>
    <div class="illustrator-meta-container">
      <div class="illustrator-content-container">
        <?php if ( ! is_home() ) : ?>
          <?php 
            $ocaduillustration_related_post_terms = get_the_terms( $post->ID, 'gradyear' );
            $ocaduillustration_selected_section   = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) );
          ?>
          <?php if ( get_post_meta( $post->ID, 'illu_related', true ) ) : ?>
            <?php if ( 'Thesis' !== $ocaduillustration_related_post_terms[1]->name && 'major-works' !== $ocaduillustration_selected_section->slug ) : ?>
              <div class="illustrator-type"><?php echo esc_html( $ocaduillustration_related_post_terms[1]->name ); ?></div>
            <?php endif; ?>
          <?php endif; ?>
        <?php endif; ?>
        <?php if ( get_post_meta( $post->ID, 'illu_title', true ) ) : ?>
          <h2 class="illustrator-meta-label illustrator-title"><?php echo esc_html( get_post_meta( $post->ID, 'illu_title', true ) ); ?>
          </h2>
        <?php endif; ?>
        <h3 class="illustrator-name"><?php the_title(); ?></h3>
      </div>
    </div>
  </a>
</article>
