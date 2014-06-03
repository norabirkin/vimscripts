<?php
abstract class ProcessSbssListData {
    private $sbss;
    protected $includeInvalidEntries = false;
    protected $results = array();
    private $managers = array();
    private $clients = array();
    public function __construct($sbss) {
        $this->sbss = $sbss;
    }
    private function getItemParam($function, $property, $field, $id, $param) {
        $items = $this->$property;
        if (!isset($items[$id])) {
            if (!($data = $this->lanbilling()->get($function, array(
                'id' => $id
            )))) {
                if (!$this->includeInvalidEntries) {
                    throw new Exception();
                }
                $items[$id] = false;
            } else {
                $val = $data->$field;
                $items[$id] = $val;
            }
            $this->$property = $items;
        }
        if (!$items[$id]) {
            return null;
        } else {
            return $items[$id]->$param;
        }
    }
    protected function getManagerParam($id, $param) {
        return $this->getItemParam('getManager', 'managers', 'manager', $id, $param);
    }
    protected function getClientParam($id, $param) {
        return $this->getItemParam('getAccount', 'clients', 'account', $id, $param);
    }
    protected function lanbilling() {
        return $this->sbss->lanbilling;
    }
    abstract public function process($item);
    public function getData() {
        return $this->results;
    }
}

class ProcessTicketsListData extends ProcessSbssListData {
    private $statuses;
    public function __construct($sbss) {
        parent::__construct($sbss);
        $this->initStatuses();
    }
    private function initStatuses() {
        foreach ($this->toArray($this->lanbilling()->get('getSbssStatuses')) as $item) {
            $this->statuses[$item->id] = $item;
        }
    }
    private function toArray($value) {
        if (!$value) {
            return array();
        }
        if (!is_array($value)) {
            return array($value);
        }
        return $value;
    }
    private function getStatusParam($id, $param) {
        if ($this->statuses[$id]) {
            return $this->statuses[$id]->$param;
        } else {
            if (!$this->includeInvalidEntries) {
                throw new Exception();
            }
            return null;
        }
    }
    private function getFilesCount($id) {
        $result = 0;
        if (!($data = $this->lanbilling()->get('getSbssTicket', array(
            'id' => $id
        )))) {
            return 0;
        }
        $posts = $this->toArray($data->posts);
        foreach ($posts as $item) {
            $result += count($this->toArray($item->files));
        }
        return $result;
    }
    private function getAuthorMail($item) {
        if ($item->authortype) {
            return $this->getClientParam($item->authorid, 'email');
        } else {
            return $this->getManagerParam($item->authorid, 'email');
        }
    }
    public function process($item) {
        try {
            $this->results[] = array(
                'id' => $item->id,
                'status' => $this->getStatusParam($item->statusid, 'descr'),
                'title' => $item->name,
                'author' => $item->authorname,
                'last' => $item->respondentname,
                'responsible' => $item->responsiblemanname,
                'trcolor' => $item->classcolor ? $item->classcolor : 'ffffff',
                'statuscolor' => $this->getStatusParam($item->statusid, 'color'),
                'uid' => $item->authortype ? $item->authorid : 0,
                'authormail' => $item->authormail,
                'personid' => $item->authortype ? 0 : $item->authorid,
                'authortime' => $item->createdon,
                'answers' => $item->replies,
                'answertime' => $item->lastpost,
                'manview' => $item->managerlock != -1 ? $item->managerlockname : '',
                'files' => $item->filescount
            );
        } catch (Exception $e) {
        }
    }
}

class ProcessFilesListData extends ProcessSbssListData {
    public function process($item) {
        $this->results[] = array(
            'id' => $item->id,
            'created' => $item->createdon,
            'edited' => $item->editedon,
            'author' => $item->authorname,
            'descr' => $item->description,
            'file' => $item->originalname,
            'size' => $item->size / 1000
        );
    }
}

