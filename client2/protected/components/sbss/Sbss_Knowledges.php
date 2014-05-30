<?php class Sbss_Knowledges extends Sbss {
    protected function downloadAction() {
        return 'site/kbdownload';
    }
    protected function onError() {
        yii::app()->controller->redirect(array('site/kb'));
    }
    protected function template() {
        return yii::app()->controller->lanbilling->knowledgeFileTemplate;
    }
    public function getKnowledges() {
        $result = array();
        $data = yii::app()->lanbilling->getRows("getSbssKnowledges");
        foreach ( $data as $item ) {
            if ($posts = $this->getPosts($item->id)) {
                $item->posts = $posts;
                $result[] = $item;
            }
        }
        return $result;
    }
    private function getPosts($id) {
        $data = array();
        $result = yii::app()->lanbilling->get("getSbssKnowledge", array("id" => $id ));
        if (!$result->posts) return array();
        $posts = is_array($result->posts) ? $result->posts : array($result->posts);
        foreach ($posts as $post) {
            if ($post->post->spec) {
                continue;
            }
            $post->files = $this->getFiles($post);
            $data[] = $post;
        }
        return $data;
    }
} ?>
