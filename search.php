<?php get_header(); ?>

	<div id="container">

	<?php if (have_posts()) : ?>
    
	<div id="feature">

	    <h1>Search Results</h1>
   
	    <div class="excerpt">
	    	<p><?php get_search_form(); ?></p>
	    </div>
   
	</div> <!-- #feature -->
        
        
        <div class="post">

		<?php while (have_posts()) : the_post(); ?>

            <div class="result">
                <div class="thumbnail">
                    <a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"><h2 id="post-<?php the_ID(); ?>"><?php the_title(); ?></h2><?php the_post_thumbnail('thumbnail'); ?></a>
                </div>
            </div>

			<?php endwhile; ?>
    
            <div class="navigation">
                <div class="alignleft"><?php next_posts_link('&laquo; Older Entries') ?></div>
                <div class="alignright"><?php previous_posts_link('Newer Entries &raquo;') ?></div>
            </div>
            
       </div> <!-- .post -->

	<?php else : ?>

		<div id="feature">
               
    
	    <h1>Search Results</h1>
    
	    <div class="excerpt">
	      <p>Unfortunately no posts were found to match your search term. Would you like to try a different search?</p>
	    	<?php get_search_form(); ?>
	    </div>

  </div> <!-- #feature -->

	<?php endif; ?>

	</div>

<?php get_footer(); ?>