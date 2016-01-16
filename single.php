<?php if ( !isset( $_SERVER['HTTP_X_PJAX'] ) ) : ?>
    <?php get_header(); ?>
  <?php else : ?>
    <title><?php wp_title( '&#8211;', true, 'right'); bloginfo('name'); ?></title>
<?php endif; ?>

  <?php while ( have_posts() ) : the_post(); ?>

    <?php get_template_part( 'content', 'single' ); ?>

  <?php endwhile; // End of the loop. ?>

<?php if ( !isset( $_SERVER['HTTP_X_PJAX'] ) ) : ?>
  <?php get_footer(); ?>
<?php endif; ?>
