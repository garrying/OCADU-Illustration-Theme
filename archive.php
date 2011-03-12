<?php get_header(); ?>
<?php $term = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) ); ?>
<div id="container">

	<h1 class="page-title"><?php echo $term->name; ?></h1>
	<div id="year-archive">
	<?php if (have_posts()) : ?>
		
		<?php query_posts($query_string . '&orderby=title&order=ASC');?>
		
	  <?php while (have_posts()) : the_post(); ?>

	    <div class="post type-post hentry">
	      <h2 class="entry-title">
	        <a href="<?php echo get_permalink(); ?>" title="<?php the_title(); ?>" rel="bookmark">
	          <?php the_title(); ?>
	       </a>
	      </h2>
<a href="<?php echo get_permalink(); ?>" title="<?php the_title(); ?>" rel="bookmark">	<?php the_post_thumbnail('thumbnail'); ?> </a>

	      <div class="entry-summary">
	        <?php the_excerpt(); ?>
	      </div><!-- .entry-summary -->
	    </div>

	  <?php endwhile; ?>
	<?php endif; ?>
	</div>

</div> <!-- #container -->

<?php get_footer(); ?>