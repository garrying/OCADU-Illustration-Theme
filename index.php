<?php get_header(); ?>

		<div id="primary">
			
			<div id="content" role="main">
			
			<?php if ( is_home() || is_front_page() ) {
			$args = array(
					'taxonomy' => 'gradyear',
					'post_type' => 'illustrator',
					'term' => '2011',
					'posts_per_page' => 5,
					);
			query_posts( $args );
			}
			?>

			<?php if ( have_posts() ) : ?>

				<?php /* Start the Loop */ ?>
				<?php while ( have_posts() ) : the_post(); ?>

					<?php get_template_part( 'content', get_post_format() ); ?>

				<?php endwhile; ?>

			<?php else : ?>

				<article id="post-0" class="post no-results not-found">
					<header class="entry-header">
						<h1 class="entry-title"><?php _e( 'Nothing Found' ); ?></h1>
					</header><!-- .entry-header -->

					<div class="entry-content">
						<p><?php _e( 'Apologies, but no results were found for the requested archive. Perhaps searching will help find a related post.' ); ?></p>
					</div><!-- .entry-content -->
				</article><!-- #post-0 -->

			<?php endif; ?>

			</div><!-- #content -->
			<?php ocadillu_content_nav( 'nav-below' ); ?>
			
		</div><!-- #primary -->

<?php get_footer(); ?>