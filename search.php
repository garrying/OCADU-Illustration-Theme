<?php get_header(); ?>
<?php $term = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) ); ?>

<h1 id="page-title" class="sticky">
<?php if ($term->name == null)
		wp_title("");
	else
		echo $term->name;
 ?>
</h1>
			
		<div id="content" role="main">

		<?php if ( have_posts() ) : ?>
			<?php query_posts($query_string . '&orderby=title&order=ASC');?><!-- Query by Title -->
			<?php /* Start the Loop */ ?>
			<?php while ( have_posts() ) : the_post(); ?>

				<?php
					get_template_part( 'content', get_post_format() );
				?>

			<?php endwhile; ?>

			<?php ocadillu_content_nav( 'nav-below' ); ?>

		<?php else : ?>

			<article class="post no-results not-found">
				<div class="box"></div>
				<header class="entry-header">
					<h1 class="entry-title"><?php _e( 'Nothing Found' ); ?></h1>
					<h2><?php _e( 'Sorry, but nothing matched your search criteria. <br />Please try again with some different keywords.' ); ?></h2>
				</header><!-- .entry-header -->
			</article><!-- #post-0 -->

		<?php endif; ?>

		</div><!-- #content -->

<?php get_footer(); ?>