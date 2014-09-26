<?php
class ScrollingController extends Controller {

    public function actionList() {
        $list = $_list = array();
        $max = $count = 6000;
        $start = (  ((int) $this->param("start")) + 1);
        if ($start >= $max) {
            $this->success( $list, $max );
        }
        $limit = $this->param("limit");
        $end = ( $limit ) ? ( $limit + $start - 1 ) : $max;
        if ($end > $max) {
            $end = $max;
        }
        $query = $this->param( "query", null );
        for ($i = 1; $i <= $max; $i ++) {
            $name = "item-$i";
            if ($query === null OR strpos( $name, $query ) !== false) {
                $_list[] = array( "id" => $i, "name" => $name );
            } else {
                $count --;
            }
        }
        for ($i = $start; $i <= $end; $i ++) {
            if ($i > count( $_list )) {
                break;
            }
            $list[] = $_list[ $i - 1 ];
        }
        $this->success( $list, $count );
    }

} ?>