class SbssAsync {
    private $statuses;
    private $lanbilling;
    public function __construct($lanbilling) {
        $this->lanbilling = $lanbilling;
    }
    private function toArray($value) {
        if (!$value) {
            return array();
        }
        if (!is_array($value)) {
            return array($value);
        }
        return $value;
    }
    private function getStatuses() {
        if ($this->statuses === null) {
            foreach ($this->toArray($this->lanbilling->get('getSbssStatuses')) as $item) {
                $this->statuses[] = $item;
            }
        }
        return $this->statuses;
    }
    private function getStatusesParam() {
        $ids = array();
        foreach ($this->getStatuses() as $item) {
            if ($item->displaydefault) {
                $ids[] = $item->id;
            }
        }
        return array(
            'statusids' => $ids
        );
    }
    private function getSearchParams() {
        $params = array();
        $search = trim($_POST['search']);
        if (!$search) {
            return $params;
        }
        if (preg_match('/^[0-9]+$/', $search)) {
            $params['recordid'] = $search;
        } elseif (preg_match('/^[0-9]+[ ]*-[ ]*[0-9]+$/', $search)) {
            $search = explode('-', $search);
            $params['recordid'] = trim($search[0]);
            $params['recordidend'] = trim($search[1]);
        } elseif (preg_match('/^[0-9]+([ ]*,[ ]*[0-9]+)+$/', $search)){
            $search = str_replace(' ', '', $search);
            $params['recordids'] = explode(',', $search);
        } else {
            $params['fullsearch'] = $search;
        }
        return $params;
    }
    public function getFilter() {
        if (!($params = $this->getSearchParams())) {
            $params = $this->getStatusesParam();
        }
        return $params;
    }
}

function getTicketsListData( &$sbss, &$localize ) {
    $s = new SbssAsync($sbss->lanbilling);
    $params = $s->getFilter();
    $params['pgsize'] = ($_POST['limit']) ? (int) $_POST['limit'] : 100;
    $params['pgnum'] = (int) $sbss->lanbilling->linesAsPageNum($params['pgsize'], ((int) $_POST['start']) + 1);
    $total = $sbss->lanbilling->get('Count', array('flt' => $params, 'procname' => 'getSbssTickets'));
    $tickets = $sbss->lanbilling->get('getSbssTickets', array(
        'flt' => $params
    ));
    if (!$tickets) {
        $tickets = array();
    }
    if (!is_array($tickets)) {
        $tickets = array($tickets);
    }
    $processor = new ProcessTicketsListData($sbss);
    foreach ($tickets as $item) {
        $processor->process($item);
    }
    echo json_encode(array(
        'success' => true,
        'results' => $processor->getData(),
        'total' => $total
    ));
}

function getPostsDataJSON( &$sbss, &$localize ) {
    $data = array();
    $result = $sbss->lanbilling->get('getSbssTicket', array(
        'id' => $_POST['ticketId']
    ));
    if (!$result->posts) {
        $result->posts = array();
    }
    if (!is_array($result->posts)) {
        $result->posts = array($result->posts);
    }
    foreach ($result->posts as $item) {
        $processor = new ProcessFilesListData($sbss);
        if (!$item->files) {
            $item->files = array();
        }
        if (!is_array($item->files)) {
            $item->files = array($item->files);
        }
        foreach ($item->files as $file) {
            $processor->process($file);
        }
        $data[] = array(
            'content' => $item->post->text,
            'author' => $item->post->authorname,
            'date' => $item->post->createdon,
            'postid' => $item->post->id,
            'spec' => $item->post->spec,
            'authorid' => $item->post->authortype ? 0 : $item->post->authorid,
            'files' => json_encode($processor->getData())
        );
    }
    if (!($statuses = $sbss->lanbilling->get('getSbssStatuses'))) {
        $statuses = array();
    }
    if (!is_array($statuses)) {
        $statuses = array($statuses);
    }
    $statusname = '';
    foreach ($statuses as $status) {
        if ($status->id == $result->ticket->statusid) {
            $statusname = $status->descr;
        }
    }
    return array(
        'ticket' => array(
            'name' => $result->ticket->name,
            'id' => $result->ticket->id,
            'locked' => $result->ticket->managerlock != -1 && $result->ticket->managerlock != $sbss->lanbilling->manager,
            'status' => $statusname,
            'statusid' => $result->ticket->statusid,
            'responsibleman' => $result->ticket->responsibleman,
            'classid' => $result->ticket->classid
        ),
        'posts' => $data
    );
}

