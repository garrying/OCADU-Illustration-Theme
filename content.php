<article <?php post_class('gallery-item'); ?> role="article" data-id="<?php echo the_ID(); ?>">
  <a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
    <figure>
      <?php the_post_thumbnail('illustrator-small', array('alt' => 'Thumbnail of '.get_the_title().'', 'title' => ''.get_the_title().'' )); ?>
    </figure>
    <div class="illustrator-meta-container">
      <h1 class="illustrator-title p-name"><?php echo get_post_meta($post->ID, 'illu_title', true); ?></h1>
      <h2 class="illustrator-name p-author"><?php the_title(); ?></h2>
    </div>
  </a>
</article><!-- <?php the_title(); ?> -->