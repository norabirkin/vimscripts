<?php

class Sbss_Helper extends LBWizardItem {
    private $statuses;
    public function statuses() {
        if ($this->statuses === null) {
            $this->statuses = array();
            foreach ($this->a('getSbssStatuses') as $item) {
                $this->statuses[$item->id] = $item;
            }
        }
        return $this->statuses;
    }
    public function status($id) {
        $this->statuses();
        return $this->statuses[$id];
    }
    public static function fakeTickets() {
        yii::import('application.components.helpers.Obj');
        return array(
            Obj::get(array(
                'id' => '209',
                'authortype' => '1',
                'authorid' => '5391',
                'respondenttype' => '1',
                'respondentid' => '5391',
                'responsibleman' => '0',
                'classid' => '1',
                'replies' => '0',
                'statusid' => '5',
                'managerlock' => '0',
                'vgid' => '0',
                'name' => '111',
                'createdon' => '2014-01-23 11:17:31',
                'lastpost' => '2014-01-23 11:17:31',
                'classname' => 'Новый класс',
                'classcolor' => '003300',
                'authorname' => 'Ювачев Даниил Иванович',
                'respondentname' => 'Ювачев Даниил Иванович'
            
            )),
            Obj::get(array(
                'id' => '212',
                'authortype' => '1',
                'authorid' => '5391',
                'respondenttype' => '1',
                'respondentid' => '5391',
                'responsibleman' => '4',
                'classid' => '2',
                'replies' => '0',
                'statusid' => '7',
                'managerlock' => '0',
                'vgid' => '0',
                'name' => 'www',
                'createdon' => '2014-05-19 09:24:48',
                'lastpost' => '2014-05-20 06:49:05',
                'classname' => 'tech',
                'classcolor' => '',
                'authorname' => 'Ювачев Даниил Иванович',
                'respondentname' => 'Ювачев Даниил Иванович'
            
            )),
            Obj::get(array(
                'id' => '213',
                'authortype' => '1',
                'authorid' => '5391',
                'respondenttype' => '1',
                'respondentid' => '5391',
                'responsibleman' => '0',
                'classid' => '1',
                'replies' => '0',
                'statusid' => '5',
                'managerlock' => '0',
                'vgid' => '0',
                'name' => 'rrreeewwwwww',
                'createdon' => '2014-05-19 10:18:04',
                'lastpost' => '2014-05-20 11:04:06',
                'classname' => 'Новый класс',
                'classcolor' => '003300',
                'authorname' => 'Ювачев Даниил Иванович',
                'respondentname' => 'Ювачев Даниил Иванович'
            
            ))
        );
    }
    public static function fakePosts() {
        yii::import('application.components.helpers.Obj');
        return Obj::get(array(
            'ticket' => Obj::get(array(
                'id' => '212',
                'authortype' => '1',
                'authorid' => '5391',
                'respondenttype' => '1',
                'respondentid' => '5391',
                'responsibleman' => '4',
                'classid' => '2',
                'replies' => '0',
                'statusid' => '7',
                'managerlock' => '0',
                'vgid' => '0',
                'name' => 'www',
                'createdon' => '2014-05-19 09:24:48',
                'lastpost' => '2014-05-20 06:49:05',
                'classname' => 'tech',
                'classcolor' => '',
                'authorname' => 'Ювачев Даниил Иванович',
                'respondentname' => 'Ювачев Даниил Иванович'
            )),
            'posts' => array(
                Obj::get(array(
                    'post' => Obj::get(array (
                        'id' => '208',
                        'ticketid' => '212',
                        'authortype' => '1',
                        'authorid' => '5391',
                        'spec' => '0',
                        'createdon' => '2014-05-19 09:24:48',
                        'text' => 'qweqweqw!!!ddddaaaaaaa',
                        'authorname' => 'Ювачев Даниил Иванович'
                    ))
                )),
                Obj::get(array(
                    'post' => Obj::get(array(
                        'id' => '212',
                        'ticketid' => '212',
                        'authortype' => '1',
                        'authorid' => '5391',
                        'spec' => '0',
                        'createdon' => '2014-05-20 06:40:37',
                        'text' => 'Message # 2',
                        'authorname' => 'Ювачев Даниил Иванович'
                    ))
                )),
                Obj::get(array(
                    'post' => Obj::get(array(
                        'id' => '213',
                        'ticketid' => '212',
                        'authortype' => '1',
                        'authorid' => '5391',
                        'spec' => '0',
                        'createdon' => '2014-05-20 06:49:05',
                        'text' => 'Message # 3',
                        'authorname' => 'Ювачев Даниил Иванович'
                    ))
                ))
            )
        ));
    }
}

?>
