<?php get_header(); ?>

<div id="container">

	<div id="illustrator-archive">

	<?php if (have_posts()) : ?>

	<?php $post = $posts[0]; // Hack. Set $post so that the_date() works. ?>
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


<div class="navigation">
    <div class="alignleft"><?php next_posts_link('&laquo; Older Entries') ?></div>
    <div class="alignright"><?php previous_posts_link('Newer Entries &raquo;') ?></div>
</div>


</div> <!-- #container -->

<?php get_footer(); ?>