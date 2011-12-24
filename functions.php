<?php

/**
 * Load some scripts please.
 */
 
if (!function_exists('load_my_scripts')) {
    function load_scripts() {
    	if (!is_admin()) {
		wp_deregister_script( 'jquery' );
		wp_register_script('jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', '','',true);
		wp_enqueue_script('jquery');
		wp_register_script('myscript', get_template_directory_uri().'/assets/js/ui.js', array('jquery'), '1.0', true );
		wp_enqueue_script('myscript');
    	}
    }
}
add_action('wp_enqueue_scripts', 'load_scripts');

?>