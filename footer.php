</div><!-- #content -->

<?php wp_footer(); ?>

<script>
	var _gaq=[['_setAccount','UA-16173154-1'],['_trackPageview']];
	<?php if (is_404()) { ?>
	_gaq.push(['_trackPageview', '/404.html?page=' + document.location.pathname + document.location.search + '&from=' + document.referrer]);
	<?php } ?>
	(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
	g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
	s.parentNode.insertBefore(g,s)}(document,'script'));
</script>

</body>
</html>