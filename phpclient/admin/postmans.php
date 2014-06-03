<?php
/**
 * Postmans access control form
 */
if(isset($_POST['async_call']))
{
    if(isset($_POST['getpostmans'])) {
        getPostmans($lanbilling);
    }
    if(isset($_POST['savepostman'])) {
        savePostman($lanbilling);
    }
    if(isset($_POST['delpostman'])) {
        delPostman($lanbilling);
    }
    //if(isset($_POST['getpostmanaddr'])) {
    //    getPostmanAddr($lanbilling);
    //}
    if(isset($_POST['insUpdPostman'])) {
        insUpdPostman($lanbilling);
    }


}
else
{
    $tpl = new HTML_Template_IT(TPLS_PATH);
    $tpl->loadTemplatefile("postmans.tpl", true, true);
    $tpl->touchBlock('__global__');
    $localize->compile($tpl->get(), true);
}

function insUpdPostman( &$lanbilling ){
    $postman = (integer)$_POST['insUpdPostman'];

    if (isset($_POST['save'])){
        if ($_POST['addrList']){
            $addr = array();
            foreach (json_decode($_POST['addrList']) as $addrVal){
                switch ($addrVal->rtype){
                    case 0: $addr['streets'][]   = array("id"=>$addrVal->id); break;
                    case 1: $addr['buildings'][] = array("id"=>$addrVal->id); break;
                    case 2: $addr['agrms'][]     = array("id"=>$addrVal->id); break;
                }
            }
        }
        $struct = array(
            'recordid' => ($postman == -1) ? 0 : $postman,
            'fio' => $_POST['postmanFio']
        );
        $struct = array_merge($struct,$addr);
        if( false != ($result = $lanbilling->save("insupdPostman", $struct, (((integer)$postman < 0) ? true : false)))){
            $postman = $lanbilling->saveReturns->ret;
        } else { echo '({ success: false, errors: { reason: "Can\'t save/update postman" } })'; return;}
    }
    /**
     * Get address list
     */
    if( false != ($result = $lanbilling->get("getPostmans", array("flt" => array("postmanid" => $postman)) ))){
        if(!is_array($result->streets)) $result->streets = array($result->streets);
        if(!is_array($result->buildings)) $result->buildings = array($result->buildings);
        if(!is_array($result->agrms)) $result->agrms = array($result->agrms);

        foreach ($result->streets as $street){
            if (!empty($street->id))
            $out[] = array(
                'id'=>$street->id,
                'name'=>$street->name,
                'rtype'=>0
            );
        }
        foreach ((array)$result->buildings as $building){
            if (!empty($building->id))
            $out[] = array(
                'id'=>$building->id,
                'name'=>$building->name,
                'rtype'=>1
            );
        }
        foreach ((array)$result->agrms as $agrms){
            if (!empty($agrms->id))
            $out[] = array(
                'id'=>$agrms->id,
                'name'=>$agrms->name,
                'rtype'=>2
            );
        }
        if (is_array($out)) usort($out, "streetsSort");
        echo '({ success: true, insUpdPostman: '.$postman.',results: ' . JEncode($out, $lanbilling) . '})';
    } else echo '({ success: false, errors: { reason: "Unknown postman\'s ID" } })';
}

    /**
     * Сортировка улиц
     */
    function streetsSort($a, $b) {
        return strcmp($a["name"], $b["name"]);
    }


/**
 * Get postmans full list
 */
function getPostmans( &$lanbilling ) {
    $_tmp = array();
    if( false != ($result = $lanbilling->get("getPostmans")) ) {
        if(!is_array($result)) {
            $result = array($result);
        }
        array_walk($result, create_function('$item, $key, $_tmp', '
            if($_tmp[1]->postman > 0 && $item->recordid == 0){
                return;
            };
            $_tmp[0][] = array(
                "postmanId" => $item->recordid,
                "postmanFio" => $item->fio
            );
        '), array( &$_tmp, &$lanbilling ));
    }
    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    } else {
        echo "({ results: '' })";
    }
} // end getPostmans()

/**
 * Get main fields values for the selected postman
 */
function getPostman( &$lanbilling ) {
    if((integer)$_POST['getpostman'] >= 0) {
        if( false != ($result = $lanbilling->get("getPostmans", array("flt" => array("postmanid" => (integer)$_POST['getpostman'])) )) ) {
            if(!is_array($result)) {
                $result = array($result);
            }
            array_walk($result, create_function('$item, $key, $_tmp','
                if($item->recordid > 0) {
                    $_tmp[0][] = array(
                        "recordid" => $item->recordid,
                        "fio" => $item->fio
                    );
                };
            '), array( &$_tmp ));
            echo '({ success: true, data: ' . JEncode($_tmp, $lanbilling) . '})';
        }
        else echo '({ success: false, data: ' . JEncode($_tmp, $lanbilling) . '})';
    } else echo '({ success: false, errors: { reason: "Unknown postman\'s ID" } })';
} // end getPostmans()


/**
 * Delete selected postman
 */
function delPostman( &$lanbilling )
{
    if((integer)$_POST['delpostman'] <= 0) {
        echo '({ success: false, errors: { reason: "Unknown postman\'s ID" } })';
        return false;
    }
    if( false == $lanbilling->delete("delPostman", array("id" => $_POST['delpostman']), array("getPostmans")) ) {
        echo '({ success: false, errors: { reason: "There was an error while deleting postman. Look server logs for details" } })';
    }
    else echo '({ success: true })';
} // end delPostman()
