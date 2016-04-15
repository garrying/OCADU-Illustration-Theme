<article <?php post_class( 'gallery-item' ); ?> role="article" data-id="<?php echo the_ID(); ?>">
  <a href="<?php the_permalink() ?>" class="illustrator-link" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
    <figure>
      <div class="illustrator-image">
        <?php
          $image_data = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'illustrator-small' );
          $image_srcset = wp_get_attachment_image_srcset( get_post_thumbnail_id( $post->ID ) );
          $image_width = $image_data[1];
          $image_height = $image_data[2];
        ?>
        <?php the_post_thumbnail( 'illustrator-small', array( 'src' => '', 'srcset' => ' ', 'data-src' => $image_data[0], 'data-sizes' => 'auto', 'data-srcset' => $image_srcset, 'class' => 'lazyload', 'alt' => 'Thumbnail of ' . get_the_title() . '', 'title' => '' . get_the_title() . '' ) ); ?>
        <canvas class="illustrator-placeholder" height="<?php echo $image_height; ?>" width="<?php echo $image_width; ?>"></canvas>
      </div>
    </figure>
    <div class="illustrator-meta-container">
      <h1 class="illustrator-title p-name"><?php esc_html_e( get_post_meta( $post->ID, 'illu_title', true ) ); ?></h1>
      <span class="illustrator-name p-author"><?php the_title(); ?></span>
    </div>
  </a>
</article>
