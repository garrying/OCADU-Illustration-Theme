<?php get_header(); ?>

<div id="container">

	<div id="illustrator-archive" class="index">
		
	<div id="welcome" class="post">
	<a href="/about" title="A message from Paul Dallas"></a>
	</div>

	<?php
		$args=array(
		'taxonomy' => 'gradyear',
		'post_type' => 'illustrator',
		'term' => '2011',
		'posts_per_page' => -1,
		'orderby' => 'rand',
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
       
</div>

</div> <!-- #container -->

<?php get_footer(); ?>