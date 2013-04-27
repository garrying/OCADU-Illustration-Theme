<?php get_header(); ?>

<?php $term = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) ); ?>

<h1 id="page-title">
<?php if (isset($term->name))
		echo $term->name;
	else
		wp_title("");
?>
</h1>

	<?php if ( have_posts() ) : ?>
		<?php query_posts($query_string . '&orderby=title&order=ASC');?><!-- Query by Title -->
		<?php /* Start the Loop */ ?>
		<?php while ( have_posts() ) : the_post(); ?>

			<?php
				get_template_part( 'content', get_post_format() );
			?>

	<?php endwhile; ?>

	<?php else : ?>

		<article class="post no-results not-found">
			<div class="box"></div>
			<header class="entry-header">
				<h1 class="entry-title"><?php _e( 'No Matches &#9785;', 'ocaduillustration' ); ?></h1>
				<p><?php _e( 'Sorry, but nothing matched your search criteria. <br />Please try again with some different keywords.', 'ocaduillustration' ); ?></p>
			</header><!-- .entry-header -->
		</article><!-- #post-0 -->

	<?php endif; ?>

<?php get_footer(); ?>