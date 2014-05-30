<?php class SharedPostsHistoryGrid extends BaseGrid {
	protected $messagesCategory = 'account';
	protected $title = 'SharedPostsHistory';
	
	protected function AddData() {
		$sharedPosts = new SharedPosts;
		$posts = $sharedPosts->getShared();
		if(!$posts) $posts = array();
		foreach ( $posts as $post) $this->AddRow(array(
			'text' => html_entity_decode($post->text),
			'posttime' => yii::app()->controller->formatDate(strtotime($post->posttime))
		));
	}

} ?>
