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
