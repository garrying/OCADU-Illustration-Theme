<?php get_header(); ?>

<?php
if ( is_archive() ) {
    $ocaduillustration_selected_year = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) )->name;
    echo '<div class="section-indicator-index"><span class="section-indicator">';
    if ( isset( $ocaduillustration_selected_year ) ) {
      echo esc_html( $ocaduillustration_selected_year );
    };
    echo '</span></div>';
  }
?>

<div id="illustrators" class="grid illustrators-grid archive-grid">
  <?php $term = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) ); ?>
  <?php $args = array(
    'post_status' => 'publish',
    'post_type'   => 'illustrator',
    'tax_query'   => array(
      array(
        'taxonomy'  => 'gradyear',
        'field'     => 'slug',
        'terms'     => $term->slug,
      ),
    ),
    'orderby'     => 'title',
    'order'       => 'ASC',
  );
  $query = new WP_Query( $args ); ?>

  <?php if( $query->have_posts() ): ?>
    <?php while( $query->have_posts() ) : $query->the_post(); ?>
      <?php
        get_template_part( 'content', get_post_format() );
      ?>
    <?php endwhile; ?>
  <?php endif; ?>

  <?php wp_reset_query();  // Restore global post data stomped by the_post(). ?>
</div>
<?php get_footer(); ?>
