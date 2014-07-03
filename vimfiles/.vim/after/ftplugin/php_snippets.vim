if !exists('loaded_snippet') || &cp
    finish
endif

let st = g:snip_start_tag
let et = g:snip_end_tag
let cd = g:snip_elem_delim

exec "Snippet elseif elseif (".st.et.") {<CR>".st.et."<CR>}"
exec "Snippet do do<CR>{<CR>".st.et."<CR><CR>} while ( ".st.et." );<CR>".st.et
exec "Snippet reql require_once( '".st."file".et."' );<CR>".st.et
exec "Snippet if? $".st."retVal".et." = ( ".st."condition".et." ) ? ".st."a".et." : ".st."b".et." ;<CR>".st.et
exec "Snippet phpp <?php<CR><CR>".st.et."<CR><CR>?>"
exec "Snippet switch switch (".st.et.") {<CR>case ".st.et.":<CR><tab>".st.et."<CR>break;<CR><bs><bs><bs><bs>".st.et."<CR>}"
exec "Snippet class #doc<CR>#classname:".st."ClassName".et."<CR>#scope:".st."PUBLIC".et."<CR>#<CR>#/doc<CR><CR>class ".st."ClassName".et." ".st."extendsAnotherClass".et."<CR>{<CR>#internal variables<CR><CR>#Constructor<CR>function __construct ( ".st."argument".et.")<CR>{<CR>".st.et."<CR>}<CR>###<CR><CR>}<CR>###".st.et
exec "Snippet incll include_once( '".st."file".et."' );".st.et
exec "Snippet incl include( '".st."file".et."' );".st.et
exec "Snippet foreach foreach (".st.et." as ".st.et.") {<CR>".st.et."<CR>}"
exec "Snippet ifelse if ( ".st."condition".et." )<CR>{<CR>".st.et."<CR>}<CR>else<CR>{<CR>".st.et."<CR>}<CR>".st.et
exec "Snippet $_ $_REQUEST['".st."variable".et."']<CR>".st.et
exec "Snippet case case ".st.et.":<CR><tab>".st.et."<CR>break;<CR><bs><bs><bs><bs>".st.et
exec "Snippet default default:<CR><tab>".st.et."<CR>break;"
exec "Snippet print print \"".st."string".et."\"".st.et.";".st.et."<CR>".st.et
exec "Snippet function ".st."public".et."function ".st."FunctionName".et." (".st.et.")<CR>{<CR>".st.et."<CR>}<CR>".st.et
exec "Snippet if if (".st.et.") {<CR>".st.et."<CR>}"
exec "Snippet else else {<CR>".st.et."<CR>}"
exec "Snippet array $".st."arrayName".et." = array( '".st.et."',".st.et." );".st.et
exec "Snippet -globals $GLOBALS['".st."variable".et."']".st.et.st."something".et.st.et.";<CR>".st.et
exec "Snippet req require( '".st."file".et."' );<CR>".st.et
exec "Snippet for for ( $".st.et." = ".st.et."; $".st.et." < ".st.et."; $".st.et."++ ){<CR>".st.et."<CR>}"
exec "Snippet while while (".st.et.") {<CR>".st.et."<CR>}"
exec "Snippet a? <?php<cr><cr>return array(<cr>".st.et."<cr>);<cr><cr>?>"
exec "Snippet P array(<cr><tab>'controller' => '".st.et."',<cr>'action' => '".st.et."',<cr>'title' => '".st.et."',<cr>'localize' => '".st.et."',<cr>'items' => array(<cr>)<cr><bs><bs><bs><bs>)"
exec "Snippet p array(<cr><tab>'action' => '".st.et."',<cr>'title' => '".st.et."'<cr><bs><bs><bs><bs>),"
exec "Snippet pu public function ".st.et."(".st.et.") {<cr>".st.et."<cr>}"
exec "Snippet pri private function ".st.et."(".st.et.") {<cr>".st.et."<cr>}"
exec "Snippet pro protected function ".st.et."(".st.et.") {<cr>".st.et."<cr>}"
exec "Snippet c class ".st.et." {<cr>".st.et."<cr>}"
exec "Snippet w <?php<cr><cr>class ".st.et." extends LBWizardAction {<cr>public function __getWizard() {<cr>return new LBWizard(array(<cr><tab>'steps' => array(<cr><tab>".st.et."<cr><bs><bs><bs><bs>)<cr><bs><bs><bs><bs>));<cr>}<cr>}<cr><cr>?>"
exec "Snippet fw <?php<cr><cr>class ".st.et." extends LBWizardStep {<cr>public function output() {<cr>return $this->fnext(array(<cr><tab>".st.et."<cr><bs><bs><bs><bs>))->render();<cr>}<cr>public function title() {<cr>return '".st.et."';<cr>}<cr>}<cr><cr>?>"
exec "Snippet fi <?php<cr><cr>class ".st.et." extends LBWizardFinalStep {<cr>public function execute() {<cr>".st.et."<cr>}<cr>protected function getSuccessMessage() {<cr>return '".st.et."';<cr>}<cr>protected function getErrorMessage() {<cr>return '".st.et."';<cr>}<cr>}<cr><cr>?>"
exec "Snippet co <?php<cr><cr>class ".st.et." extends WRestController {<cr>public function actionList() {<cr>".st.et."<cr>}<cr>}<cr><cr>?>"
exec "Snippet suc $this->success(".st.et.");"
exec "Snippet callA yii::app()->japi->callAndSend('".st.et."')".st.et
exec "Snippet ac public function actions() {<cr>return array(<cr><tab>".st.et."<cr><bs><bs><bs><bs>);<cr>}"
exec "Snippet gw <?php<cr><cr>class ".st.et." extends LBWizardStep {<cr>private function data() {<cr>".st.et."<cr>}<cr>public function row($row) {<cr>return array(<cr><tab>".st.et."<cr><bs><bs><bs><bs>);<cr>}<cr>public function output() {<cr>return $this->grid(array(<cr><tab>'title' => '".st.et."',<cr>'columns' => array(<cr><tab>".st.et."<cr><bs><bs><bs><bs>),<cr>'data' => $this->data(),<cr>'processor' => array($this, 'row')<cr><bs><bs><bs><bs>))->render();<cr>}<cr>public function title() {<cr>return yii::t('main', '".st.et."');<cr>}<cr>}<cr><cr>?>"
exec "Snippet int (int) $this->param('".st.et."')".st.et
exec "Snippet flo (float) $this->param('".st.et."')".st.et
exec "Snippet boo (bool) $this->param('".st.et."')".st.et
exec "Snippet str (string) $this->param('".st.et."')".st.et
exec "Snippet it '".st.et."' => ".st.et
exec "Snippet call yii::app()->japi->call('".st.et."', array(<cr><tab>".st.et."<cr><bs><bs><bs><bs>))".st.et
exec "Snippet arr array(<cr><tab>".st.et."<cr><bs><bs><bs><bs>)"
exec "Snippet send yii::app()->japi->send(".st.et.");".st.et
exec "Snippet dump Dumper::dump(".st.et.");"
exec "Snippet list public function actionList() {<cr>".st.et."<cr>}" 
exec "Snippet upd public function actionUpdate() {<cr>".st.et."<cr>}" 
exec "Snippet cre public function actionCreate() {<cr>".st.et."<cr>}" 
exec "Snippet del public function actionDelete() {<cr>".st.et."<cr>}" 
"exec \"Snippet get public function actionGet() {<cr>\".st.et.\"<cr>}" 
exec "Snippet get $sbss->lanbilling->get('".st.et."')"
"exec \"Snippet pg $list = new OSSList;<cr>$list->get('\".st.et.\"'\".st.et.\");\".st.et
exec "Snippet pg $".st.et."['pgsize'] = ($_POST['limit']) ? (int) $_POST['limit'] : 100;<cr>$".st.et."['pgnum'] = (int) ".st.et."lanbilling->linesAsPageNum($params['pgsize'], ((int) $_POST['start']) + 1);"
exec "Snippet to ".st.et."lanbilling->get('Count', array('flt' => ".st.et.", 'procname' => '".st.et."'));"
exec "Snippet pgp $list = new OSSList;<cr>$data = $list->getList('".st.et."'".st.et.");<cr>$result = array();<cr>foreach ($data['result']->getResult() as $item) {<cr>".st.et."<cr>}".st.et."<cr>$this->success($result, $data['total']->getResult());"
exec "Snippet fake yii::app()->japi->useFake();<cr>yii::app()->japi->fakeConnection(<cr><cr><tab>FRequest::get()<cr>->auth()<cr>".st.et.",<cr><cr>FResponse::get()<cr>->auth()<cr>".st.et."<cr><bs><bs><bs><bs>);"
exec "Snippet fcal ->call('".st.et."'".st.et.")".st.et
exec "Snippet fres ->result(".st.et.")".st.et
exec "Snippet log yii::log(".st.et.", 'vardump', Logger::getAliasOfPath(__FILE__));"
exec "Snippet act public function action".st.et."() {<cr>".st.et."<cr>}"
exec "Snippet try try {<cr>".st.et."<cr>} catch (Exception $e) {<cr>".st.et."<cr>}".st.et
exec "Snippet on public function on".st.et."( CEvent $event ) {<cr>$this->raiseEvent('on".st.et."', $event);<cr>}"
exec "Snippet att attachEventHandler('on".st.et."', array(".st.et.", '".st.et."'));"
exec "Snippet js echo json_encode(array(<cr><tab>'results' => ".st.et."<cr><bs><bs><bs><bs>));"
exec "Snippet err echo json_encode(array(<cr><tab>'results' => array(<cr><tab>'success' => false,<cr>'errors' => array(<cr><tab>'reason' => $localize->get('".st.et."')<cr><bs><bs><bs><bs>)<cr><bs><bs><bs><bs>)<cr><bs><bs><bs><bs>));"
