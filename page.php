<?php get_header(); ?>

  <?php while ( have_posts() ) : the_post(); ?>

    <article id="post-<?php the_ID(); ?>" class="page-inner">
      <header class="entry-header">
        <h1 class="entry-title"><?php the_title(); ?></h1>
      </header><!-- .entry-header -->
      <div class="entry-content">
        <?php the_content(); ?>
      </div><!-- .entry-content -->
    </article><!-- #post -->

  <?php endwhile; ?>

<?php get_footer(); ?>