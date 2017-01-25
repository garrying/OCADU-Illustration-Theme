<footer class="amp-wp-footer">
  <div>
    <h2><?php echo esc_html( $this->get( 'blog_name' ) ); ?></h2>
    <p>
      <?php printf( __( '%s', 'amp' ), get_bloginfo( 'description' ) ); ?>
    </p>
    <a href="#top" class="back-to-top"><?php _e( 'Back to top', 'amp' ); ?></a>
  </div>
</footer>