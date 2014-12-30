<article <?php post_class(); ?> role="article">
  <div id="illustrator-meta" role="complementary">
  <div class="illustrator-meta-wrapper">

    <div class="illustrator-meta-description">

      <?php if ( get_post_meta($post->ID, 'illu_title', true) ) : ?>
        
        <?php
          $title_illu = get_post_meta($post->ID, 'illu_title', true);
          $text = '<h2 class="thesis-title p-name">' . $title_illu . '</h2>' . get_the_content(); 
          echo apply_filters('the_content', $text);
        ?>

      <?php else: ?>
        
        <?php 
          $text = get_the_content(); 
          echo apply_filters('the_content', $text); 
        ?>
      
      <?php endif; ?>

    </div>

    <div class="illustrator-meta-detail">
      <header class="illustrator-meta-header">
        <h1 class="illustrator-meta-name p-author"><?php the_title(); ?></h1>
      </header><!-- .entry-header -->
        
      <?php if ( get_post_meta($post->ID, 'illu_sites', true) ) : ?>
        <div class="meta site truncate u-url"><a title="Visit Illustrator's Website" target="_blank" href="<?php echo get_post_meta($post->ID, 'illu_sites', true) ?>"><?php echo get_post_meta($post->ID, 'illu_sites', true) ?></a></div>
      <?php endif; ?>

      <?php if ( get_post_meta($post->ID, 'illu_sites_2', true) ) : ?>
        <div class="meta site truncate u-url"><a title="Visit Illustrator's Website" target="_blank" href="<?php echo get_post_meta($post->ID, 'illu_sites_2', true) ?>"><?php echo get_post_meta($post->ID, 'illu_sites_2', true) ?></a></div>
      <?php endif; ?>

      <?php if ( get_post_meta($post->ID, 'illu_email', true) ) : ?>
        <div class="meta email truncate u-email"><a title="Email <?php the_title(); ?>" href="mailto:<?php echo get_post_meta($post->ID, 'illu_email', true) ?>"><?php echo get_post_meta($post->ID, 'illu_email', true) ?></a></div>
      <?php endif; ?>

      <?php if ( get_post_meta($post->ID, 'illu_phone', true) ) : ?>
        <div class="meta phone p-tel"><?php echo get_post_meta($post->ID, 'illu_phone', true) ?></div>
      <?php endif; ?>
    </div>

    </div>

  </div><!-- #illustrator-meta -->

  <footer class="nav-single meta hidden">
    <nav id="nav-single">
      <ul class="normalized">
        <?php if ( get_post_type() == 'event' ) : ?>
          <li class="nav-previous"><?php next_post_link_plus( array('order_by' => 'post_date', 'format' => '%link', 'in_same_tax' => true, 'link' => '<span>%title</span>') ); ?></li>
          <li class="nav-next"><?php previous_post_link_plus( array('order_by' => 'post_date', 'format' => '%link', 'in_same_tax' => true, 'link' => '<span>%title</span>') ); ?></li>
        <?php else : ?>
          <li class="nav-previous"><?php previous_post_link_plus( array('order_by' => 'post_title', 'format' => '%link', 'in_same_tax' => true, 'link' => '<span class="indicator">○</span> <span class="truncate">%title</span>') ); ?></li>
          <li class="nav-next"><?php next_post_link_plus( array('order_by' => 'post_title', 'format' => '%link', 'in_same_tax' => true, 'link' => '<span class="truncate">%title</span> <span class="indicator">●</span>') ); ?></li>
        <?php endif; ?>
      </ul>
    </nav><!-- #nav-single -->
  </footer><!-- .nav-single -->
  
  <div id="illustrator-gallery-container">
    <?php
      $gallery_shortcode = '[gallery size="medium" link="file" columns="0"]';
      print apply_filters( 'the_content', $gallery_shortcode );
    ?>
  </div>

</article><!-- <?php the_title(); ?> -->