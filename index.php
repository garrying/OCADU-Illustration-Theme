<?php get_header(); ?>

	<div id="content" role="main">

		<?php if ( is_home() || is_front_page() ) : ?>
			<div id="intro">
				<p>
					OCAD U Illustration is an evolving archive maintained by the Illustration Department at OCAD University featuring work from the graduating class of 2012</p>
				</p>
				<p>
					Coinciding with the 97th annual OCAD U graduate exhibition May 5 to 8, 2012
				</p>
				<small><a href="/about" title="Link to a message from Paul Dallas">A message from Paul Dallas, Illustration Chair</a></small>
			</div>
		<?php endif; ?>

		<div id="progress">
		</div>
	
	<?php if ( is_home() || is_front_page() ) {
	$grad_year = get_terms('gradyear', 'hide_empty=1&order=DESC&number=1');	
	$args = array(
			'taxonomy' => 'gradyear',
			'post_type' => 'illustrator',
			'term' => $grad_year[0]->name,
			'orderby' => 'rand',
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

		<article class="post no-results not-found">
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
			
<?php get_footer(); ?>