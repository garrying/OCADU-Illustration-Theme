<article <?php post_class('gallery-item'); ?> role="article" data-id="<?php echo the_ID(); ?>">
  <a href="<?php the_permalink() ?>" class="illustrator-link" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
    <figure>
      <?php the_post_thumbnail('illustrator-small', array('alt' => 'Thumbnail of '.get_the_title().'', 'title' => ''.get_the_title().'' )); ?>
    </figure>
    <div class="illustrator-meta-container">
      <h1 class="illustrator-title"><?php echo get_post_meta($post->ID, 'illu_title', true); ?></h1>
      <span class="illustrator-name"><?php the_title(); ?></span>
    </div>
  </a>
</article>