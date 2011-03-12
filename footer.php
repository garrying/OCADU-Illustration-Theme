<div id="footer">

<p id="footer-header"><a href="<?php echo get_option('home'); ?>" title="<?php bloginfo('name'); ?>"><?php bloginfo('name'); ?></a></p>
	
<div id="footer-menu">
	<div id="year-select">
	  <h2>Graduating Year</h2>
	  <?php $grad_year = get_terms('gradyear', 'hide_empty=1&order=DESC'); ?>
	  <ul>
	    <?php foreach( $grad_year as $year ) : ?>
	      <li class="year <?php if ($term == $year->name) echo 'active' ?>">
	        <h3><a href="<?php echo get_term_link( $year->slug, 'gradyear' ); ?>">
	          <?php echo $year->name; ?>
	        </a></h3>
	        <ul>
	          <?php
	            $wpq = array( 'post_type' => 'illustrator', 'posts_per_page' => '-1', 'taxonomy' => 'gradyear', 'order' => 'ASC', 'orderby' => 'title', 'term' => $year->slug );
	            $year_posts = new WP_Query ($wpq);
	          ?>
	          <?php foreach( $year_posts->posts as $post ) : ?>
	            <li class="<?php if ($post->ID == $wp_query->post->ID && is_single()) echo 'active' ?>"> 
								<a href="<?php echo get_permalink( $post->ID ); ?>">
	                <?php echo $post->post_title; ?>	  
	              </a>
	            </li>
	          <?php endforeach ?>
	        </ul>
	      </li>
	    <?php endforeach ?>
	  </ul>
	</div>
	
	<div class="events">
	<h2>  
	<a href="/events" class="<?php if (is_post_type_archive( 'event' )) echo 'active' ?>">
  Events
  </a>
	</h2>
    <ul>
      <?php
        $wpq = array( 'post_type' => 'event', 'order' => 'DESC', 'orderby' => 'date' );
        $year_posts = new WP_Query ($wpq);
      ?>
      <?php foreach( $year_posts->posts as $post ) : ?>
        <li class="<?php if ($post->ID == $wp_query->post->ID && is_single()) echo 'active' ?>">
          <a href="<?php echo get_permalink( $post->ID ); ?>">
            <?php echo $post->post_title; ?>
          </a>
        </li>
      <?php endforeach ?>
    </ul>

	</div>
</div> <!-- #footer-menu -->
</div> <!-- #footer -->

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
<script src="<?php echo get_template_directory_uri(); ?>/assets/js/jquery.masonry.min.js"></script>
<script src="<?php echo get_template_directory_uri(); ?>/assets/js/global.js"></script>


<?php
	/* Always have wp_footer() just before the closing </body>
	 * tag of your theme, or you will break many plugins, which
	 * generally use this hook to reference JavaScript files.
	 */

	wp_footer();
?>

</body>
</html>
