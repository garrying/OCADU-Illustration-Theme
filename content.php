<article <?php post_class( 'gallery-item' ); ?> role="article">
  <a href="<?php the_permalink() ?>" class="illustrator-link" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
    <figure>
      <div class="illustrator-image">
        <?php
          $image_data = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'illustrator-small' );
          $image_width = $image_data[1];
          $image_height = $image_data[2];
        ?>
        <?php the_post_thumbnail( 'illustrator-small' ); ?>
        <canvas class="illustrator-placeholder" height="<?php echo esc_attr( $image_height ); ?>" width="<?php echo esc_attr( $image_width ); ?>"></canvas>
      </div>
    </figure>
    <div class="illustrator-meta-container">
      <?php if ( get_post_meta( $post->ID, 'illu_title', true ) ) : ?>
        <h1 class="illustrator-meta-label illustrator-title p-name"><?php echo esc_html( get_post_meta( $post->ID, 'illu_title', true ) ); ?></h1>
      <?php endif; ?>
      <h2 class="illustrator-meta-label illustrator-name p-author"><?php the_title(); ?></h2>
    </div>
  </a>
</article>
