<?php $categories = get_the_terms( $this->ID , 'gradyear' ); ?>

<?php if ( $categories ) : ?>
  <div class="amp-wp-meta amp-wp-posted-on">
    <?php
      foreach ( $categories as $year ) {
        echo esc_html( $year->name );
      }
    ?>
  </div>
<?php endif; ?>
