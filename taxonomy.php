<?php get_header(); ?>

<?php
if ( is_archive() ) {
    $ocaduillustration_selected_section = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) );
    if ( $ocaduillustration_selected_section->parent > 0 ) {
      $ocaduillustration_selected_section_parent = get_term( $ocaduillustration_selected_section->parent, get_query_var( 'taxonomy' ) );
    }
    echo '<div class="section-indicator-index"><span class="section-indicator">';
    if ( isset( $ocaduillustration_selected_section_parent ) ) {
      echo esc_html( $ocaduillustration_selected_section->name );
      echo '<br>';
      echo esc_html( $ocaduillustration_selected_section_parent->name );
    } else {
      echo esc_html( $ocaduillustration_selected_section->name );
    }
    echo '</span></div>';
  }
?>

<div id="illustrators" class="grid illustrators-grid archive-grid">
  <?php $ocaduillustration_term = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) ); ?>
  <?php
  $ocaduillustration_args  = array(
    'post_status' => 'publish',
    'post_type'   => 'illustrator',
    'tax_query'   => array(
      array(
        'taxonomy' => 'gradyear',
        'field'    => 'slug',
        'terms'    => $ocaduillustration_term->slug,
      ),
    ),
    'orderby'     => 'title',
    'order'       => 'ASC',
  );
  $ocaduillustration_query = new WP_Query( $ocaduillustration_args );
  ?>

  <?php if ( $ocaduillustration_query->have_posts() ) : ?>
    <?php
    while ( $ocaduillustration_query->have_posts() ) :
      $ocaduillustration_query->the_post();
    ?>
    <?php
      get_template_part( 'content', get_post_format() );
    ?>
    <?php endwhile; ?>
  <?php endif; ?>

  <?php wp_reset_postdata(); ?>
</div>
<?php get_footer(); ?>
