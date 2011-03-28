<?php get_header(); ?>

<div id="container">
	
	<div id="search-results">
		
	<?php if (have_posts()) : ?>
    
<div class="post" id="search-form">
	    <h1><?php printf( __( 'Search Results for %s' ), '<span class="term">' . get_search_query() . '</span>' ); ?></h1>
   
	    <div class="excerpt">
	    	<?php get_search_form(); ?>
	    </div>
</div>
		<?php while (have_posts()) : the_post(); ?>

      <div class="post">
              <div class="thumbnail">
                  <a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
                      <h2 id="post-<?php the_ID(); ?>"><?php the_title(); ?></h2>
                      <?php the_post_thumbnail('medium'); ?>
                  </a>
              </div>
      </div><!-- .post -->


			<?php endwhile; ?>
    

	<?php else : ?>
               
	   <div class="post" id="search-form">
			    <h1><?php printf( __( 'Search Results for %s' ), '<span class="term">' . get_search_query() . '</span>' ); ?></h1>

			    <div class="excerpt">
			    	<?php get_search_form(); ?>
			    </div>
		</div>
    
	    <div class="post" id="neg-search">
	      <h2>Unfortunately nothing was found to match your search term.</h2>
	    </div>

	<?php endif; ?>

  </div> <!-- search-results -->

	<div class="navigation">
	    <div class="alignleft"><?php next_posts_link('&laquo; Older Entries') ?></div>
	    <div class="alignright"><?php previous_posts_link('Newer Entries &raquo;') ?></div>
	</div>

</div>

<?php get_footer(); ?>