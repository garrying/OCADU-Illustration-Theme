<div id="footer">
	<div class="container">

<p>Keyboard Shortcuts: <span class="arrow">&larr;</span> Previous Illustrator // Next Illustrator <span class="arrow">&rarr;</span></p>
<div class="footer-selects">
	
	<div class="footer-selects-person">
	 
	<form class="ddpl-form" name="illustrator-select" id="illustrator-select"><select name="illu-jumpmenu" id="illu-jumpmenu" onchange="MM_jumpMenu('parent',this,0)">
			<option value="">Select an Illustrator</option>
			
		  <?php
        $wpq = array( 'post_type' => 'illustrator', 'order' => 'ASC', 'orderby' => 'title', 'posts_per_page' => '-1' );
        $year_posts = new WP_Query ($wpq);
      ?>
      <?php foreach( $year_posts->posts as $post ) : ?>
     
          <option value="<?php echo get_permalink( $post->ID ); ?>">
            <?php echo $post->post_title; ?>
          </option>
        
      <?php endforeach ?>
		
		</select>
	</form>
	
	</div>

	<div class="footer-selects-year">
	Previous Sites: <a href="http://2009.ocadillustration.com" title="Class of 2009">2009</a> | <a href="http://2010.ocadillustration.com" title="class of 2010">2010</a>
	</div>
	
</div>

<p>Maintained by the Illustration Department at <a href="http://www.ocad.ca" title="OCAD U We Heart U">OCAD University</a></p>

<p>We ♥ <a href="http://wordpress.org" title="Seriously">Wordpress</a></p>

<p>Copyright &copy; <?php echo date('Y'); ?> // Respective Authors</p>
<img id="footer-image" src="<?php echo get_template_directory_uri(); ?>/assets/images/footer-logo.png" alt="OCAD U Illustration 2011">

	</div>
</div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
<script src="<?php echo get_template_directory_uri(); ?>/assets/js/jquery.masonry.min.js"></script>
<script src="<?php echo get_template_directory_uri(); ?>/assets/js/jquery.uniform.min.js"></script>
<script src="<?php echo get_template_directory_uri(); ?>/assets/js/global.js"></script>

<?php
if ( function_exists( 'yoast_analytics' ) ) { 
  yoast_analytics(); 
}
?>

<?php
	/* Always have wp_footer() just before the closing </body>
	 * tag of your theme, or you will break many plugins, which
	 * generally use this hook to reference JavaScript files.
	 */
	wp_footer();
?>

</body>
</html>
