<li class="amp-wp-byline">
  <?php if ( get_post_meta( $this->get( 'post_id' ), 'illu_email', true ) ) : ?>
    <a title="Email <?php the_title(); ?>" href="mailto:<?php esc_html_e( get_post_meta( $this->get( 'post_id' ), 'illu_email', true ) ) ?>">
      <span class="amp-wp-author"><?php echo esc_html( the_title() ); ?></span>
    </a>
  <?php endif; ?>
</li>