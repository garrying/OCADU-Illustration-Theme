<!doctype html>
<html amp>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
  <?php do_action( 'amp_post_template_head', $this ); ?>

  <style amp-custom>
  <?php $this->load_parts( array( 'style' ) ); ?>
  <?php do_action( 'amp_post_template_css', $this ); ?>
  </style>
</head>
<body>
<nav class="amp-wp-title-bar">
  <div>
    <a href="<?php echo esc_url( $this->get( 'home_url' ) ); ?>">
      <?php $site_icon_url = $this->get( 'site_icon_url' ); ?>
      <?php if ( $site_icon_url ) : ?>
        <amp-img src="<?php echo esc_url( $site_icon_url ); ?>" width="32" height="32" class="amp-wp-site-icon"></amp-img>
      <?php endif; ?>
      <?php echo esc_html( $this->get( 'blog_name' ) ); ?>
    </a>
  </div>
</nav>
<div class="amp-wp-content">
  <?php $title_illu = get_post_meta( $this->get( 'post_id' ), 'illu_title', true ); ?>
  <h1 class="amp-wp-title"><?php echo esc_html( $title_illu ); ?></h1>
  <ul class="amp-wp-meta">
    <?php $this->load_parts( apply_filters( 'amp_post_template_meta_parts', array( 'meta-author', 'meta-time', 'meta-taxonomy' ) ) ); ?>
  </ul>
  <?php
    // @codingStandardsIgnoreStart
    echo $this->get( 'post_amp_content' ); // AMPHTML content; no kses.
    // @codingStandardsIgnoreEnd
  ?>
  <ul class="amp-wp-meta" itemscope itemtype="http://schema.org/Person">
    <?php if ( get_post_meta( $this->get( 'post_id' ), 'illu_sites', true ) ) : ?>
      <li class="truncate" itemprop="url">
        <a title="Visit Illustrator's Website" class="site-url" href="<?php echo esc_url( get_post_meta( $this->get( 'post_id' ), 'illu_sites', true ) ) ?>">
          <?php
            $url = esc_url( get_post_meta( $this->get( 'post_id' ), 'illu_sites', true ) );
            $url = preg_replace( '#^https?://#', '', $url );
            esc_html_e( $url );
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
            esc_html_e( $url );
          ?>
        </a>
      </li>
    <?php endif; ?>

    <?php if ( get_post_meta( $this->get( 'post_id' ), 'illu_email', true ) ) : ?>
      <li class="email truncate" itemprop="email">
        <a title="Email <?php the_title(); ?>" href="mailto:<?php esc_html_e( get_post_meta( $this->get( 'post_id' ), 'illu_email', true ) ) ?>"><?php echo esc_html( get_post_meta( $this->get( 'post_id' ), 'illu_email', true ) ) ?></a>
      </li>
    <?php endif; ?>

    <?php if ( get_post_meta( $this->get( 'post_id' ), 'illu_phone', true ) ) : ?>
      <li class="phone" itemprop="telephone">
        <?php esc_html_e( get_post_meta( $this->get( 'post_id' ), 'illu_phone', true ) ) ?>
      </li>
    <?php endif; ?>
  </div>
</div>
<?php do_action( 'amp_post_template_footer', $this ); ?>
</body>
</html>
