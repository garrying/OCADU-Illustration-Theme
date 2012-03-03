	<article <?php post_class(); ?> role="article">
		<header class="entry-header">

		<?php if ( is_page() ) : // Only display Excerpts for Search ?>

			<h1><?php the_title(); ?></h1>

		<?php else : ?>

			<a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
			   <?php the_post_thumbnail('thumbnail', array('alt' => 'Thumbnail of '.get_the_title().'', 'title' => ''.get_the_title().'' )); ?>
				<h1><?php the_title(); ?></h1>

			</a>

		<?php endif; ?>

		</header><!-- .entry-header -->
	
		<?php if ( is_page() ) : ?>
		<div class="entry-content">
			<?php the_content( __( 'Continue reading <span class="meta-nav">&rarr;</span>' ) ); ?>
		</div><!-- .entry-content -->
		<?php endif; ?>

	</article><!-- #post-<?php the_ID(); ?> -->