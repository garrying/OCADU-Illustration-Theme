<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<!--
. 　　　　　 ✫  　　　　  ˚  * 　　* 　　 .   +  　　　  ·. ˚  * 　 ✺ 　 .  ˚ .  
 ˚ 　　　　　　  ·. ˚  * 　　 ˚  ✺  *  　       ˚  ✺  *  　
　* 　　 .   +     * 　　 .   + * 　✷   ·     ✧　　　　　 ✹ 　   ✧ ·　  ˚  * 　　* 　
 _____   ____     ______  ____        __  __          ___       __      _  ______    
/\  __`\/\  _`\  /\  _  \/\  _`\     /\ \/\ \       /'___`\   /'__`\  /' \/\  ___\   
\ \ \/\ \ \ \/\_\\ \ \L\ \ \ \/\ \   \ \ \ \ \     /\_\ /\ \ /\ \/\ \/\_, \ \ \__/   
 \ \ \ \ \ \ \/_/_\ \  __ \ \ \ \ \   \ \ \ \ \    \/_/// /__\ \ \ \ \/_/\ \ \___``\ 
  \ \ \_\ \ \ \L\ \\ \ \/\ \ \ \_\ \   \ \ \_\ \      // /_\ \\ \ \_\ \ \ \ \/\ \L\ \
   \ \_____\ \____/ \ \_\ \_\ \____/    \ \_____\    /\______/ \ \____/  \ \_\ \____/
    \/_____/\/___/   \/_/\/_/\/___/      \/_____/    \/_____/   \/___/    \/_/\/___/ 
                                                                                     
  * 　✷   ·  　　 ✵  .· .* 　✷   ·  　　 ✵  .· . * 　✷       .* 
   ✧　　　　　 ✹ 　   ✧ · ˚  ✺  *  　            ✺ 　 .  ˚ .      ✺ 　
    *  　　　　 .    · 　  ✺ 　　　 ✹  ˚  ✧ ✵  ˚  ✺  *  　
-->

<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  
  <?php wp_head(); ?>

  <script src="//use.typekit.net/gmd4pmi.js"></script>
  <script>try{Typekit.load();}catch(e){}</script>

</head>

<body <?php body_class(); ?>>
  <div id="loader"></div>
  <header id="app-head" class="heading hidden" role="banner">
    <div class="container">
        
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo" rel="home" title="OCAD U Illustration"><?php bloginfo( 'name' ); ?></a>

        <div class="item year-indicator">
          <?php 
            $grad_year = get_terms('gradyear', 'hide_empty=1&order=DESC'); 
            if (is_singular('illustrator')) {
              // Selected menu state for individual items
              $terms = get_the_terms( $post->ID , 'gradyear' );
              foreach ( $terms as $term ) {
                $selected_year = $term->name;
              }
            } else {
              $taxonomy = get_queried_object();
              if (isset($taxonomy)) {
                $selected_year = $taxonomy->name;
              }
            }
          ?>
          <!--<span class="year-current"><?php if (isset($selected_year)) { echo $selected_year; } else { echo('2015'); }  ?></span>
 -->
        </div>

        <div id="year-widget">
          
          <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" id="clock">
            <path class="clock-face" fill="#999" d="M15.5 1C23.5 1 30 7.5 30 15.5S23.5 30 15.5 30 1 23.5 1 15.5 7.5 1 15.5 1m0-1C6.9 0 0 6.9 0 15.5S6.9 31 15.5 31 31 24.1 31 15.5 24.1 0 15.5 0z"/>
            <line class="hour-hand" fill="none" stroke="#999999" stroke-linecap="round" stroke-miterlimit="10" x1="15.5" y1="3.7" x2="15.5" y2="19.3"/>
            <line class="minute-hand" fill="none" stroke="#999999" stroke-linecap="round" stroke-miterlimit="10" x1="11.9" y1="14" x2="22.3" y2="18.3"/>
          </svg>
          
          <nav class="hidden">
            <ul>
              <?php foreach( $grad_year as $year ) {
                if (isset($selected_year) && $selected_year == $year->name) {
                  echo "<li class='year-item active'>";
                } else {
                  echo "<li class='year-item'>";
                }
                  echo "<a href='". get_term_link( $year->slug, 'gradyear' )."' title='View Work From ".$year->name."'>".$year->name."</a>";
                echo "</li>";
              }
              ?>
            </ul>
          </nav> <!-- #year-Select-->
        </div> <!-- #year-widget-->

        <div class="search hidden" role="search">
          <div class="search-container">
            <?php get_search_form(); ?>
          </div>
        </div><!-- #search -->
        <?php if (is_singular('illustrator')) 
    echo '<a class="item" id="year-back-button" href="/year/'. $term->slug .'" title="Return to '.$term->name.' grid"><span>' . $term->name . '</span></a>';  
  ?>
        
       
        <nav id="access" class="hidden" role="navigation">
          <h3 class="hidden"><?php _e( 'Main menu', 'ocaduillustration' ); ?></h3>
          <?php wp_nav_menu( array( 
            'container' =>false,
            'menu_class' => 'nav',
            'theme_location' => 'primary' )
            ); ?>     
        </nav><!-- #access -->

    </div><!-- .container -->
  </header><!-- #app-head -->


  <main id="content" role="main">
