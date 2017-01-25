<!doctype html>
<html amp <?php echo AMP_HTML_Utils::build_attributes_string( $this->get( 'html_tag_attributes' ) ); ?>>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
  <?php do_action( 'amp_post_template_head', $this ); ?>
  <style amp-custom>
    <?php $this->load_parts( array( 'style' ) ); ?>
    <?php do_action( 'amp_post_template_css', $this ); ?>
  </style>
</head>
<body class="<?php echo esc_attr( $this->get( 'body_class' ) ); ?>">

<?php $this->load_parts( array( 'header-bar' ) ); ?>

<article class="amp-wp-article">
  <header class="amp-wp-article-header">
    <?php $title_illu = get_post_meta( $this->get( 'post_id' ), 'illu_title', true ); ?>
    <h1 class="amp-wp-title"><?php echo wp_kses_data( $title_illu ); ?></h1>
    <?php $this->load_parts( apply_filters( 'amp_post_template_meta_parts', array( 'meta-author', 'meta-taxonomy' ) ) ); ?>
  </header>

  <div class="amp-wp-article-content">
    <?php echo $this->get( 'post_amp_content' ); // amphtml content; no kses ?>
    <ul itemscope itemtype="http://schema.org/Person">
      <?php if ( get_post_meta( $this->get( 'post_id' ), 'illu_sites', true ) ) : ?>
        <li class="truncate" itemprop="url">
          <a title="Visit Illustrator's Website" class="site-url" href="<?php echo esc_url( get_post_meta( $this->get( 'post_id' ), 'illu_sites', true ) ) ?>">
            <?php
              $url = esc_url( get_post_meta( $this->get( 'post_id' ), 'illu_sites', true ) );
              $url = preg_replace( '#^https?://#', '', $url );
              echo esc_html( $url );
            ?>
          </a>
        </li>
      <?php endif; ?>

      <?php if ( get_post_meta( $this->get( 'post_id' ), 'illu_sites_2', true ) ) : ?>
        <li class="truncate" itemprop="url">
          <a title="Visit Illustrator's Website" class="site-url" href="<?php echo esc_url( get_post_meta( $this->get( 'post_id' ), 'illu_sites_2', true ) ) ?>">
            <?php
              $url = esc_url( get_post_meta( $this->get( 'post_id' ), 'illu_sites_2', true ) );
              $url = preg_replace( '#^https?://#', '', $url );
              echo esc_html( $url );
            ?>
          </a>
        </li>
      <?php endif; ?>

      <?php if ( get_post_meta( $this->get( 'post_id' ), 'illu_email', true ) ) : ?>
        <li class="email truncate" itemprop="email">
          <a title="Email <?php the_title(); ?>" href="mailto:<?php echo esc_html( get_post_meta( $this->get( 'post_id' ), 'illu_email', true ) ) ?>"><?php echo esc_html( get_post_meta( $this->get( 'post_id' ), 'illu_email', true ) ) ?></a>
        </li>
      <?php endif; ?>

      <?php if ( get_post_meta( $this->get( 'post_id' ), 'illu_phone', true ) ) : ?>
        <li class="phone" itemprop="telephone">
          <?php echo esc_html( get_post_meta( $this->get( 'post_id' ), 'illu_phone', true ) ) ?>
        </li>
      <?php endif; ?>
    </ul>
  </div>
</article>

<?php $this->load_parts( array( 'footer' ) ); ?>
<?php do_action( 'amp_post_template_footer', $this ); ?>

</body>
</html>
