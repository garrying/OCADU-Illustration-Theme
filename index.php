<?php get_header(); ?>

<div id="container">

	<div id="illustrator-archive" class="index">
		
	<div class="post" style="background:#222;width:465px;height:600px">
	asdadad
	</div>

	<?php if (have_posts()) : ?>
		
	<?php
		$args=array(
		  'taxonomy' => 'gradyear',
		  'post_type' => 'illustrator',
			//'term' => '2011',
		  'posts_per_page' => -1,
		);
	?>

	<?php $post = $posts[0]; // Hack. Set $post so that the_date() works. ?>
  <?php query_posts( $args );?>
	<?php while (have_posts()) : the_post(); ?>
       <div class="post">
               <div class="thumbnail">
                   <a href="<?php the_permalink() ?>" rel="bookmark" title="<?php the_title(); ?>">
                       <?php the_post_thumbnail('thumbnail', array('alt' => 'Thumbnail of '.get_the_title().'', 'title' => ''.get_the_title().'' )); ?>
                   </a>
               </div>
       </div><!-- .post --> 
       <?php endwhile; ?>
       
<?php endif; ?>


</div>

<?php if (  $wp_query->max_num_pages > 1 ) : ?>
<div class="navigation clearfix">
    <div class="alignleft"><?php previous_posts_link('&laquo; View Previous') ?></div>
    <div class="alignright"><?php next_posts_link('View More &raquo;') ?></div>
</div>
<?php endif; ?>


</div> <!-- #container -->

<?php get_footer(); ?>