<?php
/** Get content width **/

$amp_content_max_width = absint( $this->get( 'content_max_width' ) );

/* Get template colors */

$amp_theme_color             = $this->get_customizer_setting( 'theme_color' );
$amp_text_color              = $this->get_customizer_setting( 'text_color' );
$amp_muted_text_color        = $this->get_customizer_setting( 'muted_text_color' );
$amp_border_color            = $this->get_customizer_setting( 'border_color' );
$amp_link_color              = $this->get_customizer_setting( 'link_color' );
$amp_header_background_color = $this->get_customizer_setting( 'header_background_color' );
$amp_header_color            = $this->get_customizer_setting( 'header_color' );
?>
/* Generic WP styling */

.alignright {
  float: right;
}

.alignleft {
  float: left;
}

.aligncenter {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.amp-wp-enforced-sizes {
  /** Our sizes fallback is 100vw, and we have a padding on the container; the max-width here prevents the element from overflowing. **/
  max-width: 100%;
  margin: 0 auto;
}

.amp-wp-unknown-size img {
  /** Worst case scenario when we can't figure out dimensions for an image. **/
  /** Force the image into a box of fixed dimensions and use object-fit to scale. **/
  object-fit: contain;
}

/* Template Styles */

.amp-wp-content,
.amp-wp-title-bar div {
  <?php if ( $amp_content_max_width > 0 ) : ?>
  margin: 0 auto;
  max-width: <?php echo sprintf( '%dpx', $amp_content_max_width ); /* WPCS: xss ok. */ ?>;
  <?php endif; ?>
}

html {
  background: <?php echo sanitize_hex_color( $amp_header_background_color ); /* WPCS: xss ok. */ ?>;
}

body {
  background: <?php echo sanitize_hex_color( $amp_theme_color ); /* WPCS: xss ok. */ ?>;
  color: <?php echo sanitize_hex_color( $amp_text_color ); /* WPCS: xss ok. */ ?>;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif;
  line-height: 1.75em;
}

p,
ol,
ul,
figure {
  margin: 0 0 1em;
  padding: 0;
}

a,
a:visited {
  color: <?php echo sanitize_hex_color( $amp_text_color ); /* WPCS: xss ok. */ ?>;
}

a:hover,
a:active,
a:focus {
  color: <?php echo sanitize_hex_color( $amp_text_color ); /* WPCS: xss ok. */ ?>;
}

/* Quotes */

blockquote {
  color: <?php echo sanitize_hex_color( $amp_text_color ); /* WPCS: xss ok. */ ?>;
  background: rgba(127,127,127,.125);
  border-left: 2px solid <?php echo sanitize_hex_color( $amp_link_color ); /* WPCS: xss ok. */ ?>;
  margin: 8px 0 24px 0;
  padding: 16px;
}

blockquote p:last-child {
  margin-bottom: 0;
}

/* UI Fonts */

.amp-wp-meta,
.amp-wp-header div,
.amp-wp-title,
.wp-caption-text,
.amp-wp-tax-category,
.amp-wp-tax-tag,
.amp-wp-comments-link,
.amp-wp-footer p,
.back-to-top {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif;
}

/* Header */

.amp-wp-header {
  background-color: <?php echo sanitize_hex_color( $amp_header_background_color ); /* WPCS: xss ok. */ ?>;
}

.amp-wp-header div {
  color: <?php echo sanitize_hex_color( $amp_header_color ); /* WPCS: xss ok. */ ?>;
  font-size: 1em;
  font-weight: 400;
  margin: 0 auto;
  max-width: calc(840px - 32px);
  padding: .875em 16px;
  position: relative;
}

.amp-wp-header a {
  color: <?php echo sanitize_hex_color( $amp_header_color ); /* WPCS: xss ok. */ ?>;
  text-decoration: none;
}

/* Site Icon */

.amp-wp-header .amp-wp-site-icon {
  /** site icon is 32px **/
  border-radius: 50%;
  position: absolute;
  right: 18px;
  top: 10px;
}

/* Article */

.amp-wp-article {
  color: <?php echo sanitize_hex_color( $amp_text_color ); /* WPCS: xss ok. */ ?>;
  font-weight: 400;
  margin: 1.5em auto;
  max-width: 840px;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* Article Header */

.amp-wp-article-header {
  align-items: center;
  align-content: stretch;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 1.5em 16px 1.5em;
}

.amp-wp-title {
  color: <?php echo sanitize_hex_color( $amp_text_color ); /* WPCS: xss ok. */ ?>;
  display: block;
  flex: 1 0 100%;
  font-weight: 900;
  margin: 0 0 .625em;
  width: 100%;
}

/* Article Meta */

.amp-wp-meta {
  color: <?php echo sanitize_hex_color( $amp_muted_text_color ); /* WPCS: xss ok. */ ?>;
  display: inline-block;
  flex: 2 1 50%;
  font-size: .875em;
  line-height: 1.5em;
  margin: 0;
  padding: 0;
}

.amp-wp-article-header .amp-wp-meta:last-of-type {
  text-align: right;
}

.amp-wp-article-header .amp-wp-meta:first-of-type {
  text-align: left;
}

.amp-wp-byline amp-img,
.amp-wp-byline .amp-wp-author {
  display: inline-block;
  vertical-align: middle;
}

.amp-wp-byline amp-img {
  border: 1px solid <?php echo sanitize_hex_color( $amp_link_color ); /* WPCS: xss ok. */ ?>;
  border-radius: 50%;
  position: relative;
  margin-right: 6px;
}

.amp-wp-posted-on {
  text-align: right;
}

/* Featured image */

.amp-wp-article-featured-image {
  margin: 0 0 1em;
}
.amp-wp-article-featured-image amp-img {
  margin: 0 auto;
}
.amp-wp-article-featured-image.wp-caption .wp-caption-text {
  margin: 0 18px;
}

/* Article Content */

.amp-wp-article-content {
  margin: 0 16px;
}

.amp-wp-article-content ul,
.amp-wp-article-content ol {
  margin-left: 1em;
}

.amp-wp-article-content amp-img {
  margin: 0 auto;
}

.amp-wp-article-content amp-img.alignright {
  margin: 0 0 1em 16px;
}

.amp-wp-article-content amp-img.alignleft {
  margin: 0 16px 1em 0;
}

/* Captions */

.wp-caption {
  padding: 0;
}

.wp-caption.alignleft {
  margin-right: 16px;
}

.wp-caption.alignright {
  margin-left: 16px;
}

.wp-caption .wp-caption-text {
  border-bottom: 1px solid <?php echo sanitize_hex_color( $amp_border_color ); /* WPCS: xss ok. */ ?>;
  color: <?php echo sanitize_hex_color( $amp_muted_text_color ); /* WPCS: xss ok. */ ?>;
  font-size: .875em;
  line-height: 1.5em;
  margin: 0;
  padding: .66em 10px .75em;
}

/* AMP Media */

amp-carousel {
  margin: 0 -16px 1.5em;
}
amp-iframe,
amp-youtube,
amp-instagram,
amp-vine {
  background: <?php echo sanitize_hex_color( $amp_border_color ); /* WPCS: xss ok. */ ?>;
  margin: 0 -16px 1.5em;
}

.amp-wp-article-content amp-carousel amp-img {
  border: none;
}

amp-carousel > amp-img > img {
  object-fit: contain;
}

.amp-wp-iframe-placeholder {
  background: <?php echo sanitize_hex_color( $amp_border_color ); /* WPCS: xss ok. */ ?> url( <?php echo esc_url( $this->get( 'placeholder_image_url' ) ); /* WPCS: xss ok. */ ?> ) no-repeat center 40%;
  background-size: 48px 48px;
  min-height: 48px;
}

/* Article Footer Meta */

.amp-wp-article-footer .amp-wp-meta {
  display: block;
}

.amp-wp-tax-category,
.amp-wp-tax-tag {
  color: <?php echo sanitize_hex_color( $amp_muted_text_color ); /* WPCS: xss ok. */ ?>;
  font-size: .875em;
  line-height: 1.5em;
  margin: 1.5em 16px;
}

.amp-wp-comments-link {
  color: <?php echo sanitize_hex_color( $amp_muted_text_color ); /* WPCS: xss ok. */ ?>;
  font-size: .875em;
  line-height: 1.5em;
  text-align: center;
  margin: 2.25em 0 1.5em;
}

.amp-wp-comments-link a {
  border-style: solid;
  border-color: <?php echo sanitize_hex_color( $amp_border_color ); /* WPCS: xss ok. */ ?>;
  border-width: 1px 1px 2px;
  border-radius: 4px;
  background-color: transparent;
  color: <?php echo sanitize_hex_color( $amp_link_color ); /* WPCS: xss ok. */ ?>;
  cursor: pointer;
  display: block;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  margin: 0 auto;
  max-width: 200px;
  padding: 11px 16px;
  text-decoration: none;
  width: 50%;
  -webkit-transition: background-color 0.2s ease;
      transition: background-color 0.2s ease;
}

/* AMP Footer */

.amp-wp-footer {
  border-top: 1px solid <?php echo sanitize_hex_color( $amp_border_color ); /* WPCS: xss ok. */ ?>;
  margin: calc(1.5em - 1px) 0 0;
}

.amp-wp-footer div {
  margin: 0 auto;
  max-width: calc(840px - 32px);
  padding: 1.25em 16px 1.25em;
  position: relative;
}

.amp-wp-footer h2 {
  font-size: 1em;
  line-height: 1.375em;
  margin: 0 0 .5em;
}

.amp-wp-footer p {
  color: <?php echo sanitize_hex_color( $amp_muted_text_color ); /* WPCS: xss ok. */ ?>;
  font-size: .8em;
  line-height: 1.5em;
  margin: 0 85px 0 0;
}

.amp-wp-footer a {
  text-decoration: none;
}

.back-to-top {
  bottom: 1.275em;
  font-size: .8em;
  font-weight: 600;
  line-height: 2em;
  position: absolute;
  right: 16px;
}
