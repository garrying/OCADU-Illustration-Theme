<footer class="amp-wp-footer">
  <div>
    <h2><?php echo esc_html( $this->get( 'blog_name' ) ); ?></h2>
    <?php
    $ocaduillustration_description = get_bloginfo( 'description', 'display' );
      if ( $ocaduillustration_description_description || is_customize_preview() ) :
      ?>
        <p class="site-description"><?php echo $ocaduillustration_description_description; // phpcs:ignore ?></p>
    <?php endif; ?>
    <a href="#top" class="back-to-top">Back to top</a>
  </div>
</footer>
