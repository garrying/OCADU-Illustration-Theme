<article <?php post_class(); ?>>
	<header class="entry-header">
		<h1 class="entry-title"><?php the_title(); ?></h1>
	</header><!-- .entry-header -->

	<div class="entry-content">
		
		<?php
			    $gallery_shortcode = '[gallery size="medium" columns="0"]';
					print apply_filters( 'the_content', $gallery_shortcode );
		?>
			
				<?php if ( get_post_meta($post->ID, 'illu_sites', true) ) : ?>
					<div class="info site"><p><a title="Visit illustrator's website" href="<?php echo get_post_meta($post->ID, 'illu_sites', true) ?>"><?php echo get_post_meta($post->ID, 'illu_sites', true) ?></a></p></div>
				<?php endif; ?>

				<?php if ( get_post_meta($post->ID, 'illu_sites_2', true) ) : ?>
					<div class="info site"><p><a title="Visit illustrator's website" href="<?php echo get_post_meta($post->ID, 'illu_sites_2', true) ?>"><?php echo get_post_meta($post->ID, 'illu_sites_2', true) ?></a></p></div>
				<?php endif; ?>

				<?php if ( get_post_meta($post->ID, 'illu_email', true) ) : ?>
				 <div class="info email"><p><a title="Email <?php the_title(); ?>" href="mailto:<?php echo get_post_meta($post->ID, 'illu_email', true) ?>"><?php echo get_post_meta($post->ID, 'illu_email', true) ?></a></p></div>
				<?php endif; ?>

				<?php if ( get_post_meta($post->ID, 'illu_phone', true) ) : ?>
				 <div class="info phone"><p><?php echo get_post_meta($post->ID, 'illu_phone', true) ?></p></div>
				<?php endif; ?>
			
		
		<?php the_content(); ?>
		
	</div><!-- .entry-content -->

	<footer class="entry-meta">

	</footer><!-- .entry-meta -->
</article><!-- #post-<?php the_ID(); ?> -->
