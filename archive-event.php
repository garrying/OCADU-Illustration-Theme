<?php get_header(); ?>

<div id="container">

	<div id="event-archive" class="grid-small">
		
	<?php if (have_posts()) : ?>
		
	<h1 class="year-title post">Events</h1>

	<?php while (have_posts()) : the_post(); ?>
	
  <div class="post">
               <div class="thumbnail">
                   <a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
                       <h2 id="post-<?php the_ID(); ?>"><?php the_title(); ?></h2>
                       <?php the_post_thumbnail('medium', array('alt' => '.get_the_title().', 'title' => ''.get_the_title().'' )); ?>
                   </a>
               </div>
       </div>
       
       <?php endwhile; ?>       
   
<?php else :

	if ( is_category() ) { // If this is a category archive
		printf("<h2 class='center'>Sorry, but there aren't any posts in the %s category yet.</h2>", single_cat_title('',false));
	} else if ( is_date() ) { // If this is a date archive
		echo("<h2>Sorry, but there aren't any posts with this date.</h2>");
	} else if ( is_author() ) { // If this is a category archive
		$userdata = get_userdatabylogin(get_query_var('author_name'));
		printf("<h2 class='center'>Sorry, but there aren't any posts by %s yet.</h2>", $userdata->display_name);
	} else {
		echo("<h2 class='center'>No posts found.</h2>");
	}
	get_search_form();

endif;
?>

</div>

<?php if (  $wp_query->max_num_pages > 1 ) : ?>
<div class="navigation clearfix">
	<div class="container">
    <div class="prev-link"><?php previous_posts_link('&laquo; View Previous') ?></div>
    <div class="next-link"><?php next_posts_link('View More &raquo;') ?></div>
	</div>
</div>
<?php endif; ?>

</div> <!-- #container -->

<?php get_footer(); ?>