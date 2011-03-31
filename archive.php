<?php get_header(); ?>
<?php $term = get_term_by( 'slug', get_query_var( 'term' ), get_query_var( 'taxonomy' ) ); ?>
<div id="container">

	<div id="year-archive" class='grid-small'>
	
	<h1 class="year-title post"><?php echo $term->name; ?></h1>
		
	<?php if (have_posts()) : ?>
		
		<?php query_posts($query_string . '&orderby=title&order=ASC');?>
		
	  <?php while (have_posts()) : the_post(); ?>

      <div class="post">
         <div class="thumbnail">
             <a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
                 <h2 id="post-<?php the_ID(); ?>"><?php the_title(); ?></h2>
                 <?php the_post_thumbnail('thumbnail'); ?>
             </a>
         </div>
      </div><!-- .post -->

	  <?php endwhile; ?>
	<?php endif; ?>
	</div>

</div> <!-- #container -->

<?php get_footer(); ?>