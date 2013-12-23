<article <?php post_class(); ?> role="article">
	<header class="entry-header">

		<a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
			<?php the_post_thumbnail('thumbnail', array('alt' => 'Thumbnail of '.get_the_title().'', 'title' => ''.get_the_title().'' )); ?>
			<h1><?php the_title(); ?></h1>
		</a>

	</header><!-- .entry-header -->
</article><!-- <?php the_title(); ?> -->