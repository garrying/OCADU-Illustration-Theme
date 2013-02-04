<?php get_header(); ?>
<?php $term = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) ); ?>

<h1 id="page-title" class="sticky">
<?php if (isset($term->name))
		echo $term->name;
	else
		wp_title("");
 ?>
</h1>
			

	<?php if ( have_posts() ) : ?>

		<?php if ( is_post_type_archive('event') ) : ?>
			<?php query_posts($query_string . '&orderby=date&order=DESC');?>
		<?php else : ?>
			<?php query_posts($query_string . '&orderby=title&order=ASC');?>
		<?php endif; ?>

		<?php /* Start the Loop */ ?>
		<?php while ( have_posts() ) : the_post(); ?>

			<?php
				get_template_part( 'content', get_post_format() );
			?>

		<?php endwhile; ?>

		<?php ocadillu_content_nav( 'nav-below' ); ?>

	<?php else : ?>

		<article class="post no-results not-found">
			<header class="entry-header">
				<h1 class="entry-title"><?php _e( 'Nothing Found', 'ocaduillustration' ); ?></h1>
			</header><!-- .entry-header -->

			<div class="entry-content">
				<p><?php _e( 'Apologies, but no results were found for the requested archive. Perhaps searching will help find a related post.', 'ocaduillustration' ); ?></p>
			</div><!-- .entry-content -->
		</article><!-- #post-0 -->

	<?php endif; ?>


<?php get_footer(); ?>