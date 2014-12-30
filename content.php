<article <?php post_class('gallery-item'); ?> role="article">
  <a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
    <?php the_post_thumbnail('thumbnail', array('alt' => 'Thumbnail of '.get_the_title().'', 'title' => ''.get_the_title().'' )); ?>
    <h1 class="title p-name"><?php echo get_post_meta($post->ID, 'illu_title', true); ?></h1>
    <h2 class="illustrator-name p-author"><?php the_title(); ?></h2>
  </a>
</article><!-- <?php the_title(); ?> -->