function getPostsData( &$sbss, &$localize ) {
    echo json_encode(getPostsDataJSON($sbss, $localize));
}

function lockTicketAsync( &$sbss, &$localize ) {
    if (!$sbss->lanbilling->delete('lockSbssTicket', array(
        'id' => $_POST['lockticket'],
        'lock' => (boolean) $_POST['lock']
    ))) {
        echo json_encode(array(
            'success' => false,
            'errors' => array(
                'reason' => $sbss->lanbilling->soapLastError()->detail ? $sbss->lanbilling->soapLastError()->detail : $localize->get('Unknown error')
            )
        ));
        die();
    }
    echo json_encode(array(
        'success' => true,
        'results' => true
    ));
}

function delPostAsync( &$sbss, &$localize ) {
    if (!$sbss->lanbilling->delete('delSbssPost', array(
        'id' => $_POST['delpost']
    ))) {
        echo json_encode(array(
            'success' => false,
            'errors' => array(
                'reason' => $sbss->lanbilling->soapLastError()->detail ? $sbss->lanbilling->soapLastError()->detail : $localize->get('Unknown error')
            )
        ));
        die();
    }
    echo json_encode(array(
        'success' => true,
        'results' => true
    ));
}

function savePostAsync( &$sbss, &$localize ) {
    if (!$sbss->lanbilling->save('insupdSbssTicket', array(
        'name' => $_POST['theme'],
        'id' => $_POST['ticketid'],
        'statusid' => $_POST['status'],
        'responsibleman' => $_POST['responsible'],
        'classid' => $_POST['rqclass'],
        'vgid' => 0
    ), false)) {
        echo json_encode(array(
            'success' => false,
            'errors' => array(
                'reason' => $sbss->lanbilling->soapLastError()->detail ? $sbss->lanbilling->soapLastError()->detail : $localize->get('Unknown error')
            )
        ));
        die();
    }
    if (!$sbss->lanbilling->save('insupdSbssPost', array(
        'text' => $_POST['body'],
        'id' => $_POST['postid'],
        'ticketid' => $_POST['ticketid'],
        'spec' => (int) $_POST['spec']
    ), !$_POST['postid'])) {
        echo json_encode(array(
            'success' => false,
            'errors' => array(
                'reason' => $sbss->lanbilling->soapLastError()->detail ? $sbss->lanbilling->soapLastError()->detail : $localize->get('Unknown error')
            )
        ));
        die();
    }
    $postid = $sbss->lanbilling->saveReturns->ret;
    $sbssFiles = new SBSSFiles($sbss->connection);
    $sbssFiles->preUploadCheck("attach");
    foreach($sbssFiles->files as $fileData) {
        if ($sbss->lanbilling->save('insupdSbssPostFile', array(
            'id' => 0,
            'ticketid' => $_POST['ticketid'],
            'postid' => $postid,
            'authortype' => 1,
            'editedtype' => 1,
            'size' => $fileData['size'],
            'originalname' => $fileData['name'],
            'description' => $_POST['descr'][$fileData['id']]
        ), true)) {
            $fileId = $sbss->lanbilling->saveReturns->ret;
            $sbssFiles->saveFile($fileData["tmp_name"], $sbss->settings->commonSettings["sbss_ticket_files"] . "/" . sprintf($sbssFiles->postFileTemplate, $fileId));
        }
    }
    echo json_encode(array(
        'success' => true,
        'results' => true
    ));
}
?>
